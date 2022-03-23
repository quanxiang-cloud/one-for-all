import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tab, { TabNavs } from '../index';

const navs: TabItemProps<React.Key>[] = [
  { id: '1', name: 'tab1', content: 'tab1 content' },
  { id: '2', name: 'tab2', state: 'error', content: 'tab2 content' },
  { id: '3', name: 'tab3', state: 'warning', content: 'tab3 content' },
  { id: '4', name: 'tab4', state: 'error', disabled: true, content: 'tab4 content' },
];

const tabNavsTestProps: TabNavProps<React.Key> = {
  navs,
  style: {
    backgroundColor: 'red',
    width: '80%',
    height: '50px',
  },
  className: 'test-className',
  activeNavClassName: 'test-active-className',
  navsClassName: 'test-navs-className',
  currentKey: '2',
  onClick: (item) => {
    console.log(item);
  },
};

test('tab navs props test', () => {
  const { container } = render(<TabNavs {...tabNavsTestProps} />);
  expect(container).toMatchSnapshot();
});

test('tab navs ref test', () => {
  const tabNavsRef = React.createRef<HTMLDivElement>();
  render(<TabNavs {...tabNavsTestProps} ref={tabNavsRef} />);
  expect(tabNavsRef.current && tabNavsRef.current instanceof HTMLDivElement).toBeTruthy();
});

test('tab navs click test', () => {
  const handleClick = jest.fn();
  const clickTestProps: TabNavProps<React.Key> = {
    navs,
    className: 'tab-click-test-className',
    activeNavClassName: 'tab-click-test-active-className',
    currentKey: '2',
    onClick: handleClick,
  };

  const { container } = render(<TabNavs {...clickTestProps} />);
  fireEvent.click(container.querySelectorAll('.ofa-tab-nav-item')[1]);
  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(container.querySelector('.tab-click-test-active-className')?.innerHTML).toEqual('tab2');
  expect(container).toMatchSnapshot();
});

test('tab props test', () => {
  const tabTestProps: TabsProps<React.Key> = {
    items: navs,
    direction: 'horizon',
    maxHeight: '500px',
    className: 'test-className',
    activeNavClassName: 'test-active-className',
    navsClassName: 'test-navs-className',
    currentKey: '1',
    onChange: (key) => {
      console.log(key);
    },
  };

  const { container } = render(<Tab {...tabTestProps} />);
  expect(container).toMatchSnapshot();
});
