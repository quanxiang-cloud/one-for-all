import React, { Children, isValidElement, useState, ReactElement, forwardRef, ForwardedRef, DetailedHTMLProps, InputHTMLAttributes } from 'react';

interface Props
extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>  {
  'data-node-key'?: string;
  className?: string;
  children: (boolean | ReactElement)[];
  onChange: (...args: any[]) => void;
}

function RadioGroup({  children, className, style, onChange, ...rest }: Props, ref: ForwardedRef<HTMLDivElement>,): JSX.Element {
  const [checkedIndex, setCheckedIndex] = useState(-1);
  const dataNodeKey = rest['data-node-key'] || '';

  return (
    <div ref={ref} data-node-key={dataNodeKey} style={style} className={className}>
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
    </div>
  );
}

export default forwardRef<HTMLDivElement, Props>(RadioGroup);

