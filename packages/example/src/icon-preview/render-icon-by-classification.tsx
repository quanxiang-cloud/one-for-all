import React from 'react';

import Icon from '@one-for-all/icon';

type Props = {
  categoryMap: Record<string, string[]>;
};

export default function RenderIconByClassification({ categoryMap }: Props): JSX.Element {
  return (
    <>
      {Object.entries(categoryMap).map(([categoryKey, categoryValue]) => (
        <div key={categoryKey}>
          <p className="category-title">{categoryKey}</p>
          <div className="preview-wrap">
            {categoryValue.map((name) => (
              <span className="svg-item" key={name}>
                <Icon name={name} key={name} size={32} />
                <span className="label">{name}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
