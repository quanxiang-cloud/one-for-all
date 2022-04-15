import React from 'react';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';

import Button from '../index';

afterEach(cleanup);

const props = {
  children: 'test button',
};

it('Button render test', () => {
  const Dom = render(<Button {...props} />);
  const domEle = Dom.getByText('test button');
  expect(domEle).toBeInTheDocument();
});

it('should render a primary button', () => {
  render(<Button {...props} modifier="primary" />);
  const button = screen.getByRole('button', { name: 'test button' });
  expect(button).toHaveClass('ofa-btn--primary');
});

it('should render a danger button', () => {
  render(<Button {...props} modifier="danger" />);
  const button = screen.getByRole('button', { name: 'test button' });
  expect(button).toHaveClass('ofa-btn--danger');
});

it('should render a disabled button', () => {
  render(<Button {...props} forbidden />);
  const button = screen.getByRole('button', { name: 'test button' });
  expect(button).toHaveClass('ofa-btn--forbidden');
  expect(button).toBeDisabled();
});

it('should render a loading button', () => {
  const { container } = render(<Button {...props} loading />);
  const button = container.querySelector('.ofa-btn');
  expect(button).toHaveClass('ofa-btn--loading');
});

it('Button clicked test', () => {
  const mockCallBack = jest.fn();
  render(<Button {...props} onClick={mockCallBack} />);
  const button = screen.getByRole('button', { name: 'test button' });
  fireEvent.click(button);
  expect(mockCallBack.mock.calls.length).toEqual(1);
});
