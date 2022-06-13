import React, {
  useState,
  useLayoutEffect,
  forwardRef,
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  ForwardedRef,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import { omit } from 'lodash';
import cs from 'classnames';

function Textarea(
  {
    className,
    value,
    style,
    error,
    disabled,
    cols,
    rows,
    readOnly,
    defaultValue,
    onChange,
    onEnterPress,
    onFocus,
    onBlur,
    onKeyDown,
    ...otherProps
  }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
): JSX.Element {
  const [inputValue, setValue] = useState<string>(defaultValue ?? '');
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (value === undefined) {
      return;
    }
    setValue(value);
  }, [value]);

  useLayoutEffect(() => {
    if (!otherProps.enterKeyHint) return;
    inputRef.current?.setAttribute('enterkeyhint', otherProps.enterKeyHint);
    return () => {
      inputRef.current?.removeAttribute('enterkeyhint');
    };
  }, [otherProps.enterKeyHint]);

  useImperativeHandle(ref, () => inputRef.current as HTMLTextAreaElement);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    setValue(e.target.value);
    onChange?.(e.target.value, e);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (onEnterPress && (e.code === 'Enter' || e.keyCode === 13)) {
      onEnterPress(e);
    }
    onKeyDown?.(e);
  }

  function handleFocus(e: FocusEvent<HTMLTextAreaElement>): void {
    setFocused(true);
    onFocus?.(e);
  }

  function handleBlur(e: FocusEvent<HTMLTextAreaElement>): void {
    setFocused(false);
    onBlur?.(e);
  }

  return (
    <textarea
      {...omit(otherProps, 'enterKeyHint')}
      ref={inputRef}
      value={inputValue}
      disabled={disabled}
      readOnly={readOnly}
      cols={cols}
      rows={rows}
      style={style}
      className={cs(
        'ofa-textarea',
        {
          'ofa-textarea__disabled': disabled,
          'ofa-textarea__readOnly': readOnly,
          'ofa-textarea__focus': focused,
          'ofa-textarea__error': error,
        },
        className,
      )}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    ></textarea>
  );
}
export default forwardRef<HTMLTextAreaElement, TextareaProps>(Textarea);
