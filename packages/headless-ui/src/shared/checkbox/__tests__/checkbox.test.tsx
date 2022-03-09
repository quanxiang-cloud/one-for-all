import React, { useState } from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import Checkbox, { CheckboxGroup, LabelWithInputInstance } from '../index';

describe('Checkbox', () => {
  afterEach(cleanup);
  it('component could be render and unmounted without errors', () => {
    expect(() => {
      const wrapper = render(<Checkbox value="test1" />);
      wrapper.unmount();
    }).not.toThrow();
  });

  it('should render label', () => {
    const wrapper = render(<Checkbox value="test1" label="test1" />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should be disabled', () => {
    const wrapper = render(<Checkbox value="test1" disabled />);
    expect(wrapper.getByRole('checkbox', { hidden: true })).toBeDisabled();
  });

  it('should change disabled', () => {
    function TestChangeDisabled(): JSX.Element {
      const [disabled, setDisabled] = useState(true);
      return (
        <>
          <Checkbox value="test1" disabled={disabled} />
          <button data-testid="button" onClick={() => setDisabled(false)}></button>
        </>
      );
    }
    const wrapper = render(<TestChangeDisabled />);
    expect(wrapper.getByRole('checkbox', { hidden: true })).toBeDisabled();

    act(() => {
      fireEvent.click(wrapper.getByTestId('button'));
    });
    expect(wrapper.getByRole('checkbox', { hidden: true })).not.toBeDisabled();
  });

  it('should get label and input element ref', () => {
    const ref = React.createRef<LabelWithInputInstance>();
    render(<Checkbox value="test1" label="test1" ref={ref} />);

    expect(ref.current?.inputInstance instanceof HTMLInputElement).toBeTruthy();
    expect(ref.current instanceof HTMLLabelElement).toBeTruthy();
  });

  it('should have classname while indeterminate', () => {
    const wrapper = render(<Checkbox value="test1" />);
    expect(wrapper.container.querySelector('.ofa-checkbox-wrapper__indeterminate')).not.toBeInTheDocument();
    wrapper.rerender(<Checkbox value="test1" indeterminate />);
    expect(wrapper.container.querySelector('.ofa-checkbox-wrapper__indeterminate')).toBeInTheDocument();
  });

  it('should be checked while checked is set', () => {
    const wrapper = render(<Checkbox value="test1" checked />);
    expect(wrapper.getByRole('checkbox', { hidden: true }) as HTMLInputElement).toBeChecked();
  });

  it('should be checked while click', () => {
    const wrapper = render(<Checkbox value="test1" />);
    act(() => {
      fireEvent.click(wrapper.getByRole('checkbox', { hidden: true }));
    });
    expect(wrapper.getByRole('checkbox', { hidden: true }) as HTMLInputElement).toBeChecked();
    act(() => {
      fireEvent.click(wrapper.getByRole('checkbox', { hidden: true }));
    });
    expect(wrapper.getByRole('checkbox', { hidden: true }) as HTMLInputElement).not.toBeChecked();
  });

  it('should not change checked while disabled whth clicking', () => {
    const wrapper = render(<Checkbox value="test1" disabled />);
    act(() => {
      fireEvent.click(wrapper.getByRole('checkbox', { hidden: true }));
    });
    expect(wrapper.getByRole('checkbox', { hidden: true }) as HTMLInputElement).not.toBeChecked();
    act(() => {
      fireEvent.click(wrapper.getByRole('checkbox', { hidden: true }));
    });
    expect(wrapper.getByRole('checkbox', { hidden: true }) as HTMLInputElement).not.toBeChecked();
  });

  it('should trigger onChange', () => {
    const onChange = jest.fn((val) => val);
    const wrapper = render(<Checkbox value="test1" onChange={onChange} />);
    act(() => {
      fireEvent.click(wrapper.getByRole('checkbox', { hidden: true }));
    });
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveReturnedWith('test1');
    act(() => {
      fireEvent.click(wrapper.getByRole('checkbox', { hidden: true }));
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveReturnedWith('test1');
  });
});

describe('CheckboxGroup', () => {
  afterEach(cleanup);
  it('component could be render and unmounted without errors', () => {
    expect(() => {
      const wrapper = render(<CheckboxGroup></CheckboxGroup>);
      wrapper.unmount();
    }).not.toThrow();
  });

  it('should render label group', () => {
    const wrapper = render(
      <CheckboxGroup value={['1', '2']}>
        <Checkbox value="1" label="1"></Checkbox>
        <Checkbox value="2" label="2"></Checkbox>
        <Checkbox value="3" label="3"></Checkbox>
      </CheckboxGroup>,
    );
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should render by options', () => {
    const wrapper = render(
      <CheckboxGroup
        options={[
          { label: 'test1', value: 1 },
          { label: 'test2', value: 2 },
        ]}
        value={[1]}
      ></CheckboxGroup>,
    );
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('checked correct while render by options', () => {
    const wrapper = render(
      <CheckboxGroup
        options={[
          { label: 'test1', value: 1 },
          { label: 'test2', value: 2 },
          { label: 'test3', value: 3 },
        ]}
        value={[1]}
      ></CheckboxGroup>,
    );
    expect(wrapper.getByLabelText('test1')).toBeChecked();
    expect(wrapper.getByLabelText('test2')).not.toBeChecked();
    expect(wrapper.getByLabelText('test3')).not.toBeChecked();
  });

  it('onchange correct while render by options', () => {
    const onChangeGroup = jest.fn((val) => val);
    const onChange = jest.fn((val) => val);
    const wrapper = render(
      <CheckboxGroup
        onChange={onChangeGroup}
        options={[
          { label: 'test1', value: 1, onChange },
          { label: 'test2', value: 2 },
          { label: 'test3', value: 3 },
        ]}
        value={[1]}
      ></CheckboxGroup>,
    );
    expect(wrapper.getByLabelText('test1')).toBeChecked();
    expect(wrapper.getByLabelText('test2')).not.toBeChecked();
    expect(wrapper.getByLabelText('test3')).not.toBeChecked();
    act(() => {
      fireEvent.click(wrapper.getByLabelText('test1'));
    });
    expect(wrapper.getByLabelText('test1')).not.toBeChecked();
    expect(wrapper.getByLabelText('test2')).not.toBeChecked();
    expect(wrapper.getByLabelText('test3')).not.toBeChecked();
    expect(onChangeGroup).toHaveReturnedWith([]);
    expect(onChange).toHaveReturnedWith(1);
  });

  it('checkbox should be checked while value equals', () => {
    const wrapper = render(
      <CheckboxGroup value={['1', '2']}>
        <Checkbox value="1" label="1"></Checkbox>
        <Checkbox value="2" label="2"></Checkbox>
        <Checkbox value="3" label="3"></Checkbox>
      </CheckboxGroup>,
    );

    expect(wrapper.getByLabelText('1')).toBeChecked();
    expect(wrapper.getByLabelText('2')).toBeChecked();
    expect(wrapper.getByLabelText('3')).not.toBeChecked();
  });

  it('onValueChange', () => {
    function TestValueChange(): JSX.Element {
      const [value, setValue] = useState(['1', '2']);
      const delayCount = (): void => {
        setValue(['3']);
      };
      return (
        <>
          <CheckboxGroup value={value}>
            <Checkbox value="1" label="1"></Checkbox>
            <Checkbox value="2" label="2"></Checkbox>
            <Checkbox value="3" label="3"></Checkbox>
          </CheckboxGroup>
          <button data-testid="button" onClick={delayCount}></button>
        </>
      );
    }
    const wrapper = render(<TestValueChange />);
    expect(wrapper.getByLabelText('1')).toBeChecked();
    expect(wrapper.getByLabelText('2')).toBeChecked();
    expect(wrapper.getByLabelText('3')).not.toBeChecked();

    act(() => {
      fireEvent.click(wrapper.getByTestId('button'));
    });

    expect(wrapper.getByLabelText('1')).not.toBeChecked();
    expect(wrapper.getByLabelText('2')).not.toBeChecked();
    expect(wrapper.getByLabelText('3')).toBeChecked();
  });

  it('on disabled change', () => {
    function TestValueChange(): JSX.Element {
      const [disabled, setDisabled] = useState(false);
      const delayDisabled = (): void => {
        setDisabled(true);
      };
      return (
        <>
          <CheckboxGroup value={['1']} disabled={disabled}>
            <Checkbox value="1" label="1"></Checkbox>
            <Checkbox value="2" label="2"></Checkbox>
            <Checkbox value="3" label="3"></Checkbox>
          </CheckboxGroup>
          <button data-testid="button" onClick={delayDisabled}></button>
        </>
      );
    }
    const wrapper = render(<TestValueChange />);
    expect(wrapper.getByLabelText('1')).not.toBeDisabled();
    expect(wrapper.getByLabelText('2')).not.toBeDisabled();
    expect(wrapper.getByLabelText('3')).not.toBeDisabled();

    act(() => {
      fireEvent.click(wrapper.getByTestId('button'));
    });

    expect(wrapper.getByLabelText('1')).toBeDisabled();
    expect(wrapper.getByLabelText('2')).toBeDisabled();
    expect(wrapper.getByLabelText('3')).toBeDisabled();
  });

  it('onchange', () => {
    const onChangeGroup = jest.fn((val) => val);
    const onChange = jest.fn((val) => val);
    const wrapper = render(
      <CheckboxGroup value={['1', '2']} onChange={onChangeGroup}>
        <Checkbox value="1" label="1" onChange={onChange}></Checkbox>
        <Checkbox value="2" label="2"></Checkbox>
        <Checkbox value="3" label="3"></Checkbox>
      </CheckboxGroup>,
    );

    act(() => {
      fireEvent.click(wrapper.getByLabelText('1'));
    });

    expect(onChangeGroup).toHaveReturnedWith(['2']);
    expect(onChange).toHaveReturnedWith('1');
  });
});
