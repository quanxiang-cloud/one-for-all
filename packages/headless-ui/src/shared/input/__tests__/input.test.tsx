import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Input from '../index';

describe('Input', () => {
  afterEach(cleanup);
  it('component could be render and unmounted without errors', () => {
    expect(() => {
      const wrapper = render(<Input />);
      wrapper.unmount();
    }).not.toThrow();
  });

  it('should support maxLength', () => {
    const wrapper = render(<Input maxLength={3} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should be disabled', () => {
    const wrapper = render(<Input disabled />);
    expect(wrapper.getByRole('textbox')).toBeDisabled();
  });

  it('default value works', () => {
    const wrapper = render(<Input defaultValue="testDefaultValue" />);
    expect((wrapper.getByRole('textbox') as HTMLInputElement).value).toEqual('testDefaultValue');
  });

  it('should get span and InputInstance ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current instanceof HTMLInputElement).toBeTruthy();
  });
});

describe('onChange', () => {
  afterEach(cleanup);
  it('calls the onChange callback handler', () => {
    const onChange = jest.fn((val) => val);
    const wrapper = render(<Input onChange={onChange}></Input>);
    fireEvent.change(wrapper.getByRole('textbox'), {
      target: { value: 'change' },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveReturnedWith('change');
  });
});
