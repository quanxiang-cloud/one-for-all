import React from 'react';
import { render } from '@testing-library/react';

import Divider from '../index';

test('Divider component test', () => {
  const node: DividerProps = {
    className: 'test-divider-props',
    size: '10px',
    thickness: '30px',
    style: {
      backgroundColor: 'blue',
    },
  };

  const { container } = render(<Divider {...node}/>);
  expect(container).toMatchSnapshot();
});

test('Divider component test', () => {
  const node: DividerProps = {
    className: 'test-divider-props',
    size: '20px',
    direction: 'vertical',
    thickness: '30px',
    style: {
      backgroundColor: 'red',
    },
  };

  const { container } = render(<Divider {...node}/>);
  expect(container).toMatchSnapshot();
});

test('Divider component test', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(<Divider ref={ref}/>);
  expect(ref.current && ref.current instanceof HTMLDivElement).toBeTruthy();
});

