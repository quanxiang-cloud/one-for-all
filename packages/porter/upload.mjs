import path from 'path';
import undici from 'undici';
import fs from 'fs';
import { pipeline } from 'stream';
import { createHmac } from 'crypto';
import { lookup } from 'mime-types';
import { createGzip } from 'zlib';

import { ak, sk } from './key.mjs';

function uploadOne({ filePath, uploadPath }) {
  const date = new Date().toUTCString();
  const contentType = lookup(filePath);
  if (!contentType) {
    throw new Error(`failed to lookup file mine type of: ${filePath}`);
  }

  const auth = getAuthorization({ uploadPath, date, contentType });

  pipeline(
    fs.createReadStream(filePath),
    createGzip(),
    undici.pipeline(
      {
        protocol: 'https:',
        hostname: 'ofapkg.pek3b.qingstor.com',
        pathname: uploadPath,
      },
      {
        method: 'PUT',
        headers: {
          date,
          authorization: auth,
          'content-type': contentType,
          'content-encoding': 'gzip',
        },
      },
      ({ statusCode, body }) => {
        if (statusCode >= 400) {
          console.error('failed to upload file', statusCode);
        }

        return body;
      },
    ),
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
}

function getAuthorization({ uploadPath, date, contentType }) {
  const stringToSign = [
    'PUT',
    '',
    contentType,
    date,
    encodeURI(path.join('/ofapkg', uploadPath)),
  ].join('\n');
  const hmac = createHmac('sha256', sk);
  const signature = hmac.update(stringToSign).digest('base64');

  return `QS ${ak}:${signature}`;
}

uploadOne({
  filePath: '/Users/mark/playground/one-for-all/dist/@ofa/jszip@3.7.1/index.js',
  uploadPath: '/@ofa/jszip@3.7.1/index.js',
});
