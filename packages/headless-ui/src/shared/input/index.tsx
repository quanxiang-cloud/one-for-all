import React, {
  useState,
  useLayoutEffect,
  forwardRef,
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  ForwardedRef,
  useRef,
  useImperativeHandle,
} from 'react';
import { omit } from 'lodash';
import cs from 'classnames';

import './index.css';

function Input(
  {
    className,
    style,
    error,
    disabled,
    readOnly,
    defaultValue,
    onChange,
    onEnterPress,
    onFocus,
    onBlur,
    onKeyDown,
    ...otherProps
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
): JSX.Element {
  const [value, setValue] = useState<string>(defaultValue ?? '');
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!otherProps.enterKeyHint) return;
    inputRef.current?.setAttribute('enterkeyhint', otherProps.enterKeyHint);
    return () => {
      inputRef.current?.removeAttribute('enterkeyhint');
    };
  }, [otherProps.enterKeyHint]);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setValue(e.target.value);
    onChange?.(e.target.value, e);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (onEnterPress && (e.code === 'Enter' || e.keyCode === 13)) {
      onEnterPress(e);
    }
    onKeyDown?.(e);
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>): void {
    setFocused(true);
    onFocus?.(e);
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>): void {
    setFocused(false);
    onBlur?.(e);
  }

  return (
    <input
      {...omit(otherProps, 'enterKeyHint')}
      ref={inputRef}
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      style={style}
      className={cs(
        'ofa-input',
        {
          'ofa-input__disabled': disabled,
          'ofa-input__readOnly': readOnly,
          'ofa-input__focus': focused,
          'ofa-input__error': error,
        },
        className,
      )}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    ></input>
  );
}
export default forwardRef<HTMLInputElement, InputProps>(Input);
