import React, { useEffect, useState } from 'react';

import './previewIcon.scss';

import RenderIconByClassification from './render-icon-by-classification';

export default function PreviewIcon(): JSX.Element {
  const [categorySvgMap, setCategorySvgMap] = useState({});

  useEffect(() => {
    fetch('/pkg/icon/dist/@one-for-all/icon@0.4.0/svgNameMap.json')
      .then((res) => res.json())
      .then((svgNameMap) => {
        setCategorySvgMap(svgNameMap);
      });
  }, []);

  return <RenderIconByClassification categoryMap={categorySvgMap} />;
}
