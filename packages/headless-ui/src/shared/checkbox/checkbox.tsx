import React, {
  forwardRef,
  useState,
  useEffect,
  useContext,
  useRef,
  ForwardedRef,
  ChangeEvent,
  useImperativeHandle,
} from 'react';
import cs from 'classnames';

import context from './context';

export type LabelWithInputInstance = HTMLLabelElement & {
  inputInstance: HTMLInputElement
}

function InternalCheckbox<T extends ValueType>(
  {
    className,
    style,
    label,
    indeterminate,
    error,
    onChange,
    ...restProps
  }: CheckboxProps<T>,
  ref?: ForwardedRef<LabelWithInputInstance>,
): JSX.Element {
  const [name, setName] = useState<string>();
  const [checked, setChecked] = useState<boolean>(!!restProps.checked);
  const [disabled, setDisabled] = useState<boolean>(!!restProps.disabled);
  const groupContext = useContext(context);
  const prevValue = useRef(restProps.value);
  const rootRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, (): LabelWithInputInstance => {
    if (rootRef.current && inputRef.current) {
      (rootRef.current as LabelWithInputInstance).inputInstance = inputRef.current;
    }
    return (rootRef.current as LabelWithInputInstance);
  });

  useEffect(() => {
    groupContext?.registerValue(restProps.value);
  }, []);

  useEffect(() => {
    if (restProps.value !== prevValue.current) {
      groupContext?.cancelValue(prevValue.current);
      groupContext?.registerValue(restProps.value);
    }
    return () => groupContext?.cancelValue(restProps.value);
  }, [restProps.value]);

  useEffect(() => {
    setName(groupContext?.name);
  }, [groupContext?.name]);

  useEffect(() => {
    let checked = !!restProps.checked;
    if (groupContext?.value) {
      checked = groupContext.value.indexOf(restProps.value) !== -1;
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
    groupContext && groupContext.toggleOption({ label: label, value: restProps.value });
    onChange && onChange(restProps.value, e);
  }

  return (
    <label
      ref={rootRef}
      style={style}
      className={cs(
        'ofa-checkbox-wrapper',
        {
          'ofa-checkbox-wrapper__indeterminate': indeterminate,
          'ofa-checkbox-wrapper__checked': checked,
          'ofa-checkbox-wrapper__disabled': disabled,
          'ofa-checkbox-wrapper__error': error,
        },
        className,
      )}
    >
      <span className="ofa-checkbox-item">
        <input
          ref={inputRef}
          type="checkbox"
          style={{ display: 'none' }}
          checked={checked}
          name={name}
          disabled={disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { checked } = e.target;
            handleChange(checked, e);
          }}
        />
        <span className="ofa-checkbox-icon"></span>
      </span>
      {label && <span className="ofa-checkbox-label">{label}</span>}
    </label>
  );
}

export default forwardRef(InternalCheckbox);
