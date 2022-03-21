import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

import './index.scss'
import svgNameHash from './svg-name-hash';

import ToggleClassification from './components/toggle-classification';
import RenderIconOfClassification from './components/render-icon-of-classification';

function App(): JSX.Element {
  const [classificationSvgArr, setClassificationSvgArr] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetch(svgNameHash)
      .then(res => res.json())
      .then(data => {
        setClassificationSvgArr(data)
      })
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
render(<App />, document.getElementById('app'));
