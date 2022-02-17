import React, {
  forwardRef,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  Ref,
  ChangeEvent,
  useEffect,
} from 'react';
import cs from 'classnames';

import { uuid } from '../utils';
import { RadioProps } from '../types';


function InternalRadio(props: RadioProps, ref?: Ref<HTMLInputElement>): JSX.Element {
  const {
    defaultChecked, error, className, radioClass, onChange, label, checked: isChecked, disabled, ...inputProps
  } = props;
  const [checked, setChecked] = useState(defaultChecked);
  const id = uuid();

  useEffect(() => {
    setChecked(!!isChecked);
  }, [isChecked]);

  useEffect(() => {
    setChecked(!!defaultChecked);
  }, [defaultChecked]);

  function handleChange(checked: boolean): void {
    if (disabled) {
      return;
    }
    setChecked(checked);
    onChange && onChange(props.value);
  }

  return (
    <div className={cs('flex items-center', className)}>
      <div
        className={cs(
          'w-16 h-16 mr-8 border flex justify-center items-center transition cursor-pointer', {
            'bg-white': !checked,
            'bg-blue-600': checked,
            'border-red-600': error,
            'border-gray-400': !error,
            'bg-gray-200': disabled,
          },
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          radioClass)}
        style={{ borderRadius: '50%' }}
        onClick={() => handleChange(true)}
      >
        <input
          {...inputProps}
          ref={ref}
          checked={checked}
          type="radio"
          id={id}
          className="hidden"
          disabled={disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { checked } = e.target;
            handleChange(checked);
          }}
        />
        <span
          className={cs('w-8 h-8 bg-white transition', {
            'opacity-0': !checked,
            'opacity-1': checked,
          })}
          style={{ borderRadius: '50%' }}
        ></span>
      </div>
      <label htmlFor={id} className={cs('cursor-pointer',
        {
          'cursor-not-allowed': disabled,
        })
      }>{label}</label>
    </div>
  );
}

const Radio = forwardRef(InternalRadio);

export default Radio;

