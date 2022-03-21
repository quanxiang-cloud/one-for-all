import React from "react";

import Icon from '../../src/index';

type propsType = {
    categoryMap: {[key: string]: Array<string>}
}

export default function RenderIconOfClassification({ categoryMap }: propsType): JSX.Element {
    return (
        <div className="show-classification">
            {
              Object.keys(categoryMap).map(category => (
                <div key={ category }>
                  <p className="category-title">{ category }</p>
                  <div className='preview-wrap'>
                    {
                      categoryMap[category].map(name => (
                        <span className='svg-item' key={name}>
                          <Icon name={name} key={name} size={32} color={'#00a971'} />
                          <span className='label'>{ name }</span>
                        </span>
                      ))
                    }
                  </div>
                </div>
              ))
            }
        </div>
    )
}
