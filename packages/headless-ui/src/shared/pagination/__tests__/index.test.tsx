import React from 'react';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';

import Pagination from '../index';

afterEach(cleanup);

const props = {
  "current": 1,
  "total": 20,
  "pageSize": 10,
  "showQuickJumper": true
};

it("Pagination render test", () => {
  const { container } = render(<Pagination {...props} />);
  const domEle = container.querySelector('.ofa-pagination');
  expect(!!domEle).toBeTruthy();
});

it("Page size change test", () => {
  const { container, getByText } = render(<Pagination {...props} showSizeChanger />);
  const trigger = container.querySelector('.ofa-select-trigger');
  trigger && fireEvent.click(trigger)
  const secondOption = getByText('20 条');
  fireEvent.click(secondOption);
  expect(container.querySelector('.ofa-trigger-content')).toHaveTextContent('20 条')
});

it("Next the page test", () => {
  const { container } = render(<Pagination {...props} />);
  const next = container.querySelector('.ofa-pagination-next');
  next && fireEvent.click(next)
  expect(container.querySelector('.ofa-pagination-current-page')).toHaveTextContent('2')
});

it("Prev the page test", () => {
  const { container } = render(<Pagination {...props} current={2} />);
  const prev = container.querySelector('.ofa-pagination-prev');
  prev && fireEvent.click(prev)
  expect(container.querySelector('.ofa-pagination-current-page')).toHaveTextContent('1')
});

it("Jump the page test", () => {
  const { container } = render(<Pagination {...props} />);
  const input = container.querySelector('.ofa-pagination-quick-jumper-input');
  input && fireEvent.change(input, { target: { value: 2 } })
  input && fireEvent.blur(input)
  expect(container.querySelector('.ofa-pagination-current-page')).toHaveTextContent('2')
});