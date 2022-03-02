import React, {
  forwardRef,
  useState,
  useContext,
  useEffect,
  useRef,
  useImperativeHandle,
  ChangeEvent,
  ForwardedRef,
} from 'react';
import cs from 'classnames';

import context from './context';

export type LabelWithInputInstace = HTMLLabelElement & {
  inputInstance: HTMLInputElement
}

function InternalRadio<T extends ValueType>(
  {
    className,
    style,
    label,
    error,
    onChange,
    ...restProps
  }: RadioProps<T>,
  ref?: ForwardedRef<LabelWithInputInstace>,
): JSX.Element {
  const groupContext = useContext(context);
  const [name, setName] = useState<string>();
  const [disabled, setDisabled] = useState<boolean>(!!restProps.disabled);
  const [checked, setChecked] = useState<boolean>(!!restProps.checked);
  const rootRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, (): LabelWithInputInstace => {
    if (rootRef.current && inputRef.current) {
      (rootRef.current as LabelWithInputInstace).inputInstance = inputRef.current;
    }
    return (rootRef.current as LabelWithInputInstace);
  });

  useEffect(() => {
    setName(groupContext?.name);
  }, [groupContext?.name]);

  useEffect(() => {
    let checked = !!restProps.checked;
    if (groupContext?.value) {
      checked = groupContext.value === restProps.value;
    }
    setChecked(checked);
  }, [restProps.value, groupContext?.value]);

  useEffect(() => {
    setDisabled(restProps.disabled || !!groupContext?.disabled);
  }, [restProps.disabled, groupContext?.disabled]);

  function handleChange(checked: boolean, e: ChangeEvent<HTMLInputElement>): void {
    if (disabled) {
      return;
    }
    setChecked(checked);
    groupContext && groupContext.onChange(restProps.value);
    onChange && onChange(restProps.value, e);
  }

  return (
    <label
      ref={rootRef}
      style={style}
      className={cs('ofa-radio-wrapper', {
        'ofa-radio-wrapper__checked': checked,
        'ofa-radio-wrapper__disabled': disabled,
        'ofa-radio-wrapper__error': error,
      }, className)}
    >
      <span className='ofa-radio-item'>
        <input
          ref={inputRef}
          type="radio"
          style={{ display: 'none' }}
          checked={checked}
          name={name}
          value={restProps.value.toString()}
          disabled={disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { checked } = e.target;
            handleChange(checked, e);
          }}
        />
        <span className='ofa-radio-icon'></span>
      </span>
      {label && (<span className='ofa-radio-label'>{label}</span>)}
    </label>
  );
}

const Radio = forwardRef(InternalRadio);

export default Radio;
