import React, { useEffect, useState } from 'react';

import './index.scss'

import ToggleClassification from './components/toggle-classification';
import RenderIconOfClassification from './components/render-icon-of-classification';

import { svgNameMap } from '@one-for-all/icon'

export default function ShowIcon(): JSX.Element {
  const [classificationSvgArr, setClassificationSvgArr] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // fetch(svgNameMap)
    //   .then(res => res.json())
    //   .then(data => {
    //     setClassificationSvgArr(data)
    //   })
    setClassificationSvgArr(svgNameMap)
  }, [])

  return (
    <div>
      <ToggleClassification change={setActiveIndex} />
      {
        classificationSvgArr.map((categoryMap, index) => (
          index === activeIndex && <RenderIconOfClassification key={index} categoryMap={categoryMap} />
        ))
      }
    </div>
  );
}
