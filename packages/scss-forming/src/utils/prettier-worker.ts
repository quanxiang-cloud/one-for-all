const inlinePrettierWorker = `
importScripts("https://ofapkg.pek3b.qingstor.com/prettier@2.6.2/standalone.js");
importScripts("https://ofapkg.pek3b.qingstor.com/prettier@2.6.2/parser-postcss.js");

function handleMessage({ data }) {
  const code = prettier.format(data, {
    parser: "scss",
    plugins: prettierPlugins,
  });

  self.postMessage(code);
}

self.onmessage = handleMessage;
`;

export default inlinePrettierWorker;
