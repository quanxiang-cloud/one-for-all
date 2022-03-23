import React, { useEffect, useState } from 'react';

import './index.scss';

import RenderIconOfClassification from './components/render-icon-of-classification';

export default function ShowIcon(): JSX.Element {
  const [categorySvgMap, setCategorySvgMap] = useState({});

  useEffect(() => {
    // fetch(svgNameMap)
    //   .then(res => res.json())
    //   .then(data => {
    //     setClassificationSvgArr(data)
    //   })
    setCategorySvgMap({action: ["3d_rotation", "accessibility_new"]});
  }, []);

  return (
    <div>
      <RenderIconOfClassification categoryMap={categorySvgMap} />
    </div>
  );
}
