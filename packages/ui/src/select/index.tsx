import React from 'react';
import cs from 'classnames';

import Icon from '../icon';
import Popper from '../popper';

import { SingleSelectTrigger, MultipleSelectTrigger } from './trigger';

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
  border?: boolean;
  // inputRef?: React.RefObject<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  name?: string;
  id?: string;
  onOptionsVisibilityChange?: (visible: boolean) => void;
  options: SelectOption<T>[];
  optionsDesc?: string;
  placeholder?: string | JSX.Element;
  style?: React.CSSProperties;
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

type State<T> = {
  selectedOption?: SelectOption<T> | SelectOption<T>[];
  selectedValue?: T | T[];
  triggerActive: boolean;
}

const DEFAULT_PLACEHOLDER = '请选择';
const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

export default class Select<T extends React.Key> extends React.Component<SelectProps<T>, State<T>> {
  popperRef = React.createRef<Popper>();
  reference = React.createRef<HTMLDivElement>();
  triggerContentRef = React.createRef<HTMLDivElement>();

  constructor(props: SelectProps<T>) {
    super(props);

    const selectedValue = props.value || props.defaultValue;
    const selectedOption = Array.isArray(selectedValue) ? props.options.filter(({ value }) => {
      return selectedValue.includes(value);
    }) : props.options.find(({ value }) => value === selectedValue);

    this.state = {
      selectedOption,
      selectedValue,
      triggerActive: false,
    };
  }

  static getDerivedStateFromProps(
    props: SelectProps<React.Key>,
    { selectedValue, triggerActive }: State<React.Key>,
  ): State<React.Key> {
    const { value, options } = props;
    let selectedOption = undefined;

    if (value && Array.isArray(value)) {
      selectedOption = options.filter((option) => {
        return value.includes(option.value);
      });
    }

    if (value && !Array.isArray(value)) {
      selectedOption = options.find((option) => {
        return value === option.value;
      });
    }

    if (selectedValue && Array.isArray(selectedValue)) {
      selectedOption = options.filter((option) => {
        return selectedValue.includes(option.value);
      });
    }

    if (selectedValue && !Array.isArray(selectedValue)) {
      selectedOption = options.find((option) => {
        return selectedValue === option.value;
      });
    }

    return {
      triggerActive,
      selectedOption: selectedOption,
    };
  }

  componentDidUpdate(preProps: SelectProps<T>): void {
    if (preProps.value !== this.props.value) {
      this.setState({ selectedValue: this.props.value });
    }
  }

  getTriggerWidth(): number {
    const rects = this.triggerContentRef.current?.parentElement?.getClientRects();
    if (!rects || !rects.length) {
      return 150;
    }

    return Array.from(rects)[0].width;
  }

  handleClick = (value: T): void => {
    if (!this.props.multiple) {
      this.props.onChange?.(value);
      this.setState({ selectedValue: value });
      this.popperRef.current && this.popperRef.current.close();

      return;
    }

    if (this.state.selectedValue === undefined) {
      this.setState({ selectedValue: [value] });
      this.props.onChange?.([value]);
      return;
    }

    // remove value from selectedValue if exist
    // add value to selectedValue if not exist
    // todo extract a util method?
    const selectedValue = this.state.selectedValue as T[];
    const _selectedValue = selectedValue.includes(value) ? selectedValue.filter((_value) => {
      return _value !== value;
    }) : [...selectedValue, value];

    this.setState({ selectedValue: _selectedValue });
    this.props.onChange?.(_selectedValue);
  }

  optionsVisibilityChange = (visible: boolean): void => {
    this.setState({ triggerActive: visible });
    this.props.onOptionsVisibilityChange?.(visible);
  }

  renderOptions(): JSX.Element {
    const { options, optionsDesc, optionClassName } = this.props;
    const { selectedValue } = this.state;

    return (
      <div className={`${optionClassName} dropdown-options`} style={{ width: `${this.getTriggerWidth()}px` }}>
        {optionsDesc && (<p className="select-options__desc">{optionsDesc}</p>)}
        {
          options.map((option) => {
            const isSelected = Array.isArray(selectedValue) ?
              selectedValue.includes(option.value) : selectedValue === option.value;

            return (
              <div
                key={option.value}
                onClick={(): void => this.handleClick(option.value)}
                className={cs('dropdown-options__option', { 'text-blue-600': isSelected })}
              >
                <div className="truncate min-w-0">{option.label}</div>
                {isSelected && <Icon name="check" className="text-current" />}
              </div>
            );
          })
        }
      </div>
    );
  }

  renderCustomTrigger(): null | JSX.Element {
    const { selectedOption, triggerActive } = this.state;
    const { triggerRender } = this.props;

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

  renderDefaultTrigger(): JSX.Element {
    const { selectedOption } = this.state;
    const { placeholder = DEFAULT_PLACEHOLDER } = this.props;

    if (Array.isArray(selectedOption)) {
      return (
        <MultipleSelectTrigger
          selectedOption={selectedOption as SelectOption<T>[] | undefined}
          placeholder={placeholder as string}
          onUnselect={(value): void => {
            this.handleClick(value);
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

  render(): React.ReactNode {
    const { triggerActive, selectedValue } = this.state;
    const {
      children, triggerRender, name, inputRef, style, className, disabled, id, border = true
    } = this.props;

    const arrowStyle: React.CSSProperties | undefined = triggerActive ? {
      transform: 'rotate(180deg)',
    } : undefined;

    return (
      <>
        {
          children ? React.cloneElement(children as React.ReactElement, { ref: this.reference }) : (
            <div
              ref={this.reference}
              style={style}
              className={cs('dropdown-trigger', className, {
                'border-none': !border,
                'border-blue-600': border && triggerActive && !disabled,
                'select-trigger--disabled': disabled,
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
              <div className="select-trigger__content flex gap-4" ref={this.triggerContentRef}>
                {triggerRender ? this.renderCustomTrigger() : this.renderDefaultTrigger()}
              </div>
              <Icon name="keyboard_arrow_down" style={arrowStyle} className="trigger-arrow-icon" />
            </div>
          )
        }
        <Popper
          ref={this.popperRef}
          reference={this.reference}
          placement="bottom-start"
          modifiers={modifiers}
          onVisibilityChange={this.optionsVisibilityChange}
        >
          {this.renderOptions()}
        </Popper>
      </>
    );
  }
}
