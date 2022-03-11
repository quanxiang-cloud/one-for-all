import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Icon from '@one-for-all/icon'

import { Notice } from '../index';

const toastPropsTest: ToastProps = {
  modifier: 'success',
  content: 'Test toast success!',
  duration: 1000,
  icon: <Icon name="close" size={18}/>,
  onClose: () => {
    console.log('Success toast is closed');
  },
}


test('tab navs props test', () => {
  const { container } = render( <Notice notice={{id:'1', ...toastPropsTest}} />);
  expect(container.querySelector('.ofa-notice')).toHaveTextContent('Test toast success!')
  expect(container).toMatchSnapshot();
})