import React, { useMemo } from 'react';
import cs from 'classnames';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string | React.ReactElement;
  indeterminate?: boolean;
  rounded?: boolean;
  className?: string;
}

import './style.scss';

function Checkbox(
  { className, label, indeterminate, rounded, ...inputProps }: Props,
  ref?: React.Ref<HTMLInputElement>,
): JSX.Element {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  const { style = {}, disabled } = inputProps;

  const vdom = useMemo(() => (
    <label className={cs('checkbox flex items-center', className, rounded ? 'checkbox-rounded' : '')}>
      <input
        {...inputProps}
        style={{ ...style, cursor: disabled ? 'not-allowed' : 'pointer' }}
        ref={resolvedRef}
        type="checkbox"
        className={cs('checkbox__input', {
          'checkbox__input--indeterminate': indeterminate,
        })}
      />
      {(label || rounded) && (
        <span className={rounded ? '' : 'checkbox__label text-caption ml-8'}>
          {rounded ? null : label}
        </span>
      )}
    </label>
  ), [className, rounded, inputProps, style, disabled, resolvedRef, indeterminate, label]);

  return (
    <>
      {rounded ? (
        <div className="flex items-center">
          {vdom}
          <span
            className="checkbox__label text-caption ml-8 cursor-pointer"
            onClick={() => resolvedRef?.current?.click()}
          >
            {label}
          </span>
        </div>
      ) : vdom}
    </>
  );
}

export default React.forwardRef<HTMLInputElement, Props>(Checkbox);
