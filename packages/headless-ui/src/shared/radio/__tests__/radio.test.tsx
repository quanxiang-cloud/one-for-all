import React, { useState } from 'react';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import Radio, { RadioGroup, LabelWithInputInstace } from '../index';

describe('Radio', () => {
  afterEach(cleanup);
  it('component could be render and unmounted without errors', () => {
    expect(() => {
      const wrapper = render(<Radio value='test1'/>);
      wrapper.unmount();
    }).not.toThrow();
  });

  it('should render label', () => {
    const wrapper = render(<Radio value='test1' label='test1'/>);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should be disabled', () => {
    const wrapper = render(<Radio value="test1" disabled />);
    expect(wrapper.getByRole('radio', { hidden: true })).toBeDisabled();
  });

  it('should change disabled', () => {
    function TestChangeDisabled(): JSX.Element {
      const [disabled, setDisabled] = useState(true);
      return (
        <>
          <Radio value="test1" disabled={disabled} />
          <button data-testid="button" onClick={() => setDisabled(false)}></button>
        </>
      );
    }
    const wrapper = render(<TestChangeDisabled/>);
    expect(wrapper.getByRole('radio', { hidden: true })).toBeDisabled();

    act(() => {
      fireEvent.click(wrapper.getByTestId('button'));
    });
    expect(wrapper.getByRole('radio', { hidden: true })).not.toBeDisabled();
  });

  it('should get input element ref', () => {
    const ref = React.createRef<LabelWithInputInstace>();
    render(<Radio value="test1" label="test1" ref={ref} />);

    expect(ref.current?.inputInstance instanceof HTMLInputElement).toBeTruthy();
    expect(ref.current instanceof HTMLLabelElement).toBeTruthy();
  });

  it('should have classname while error', () => {
    const wrapper = render(<Radio value='test1'/>);
    expect(wrapper.container.querySelector('.ofa-radio-wrapper__error')).not.toBeInTheDocument();
    wrapper.rerender(<Radio value='test1' error/>);
    expect(wrapper.container.querySelector('.ofa-radio-wrapper__error')).toBeInTheDocument();
  });

  it('should be checked while checked is set', () => {
    const wrapper = render(<Radio value='test1' checked/>);
    expect(wrapper.getByRole('radio', { hidden: true }) as HTMLInputElement).toBeChecked();
  });

  it('should be checked while click', () => {
    const wrapper = render(<Radio value='test1'/>);
    act(() => {
      fireEvent.click(wrapper.getByRole('radio', { hidden: true }));
    });
    expect(wrapper.getByRole('radio', { hidden: true }) as HTMLInputElement).toBeChecked();
    act(() => {
      fireEvent.click(wrapper.getByRole('radio', { hidden: true }));
    });
    expect(wrapper.getByRole('radio', { hidden: true }) as HTMLInputElement).toBeChecked();
  });

  it('should trigger onChange', () => {
    const onChange = jest.fn((val) => val);
    const wrapper = render(<Radio value='test1' onChange={onChange} />);
    act(() => {
      fireEvent.click(wrapper.getByRole('radio', { hidden: true }));
    });
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveReturnedWith('test1');
    act(() => {
      fireEvent.click(wrapper.getByRole('radio', { hidden: true }));
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('RadioGroup', () => {
  afterEach(cleanup);
  it('component could be render and unmounted without errors', () => {
    expect(() => {
      const wrapper = render(<RadioGroup></RadioGroup>);
      wrapper.unmount();
    }).not.toThrow();
  });

  it('should render label group', () => {
    const wrapper = render(<RadioGroup value='1'>
      <Radio value='1' label='1'></Radio>
      <Radio value='2' label='2'></Radio>
      <Radio value='3' label='3'></Radio>
    </RadioGroup>);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should render by options', () => {
    const wrapper = render(
      <RadioGroup
        options={[
          { label: 'test1', value: 1 },
          { label: 'test2', value: 2 },
        ]}
        value={1}
      ></RadioGroup>,
    );
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('checked correct while render by options', () => {
    const wrapper = render(
      <RadioGroup
        options={[
          { label: 'test1', value: 1 },
          { label: 'test2', value: 2 },
          { label: 'test3', value: 3 },
        ]}
        value={1}
      ></RadioGroup>,
    );
    expect(wrapper.getByLabelText('test1')).toBeChecked();
    expect(wrapper.getByLabelText('test2')).not.toBeChecked();
    expect(wrapper.getByLabelText('test3')).not.toBeChecked();
  });

  it('onchange correct while render by options', () => {
    const onChangeGroup = jest.fn((val) => val);
    const onChange = jest.fn((val) => val);
    const wrapper = render(
      <RadioGroup
        onChange={onChangeGroup}
        options={[
          { label: 'test1', value: 1 },
          { label: 'test2', value: 2, onChange },
          { label: 'test3', value: 3 },
        ]}
        value={1}
      ></RadioGroup>,
    );
    expect(wrapper.getByLabelText('test1')).toBeChecked();
    expect(wrapper.getByLabelText('test2')).not.toBeChecked();
    expect(wrapper.getByLabelText('test3')).not.toBeChecked();
    act(() => {
      fireEvent.click(wrapper.getByLabelText('test2'));
    });
    expect(wrapper.getByLabelText('test1')).not.toBeChecked();
    expect(wrapper.getByLabelText('test2')).toBeChecked();
    expect(wrapper.getByLabelText('test3')).not.toBeChecked();
    expect(onChangeGroup).toHaveReturnedWith(2);
    expect(onChange).toHaveReturnedWith(2);
  });

  it('Radio should be checked while value equals', () => {
    const wrapper = render(<RadioGroup value='1'>
      <Radio value='1' label='1'></Radio>
      <Radio value='2' label='2'></Radio>
      <Radio value='3' label='3'></Radio>
    </RadioGroup>);

    expect(wrapper.getByLabelText('1')).toBeChecked();
    expect(wrapper.getByLabelText('2')).not.toBeChecked();
    expect(wrapper.getByLabelText('3')).not.toBeChecked();
  });

  it('onValueChange', () => {
    function TestValueChange(): JSX.Element {
      const [value, setValue] = useState('1');
      const delayCount = (): void => {
        setValue('3');
      };
      return (
        <>
          <RadioGroup value={value}>
            <Radio value="1" label="1"></Radio>
            <Radio value="2" label="2"></Radio>
            <Radio value="3" label="3"></Radio>
          </RadioGroup>
          <button data-testid="button-up" onClick={delayCount}></button>
        </>
      );
    }
    const wrapper = render(<TestValueChange />);
    expect(wrapper.getByLabelText('1')).toBeChecked();
    expect(wrapper.getByLabelText('2')).not.toBeChecked();
    expect(wrapper.getByLabelText('3')).not.toBeChecked();

    act(() => {
      fireEvent.click(wrapper.getByTestId('button-up'));
    });

    expect(wrapper.getByLabelText('1')).not.toBeChecked();
    expect(wrapper.getByLabelText('2')).not.toBeChecked();
    expect(wrapper.getByLabelText('3')).toBeChecked();
  });

  it('onchange', () => {
    const onChangeGroup = jest.fn((val) => val);
    const onChange = jest.fn((val) => val);
    const wrapper = render(<RadioGroup value='1' onChange={onChangeGroup}>
      <Radio value='1' label='1'></Radio>
      <Radio value='2' label='2' onChange={onChange}></Radio>
      <Radio value='3' label='3'></Radio>
    </RadioGroup>);

    act(() => {
      fireEvent.click(wrapper.getByLabelText('2'));
    });

    expect(onChangeGroup).toHaveReturnedWith('2');
    expect(onChange).toHaveReturnedWith('2');
  });
});
