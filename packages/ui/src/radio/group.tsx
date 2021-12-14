import React, { Children, isValidElement, useState, ReactElement } from 'react';

interface Props {
  children: (boolean | ReactElement)[];
  onChange: (value: string | number | boolean) => void;
}

function RadioGroup({ children, onChange }: Props): JSX.Element {
  const [checkedIndex, setCheckedIndex] = useState(-1);

  return (
    <>
      {
        Children.map(children, (child, index) => {
          if (isValidElement(child) && child.props.value !== null) {
            return React.cloneElement(child as ReactElement, {
              onChange: (value: string | number | boolean) => {
                setCheckedIndex(index);
                onChange(value);
              },
              checked: checkedIndex === index,
            });
          }
          return child;
        })
      }
    </>
  );
}

export default RadioGroup;
