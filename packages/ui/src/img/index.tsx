import React, { useState } from 'react';

import Icon from '../icon';

import './style.scss';

interface Props {
  className?: string;
  imageUrl?: string;
  fillMode?: string;
  preview?: boolean;
  closeOnMaskClick?: boolean;
  style?: React.CSSProperties,
}

function Image(props: Props, ref: React.LegacyRef<HTMLDivElement>): JSX.Element {
  const { imageUrl, fillMode, preview, closeOnMaskClick, style, ...rest } = props;
  const [imgPreview, setImgPreview] = useState(false);

  return (
    <>
      <div
        {...rest}
        ref={ref}
        className="img"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : '',
          backgroundSize: fillMode ? `${fillMode}` : 'cover',
          ...style,
        }}
      >
        {!imageUrl && <Icon name="add_photo_alternate" size={42} />}
        {preview && (
          <div
            className="img-preview"
            onClick={() => setImgPreview(true)}
          >
            <Icon name="search" />
          </div>
        )}
      </div>
      {imgPreview && (
        <div className="img-mask" onClick={() => closeOnMaskClick && setImgPreview(false)}>
          <div className="flex justify-between text-white">
            <div>{imageUrl}</div>
            <Icon name="close" clickable onClick={() => setImgPreview(false)} />
          </div>
          {imageUrl && <img onClick={(e) => e.stopPropagation()} className="large-img" src={imageUrl} />}
        </div>
      )}
    </>
  );
}

export default React.forwardRef(Image);
