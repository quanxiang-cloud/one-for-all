#!/usr/bin/env node

const fs=require('fs');
const http = require('http');
const {getSprite}=require('./svg-to-sprite');

const PORT = process.env.PORT_PREVIEW_ICON || 8001;

const getContent = (svgIcons='') => `
<!doctype html>
<html>
<head><title>svg icon preview</title></head>
<style>
    .preview-wrap {
      display: grid;
      grid-template-columns: repeat(6, minmax(80px, 1fr));
      grid-gap: 10px;
    }
    .svg-item {
        text-align: center;
    }
    .svg-item:hover {
        background: #ededed;
    }
    .svg-item > svg {
        width: 48px;
        height: 48px;
    }
    .svg-icon {
      width: 20px;
      height: 20px;
      color: #324558;
      fill: #B6C2CD;
      margin-right: 8px;
    }
  
</style>
<body>
${svgIcons}

<div class="preview-wrap"></div>

<script>
    var allSymbols=document.querySelectorAll('svg > symbol')
    var svgElems=[]
    allSymbols.forEach(function(item) {
      var id=item.getAttribute('id')
      
      svgElems.push('<span class="svg-item">' +
       '<svg class="svg-icon" href:link><use xlink:href="#' + id +
        '"></use></svg>' +
        '<div class="label">' + id.replace('svg-icon-', '') +
        '</div></span>'
      )
    })
    
    document.getElementsByClassName('preview-wrap')[0].innerHTML=svgElems.join('')
</script>

</body>
</html>
`;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  getSprite().then(sprite => res.end(getContent(sprite)));
});

server.listen(PORT, () => console.log(`Open http://localhost:${PORT} to preview svg icons..`));
