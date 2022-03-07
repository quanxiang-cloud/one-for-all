import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tag from '../index';

test('Tag props test', () => {
  const node: TagProps<React.Key> = {
    value: '1',
    label: 'Tag normal props test',
    className: 'test-component',
    style: {
      backgroundColor: 'blue',
      width: '10%',
      height: '30px',
    },
    modifier: 'primary',
  };

  const { container } = render(<Tag {...node} />);
  expect(container).toMatchSnapshot();
});

test('Tag ref expose test', () => {
  const ref = React.createRef<HTMLSpanElement>();
  render(<Tag value={'2'} ref={ref} />);
  expect(ref.current && ref.current instanceof HTMLSpanElement).toBeTruthy();
});

test('Tag delete event test', () => {
  const handleDel = jest.fn();

  const node: TagProps<React.Key> = {
    value: '3',
    label: 'Tag delete function Test',
    className: 'test-ref',
    deleteIconSize: 15,
  };

  const { container } = render(<Tag {...node} onDelete={handleDel} />);
  fireEvent.click(container.querySelector('.ofa-tag-delete-icon') as HTMLElement);
  expect(handleDel).toHaveBeenCalledTimes(1);
  expect(container).toMatchSnapshot();
});
