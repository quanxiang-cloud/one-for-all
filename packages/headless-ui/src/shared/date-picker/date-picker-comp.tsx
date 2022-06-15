import React, { Ref, useState, useEffect, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import './index.scss';

import usePopper from '../popper';
import DatePickerInput from './components/datePickerInput';
import DatePickerPanel, { RenderHeaderProps, RenderBodyProps, RenderFooterProps } from './components/datePickerPanel';
import { PickScope, transformDate } from './utils';
import RenderBody from './components/renderBody'
import RenderHeader from './components/renderHeader';
import RenderFooter from './components/renderFooter';

function DatePicker({
  defaultValue,
  value,
  mode = 'date',
  placeholder,
  disabled,
  inputReadOnly,
  className,
  style,
  popupClassName,
  popupStyle,
  placement = 'bottom-start',
  suffixIcon,
  nextIcon,
  prevIcon,
  superNextIcon,
  superPrevIcon,
  hiddenPresent = false,
  timeAccuracy,
  format,
  disabledDate,
  disabledTime,
  onOpenChange,
  onChange,
}: DatePickerProps,
ref?: Ref<HTMLDivElement>): JSX.Element {
  const [date, setDate] = useState<Dayjs | undefined>();
  const [pickScope, setPickScope] = useState<PickScope>(mode);

  const { referenceRef, Popper, handleClick, close, handleBlur } = usePopper(onVisibleChange);

  const _timeAccuracy = useMemo(() => {
    if (mode === 'time' && !timeAccuracy) return 'second';
    if (['time', 'date'].includes(mode)) return timeAccuracy;
  }, [mode, timeAccuracy]);

  useEffect(() => createDateByValue(defaultValue), []);

  useEffect(() => createDateByValue(value), [value]);

  function onVisibleChange(visible: boolean): void {
    if (!visible) setPickScope(mode);
    onOpenChange?.(visible);
  }

  function createDateByValue(value: DatePickerValueType | undefined): void {
    if (!value) return;

    const date = initDate(value);
    if (disabledDate?.(date.toDate())) return;

    setDate(date);
  }

  function handleChange(date: Dayjs | undefined): boolean {
    if (date && (disabledDate?.(date.toDate()) || disabledTime?.('hour', date.hour()) ||
      disabledTime?.('minute', date.minute()) || disabledTime?.('second', date.second()))) {
      return false;
    }
    setDate(date);
    onChange?.(date?.toDate());
    close();
    return true;
  };

  function initDate(value: DatePickerValueType): Dayjs {
    if (value instanceof Date) return dayjs(value);
    return dayjs(transformDate(value, mode));
  }

  function renderHeader(props: RenderHeaderProps): JSX.Element {
    const extraProps = {
      nextIcon,
      superNextIcon,
      prevIcon,
      superPrevIcon,
    };
    return (
      <RenderHeader
        pickScope={pickScope}
        timeAccuracy={_timeAccuracy}
        onPickScopeChange={setPickScope}
        {...props}
        {...extraProps}
      />
    );
  }

  function renderBody(props: RenderBodyProps): JSX.Element {
    return (
      <RenderBody
        mode={mode}
        pickScope={pickScope}
        timeAccuracy={_timeAccuracy}
        onPickScopeChange={setPickScope}
        disabledDate={disabledDate}
        disabledTime={disabledTime}
        {...props}
      />
    );
  }

  function renderFooter(props: RenderFooterProps): JSX.Element {
    return (
      <RenderFooter
        mode={mode}
        pickScope={pickScope}
        timeAccuracy={_timeAccuracy}
        hiddenPresent={hiddenPresent}
        onPickScopeChange={setPickScope}
        disabledDate={disabledDate}
        disabledTime={disabledTime}
        {...props}
      />
    );
  }

  return (
    <div ref={ref} className={cs('ofa-date-picker', className)} style={style}>
      <DatePickerInput
        ref={referenceRef as any}
        date={date}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={inputReadOnly}
        suffixIcon={suffixIcon}
        mode={mode}
        format={format}
        timeAccuracy={_timeAccuracy}
        onClick={(e) => !disabled && handleClick()(e)}
        onBlur={handleBlur}
        onChangeInput={handleChange}
        onClear={() => setDate(undefined)}
      />
      <Popper placement={placement} className={popupClassName} style={popupStyle}>
        <DatePickerPanel
          timeAccuracy={_timeAccuracy}
          mode={mode}
          date={date}
          onChangePicker={handleChange}
          renderHeader={renderHeader}
          renderFooter={renderFooter}
          renderBody={renderBody}
          onClose={close}
        />
      </Popper>
    </div>
  );
}

export default React.forwardRef(DatePicker);
