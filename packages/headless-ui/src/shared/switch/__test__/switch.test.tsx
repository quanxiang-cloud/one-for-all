import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Switch from '../index';

describe('Switch', () => {
  it('switch without anything', () => {
    const wrapper = render(<Switch/>);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('component could be render and unmounted without errors', () => {
    expect(() => {
      const wrapper = render(<Switch/>);
      wrapper.unmount();
    }).not.toThrow();
  });

  it('switch with checked and onText', () => {
    const wrapper = render(<Switch checked onText='开'/>);
    expect(wrapper.asFragment()).toMatchSnapshot();
    expect(
      wrapper.container.querySelector('.ofa-switch-checked'),
    ).toBeInTheDocument();
  });

  it('switch with false checked and offText', () => {
    const wrapper = render(<Switch offText='关'/>);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should get input element ref', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Switch ref={ref} />);
    expect(ref.current instanceof HTMLLabelElement).toBeTruthy();
  });

  it('should be change checked while click', () => {
    const wrapper = render(<Switch/>);

    act(() => {
      fireEvent.click(wrapper.container);
    });
    waitFor(() => expect(
      wrapper.container.querySelector('.ofa-switch-checked'),
    ).toBeInTheDocument());
    act(() => {
      fireEvent.click(wrapper.container);
    });
    waitFor(() => expect(
      wrapper.container.querySelector('.ofa-switch-checked'),
    ).not.toBeInTheDocument());
  });
});
