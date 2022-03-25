import React, { useState, useRef, useEffect } from 'react';
import cs from 'classnames';

import Icon from '@one-for-all/icon';
import usePopper from '../popper';

import { SingleSelectTrigger, MultipleSelectTrigger } from './trigger';

import './index.scss';

export type OptionLabel = React.ReactNode;

export type SelectOption<T> = {
  value: T;
  label: OptionLabel;
  disabled?: boolean;
}

interface BaseSelectProps<T> {
  className?: string;
  optionClassName?: string;
  disabled?: boolean;
  // inputRef?: React.RefObject<HTMLInputElem ent>;
  inputRef?: React.Ref<HTMLInputElement>;
  name?: string;
  id?: string;
  onOptionsVisibilityChange?: (visible: boolean) => void;
  options: SelectOption<T>[];
  optionsDesc?: string;
  placeholder?: string | JSX.Element;
  style?: React.CSSProperties;
  children?: React.ReactElement
}

type SingleTriggerRenderFunc<T> = React.FC<{
  selectedOption?: SelectOption<T>;
  triggerActive: boolean;
}>;

interface SingleSelectProps<T> extends BaseSelectProps<T> {
  multiple?: false;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  triggerRender?: SingleTriggerRenderFunc<T>;
}

type MultipleTriggerRenderFunc<T> = React.FC<{
  selectedOption?: SelectOption<T>[];
  triggerActive: boolean;
}>;

interface MultipleSelectProps<T = React.Key> extends BaseSelectProps<T> {
  multiple: true;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  triggerRender?: MultipleTriggerRenderFunc<T>;
}

type SelectProps<T> = SingleSelectProps<T> | MultipleSelectProps<T>;

const DEFAULT_PLACEHOLDER = '请选择';
const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

export default function Select<T extends React.Key>(props: SelectProps<T>) {
  const [selectedValue, setSelectedValue] = useState(props.value || props.defaultValue);
  const [triggerActive, setTriggerActive] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState(Array.isArray(selectedValue) ? props.options.filter(({ value }) => {
    return selectedValue.includes(value);
  }) : props.options.find(({ value }) => value === selectedValue));
  const triggerContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValue(props.value);
  }, [props.value])

  useEffect(() => {
    const { options } = props;
    let _selectedOption = undefined;

    if (selectedValue && Array.isArray(selectedValue)) {
      _selectedOption = options.filter((option) => {
        return selectedValue.includes(option.value);
      });
    }

    if (selectedValue && !Array.isArray(selectedValue)) {
      _selectedOption = options.find((option) => {
        return selectedValue === option.value;
      });
    }

    setSelectedOption(_selectedOption);
  }, [selectedValue, props.options])



  const {
    children, triggerRender, name, inputRef, style, className, disabled, id
  } = props;

  function handleVisibleChange(visible: boolean) {
    setTriggerActive(visible);
  }

  const { referenceRef, Popper, handleClick: handlePopperClick, close } = usePopper(handleVisibleChange);

  function getTriggerWidth(): number {
    const rects = triggerContentRef.current?.parentElement?.getClientRects();
    if (!rects || !rects.length) {
      return 150;
    }

    return Array.from(rects)[0].width;
  }

  function renderOptions(): JSX.Element {
    const { options, optionsDesc, optionClassName } = props;

    return (
      <div className={`${optionClassName} ofa-select-options`} style={{ width: `${getTriggerWidth()}px` }}>
        {optionsDesc && (<p className="ofa-select-options-desc">{optionsDesc}</p>)}
        {
          options.map((option) => {
            const isSelected = Array.isArray(selectedValue) ?
              selectedValue.includes(option.value) : selectedValue === option.value;

            return (
              <div
                key={option.value}
                onClick={(): void => handleClick(option.value)}
                className={cs('ofa-select-option', { 'ofa-select-option-active': isSelected })}
              >
                <div className="ofa-select-option-label">{option.label}</div>
                {isSelected && <Icon name="check" className="text-current" />}
              </div>
            );
          })
        }
      </div>
    );
  }

  function renderCustomTrigger(): null | JSX.Element {
    const { triggerRender } = props;

    if (!triggerRender) {
      return null;
    }

    if (Array.isArray(selectedOption)) {
      return (triggerRender as MultipleTriggerRenderFunc<React.Key>)({
        selectedOption, triggerActive,
      });
    }

    return (triggerRender as SingleTriggerRenderFunc<React.Key>)({
      selectedOption, triggerActive,
    });
  }

  function handleClick(value: T): void {
    if (!props.multiple) {
      props.onChange?.(value);
      setSelectedValue(value);
      close()

      return;
    }

    if (selectedValue === undefined) {
      setSelectedValue([value])
      props.onChange?.([value]);
      return;
    }

    // remove value from selectedValue if exist
    // add value to selectedValue if not exist
    // todo extract a util method?
    const _selectedValue = (selectedValue as T[]).includes(value) ? (selectedValue as T[]).filter((_value) => {
      return _value !== value;
    }) : [...(selectedValue as T[]), value];
    setSelectedValue(_selectedValue);
    props.onChange?.(_selectedValue);
  }

  function renderDefaultTrigger(): JSX.Element {
    const { placeholder = DEFAULT_PLACEHOLDER } = props;

    if (Array.isArray(selectedOption)) {
      return (
        <MultipleSelectTrigger
          selectedOption={selectedOption as SelectOption<T>[] | undefined}
          disabled={disabled}
          placeholder={placeholder as string}
          onUnselect={(value): void => {
            handleClick(value);
          }}
        />
      );
    }

    return (
      <SingleSelectTrigger
        selectedOption={selectedOption as SelectOption<React.Key> | undefined}
        placeholder={placeholder as string}
      />
    );
  }

  const arrowStyle: React.CSSProperties | undefined = triggerActive ? {
    transform: 'rotate(180deg)',
  } : undefined;

  return (
    <>
      {
        children ? React.cloneElement(children as React.ReactElement, { ref: referenceRef }) : (
          <div
            {...(disabled ? {} : { onClick: handlePopperClick() })}
            ref={referenceRef as any}
            style={style}
            className={cs('ofa-select-trigger', className, {
              'ofa-select-trigger-active': triggerActive && !disabled,
              'ofa-select-trigger-disabled': disabled,
            })}
          >
            {
              name && (
                <input
                  id={id}
                  type="hidden"
                  name={name}
                  ref={inputRef}
                  defaultValue={selectedValue as string}
                />
              )
            }
            <div className="ofa-trigger-content" ref={triggerContentRef}>
              {triggerRender ? renderCustomTrigger() : renderDefaultTrigger()}
            </div>
            <Icon name="keyboard_arrow_down" style={arrowStyle} className="trigger-arrow-icon" />
          </div>
        )
      }
      <Popper
        placement="bottom-start"
        modifiers={modifiers}
      >
        {renderOptions()}
      </Popper>
    </>
  );
}
