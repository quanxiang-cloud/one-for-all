import React from 'react';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';

import Select from '../index';

afterEach(cleanup);

const props = {
  "options": [
    {
      "label": "Test1",
      "value": "Test1"
    },
    {
      "label": "Test2",
      "value": "Test2"
    }
  ]
};

it("Select render test", () => {
  const { container, getByText } = render(<Select {...props} optionsDesc='options placeholder' />);
  const trigger = container.querySelector('.ofa-select-trigger');
  expect(!!trigger).toBeTruthy();
  trigger && fireEvent.click(trigger)
  const options = getByText('options placeholder');
  expect(!!options).toBeTruthy();
});

it("Single select test", () => {
  const { container, getByText } = render(<Select {...props} />);
  const trigger = container.querySelector('.ofa-select-trigger');
  trigger && fireEvent.click(trigger)
  const option = getByText('Test1');
  fireEvent.click(option);
  expect(container.querySelector('.ofa-trigger-content')).toHaveTextContent('Test1')
});

it("Multiple select test", () => {
  const { container, getByText } = render(<Select multiple {...props} />);
  const trigger = container.querySelector('.ofa-select-trigger');
  trigger && fireEvent.click(trigger)
  const option1 = getByText('Test1');
  const option2 = getByText('Test2');
  fireEvent.click(option1);
  fireEvent.click(option2);
  expect(container.querySelector('.ofa-trigger-content')).toHaveTextContent('Test1')
  expect(container.querySelector('.ofa-trigger-content')).toHaveTextContent('Test2')
});

// it("Prev the page test", () => {
//   const { container } = render(<Select {...props} current={2} />);
//   const prev = container.querySelector('.ofa-Select-prev');
//   prev && fireEvent.click(prev)
//   expect(container.querySelector('.ofa-Select-current-page')).toHaveTextContent('1')
// });

// it("Jump the page test", () => {
//   const { container } = render(<Select {...props} />);
//   const input = container.querySelector('.ofa-Select-quick-jumper-input');
//   input && fireEvent.change(input, { target: { value: 2 } })
//   input && fireEvent.blur(input)
//   expect(container.querySelector('.ofa-Select-current-page')).toHaveTextContent('2')
// });