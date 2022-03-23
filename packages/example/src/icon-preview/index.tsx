import React, { useEffect, useState } from 'react';

import './index.scss';

import RenderIconByClassification from './render-icon-by-classification';
import { svgNameMap } from 'svgNameMap';

export default function PreviewIcon(): JSX.Element {
  const [categorySvgMap, setCategorySvgMap] = useState({});

  useEffect(() => {
    setCategorySvgMap(svgNameMap);
  }, []);

  return <RenderIconByClassification categoryMap={categorySvgMap} />;
}
