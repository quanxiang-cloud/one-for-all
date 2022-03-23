import React from 'react';
import { render } from '@testing-library/react';

import Breadcrumb from '../index';
// import Icon from '@one-for-all/icon';

const globalSegments: Array<Segment> = [
  {
    key: '1',
    text: 'segment1',
    path: '/test1',
  },
  {
    key: '2',
    text: 'segment2',
    path: '/test2',
  },
  {
    key: '3',
    text: 'segment3',
    path: '/test3',
  },
];

test('Breadcrumb props test', () => {
  const node: BreadcrumbProps = {
    segments: globalSegments,
    style: {
      color: 'blue',
    },
    className: 'breadcrumb-test',
    segmentClass: 'segment-test',
    segmentStyle: {
      fontSize: '20px',
    },
  };

  const { container } = render(<Breadcrumb {...node} />);
  expect(container).toMatchSnapshot();
});

test('Breadcrumb ref expose test', () => {
  const ref = React.createRef<HTMLDivElement>();

  render(<Breadcrumb segments={[]} ref={ref} />);
  expect(ref.current && ref.current instanceof HTMLDivElement).toBeTruthy();
});

test('Breadcrumb segmentRender event test', () => {
  const handleRender = (link: Segment): JSX.Element => {
    return (
      <div>
        {/* <Icon name="star" /> */}
        {link.text}
      </div>
    );
  };

  const { container } = render(<Breadcrumb segments={globalSegments} segmentRender={handleRender} />);
  expect(container).toMatchSnapshot();
});

test('Breadcrumb active test', () => {
  const node: BreadcrumbProps = {
    segments: globalSegments,
    activeClass: 'active-segment',
  };

  const { container } = render(<Breadcrumb {...node} />);
  expect(container).toMatchSnapshot();
});

test('Breadcrumb separator test', () => {
  const node: BreadcrumbProps = {
    segments: globalSegments,
    separator: '>',
  };

  const { container } = render(<Breadcrumb {...node} />);
  expect(container).toMatchSnapshot();
});
