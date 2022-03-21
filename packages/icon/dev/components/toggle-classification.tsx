import React, { useState, useEffect } from "react";

type propsType = {
  change?: (currentIndex: number) => void
}

export default function ToggleClassification({ change } : propsType):JSX.Element {
    const [activeIndex, setActiveIndex] = useState(0)
    const colorClassification = ['单色', '双色', '彩色']
    
    useEffect(() => {
      change(activeIndex)
    }, [activeIndex])

    const changeTab = (index) => {
      if (index === activeIndex) return
      setActiveIndex(index)
    }

    return (
        <div className='classification'>
        {
          colorClassification.map((color, index) => (
            <span
              className={activeIndex === index ? 'classification-item is-active' : 'classification-item'}
              key={color}
              onClick={()=>{ changeTab(index) }}>
              { color }
            </span>
          ))
        }
      </div>
    )
}
