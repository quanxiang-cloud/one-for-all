import React from 'react';
import { render, fireEvent, cleanup, screen, createEvent } from '@testing-library/react';

import Table from '../index';

afterEach(cleanup);

const props: TableProps<{ one: string; two: string; three: string; id: string }> = {
  rowKey: 'id',
  columns: [
    {
      Header: '列一',
      accessor: 'one',
      id: 'one',
    },
    {
      Header: '列二',
      accessor: 'two',
      id: 'two',
    },
    {
      Header: '列三',
      accessor: 'three',
      id: 'three',
    },
  ],
  data: [
    {
      one: 'Test',
      two: 'Test',
      three: 'Test',
      id: '1',
    },
  ],
};

it('Table render test', () => {
  const { container } = render(<Table {...props} />);
  expect(container.querySelector('.ofa-table')).toBeInTheDocument();
});

it('should render a compact table', () => {
  const { container } = render(<Table {...props} isCompact />);
  const table = container.querySelector('.ofa-table');
  expect(table).toHaveClass('ofa-table-compact');
});

it('should render a loading table', () => {
  const { container } = render(<Table {...props} loading />);
  const loadingTable = container.querySelector('.ofa-table-loading-box');
  expect(loadingTable).toBeInTheDocument();
});

it('should render a no data table', () => {
  const { getByText } = render(<Table {...props} data={[]} emptyTips="no data" />);
  const emptyTips = getByText(/no data/i);
  expect(!!emptyTips).toBeTruthy();
});

it('Row select test', () => {
  const toggle = jest.fn();
  const { container } = render(<Table {...props} showCheckbox onSelectChange={toggle} />);
  const a = container.querySelector<HTMLInputElement>("input[type='checkbox']");
  if (a) {
    a.click();
  }

  expect(toggle).toBeCalledWith(['1'], props.data);
});

it('Change the column width', () => {
  const { container } = render(<Table {...props} canSetColumnWidth />, {});
  const handler = container.querySelector('.ofa-table-adjust-handle') as HTMLDivElement;
  const firstTh = container.querySelector('th');
  const beforeWidth = Number(firstTh?.getAttribute('data-width')) || 0;
  const down = createEvent.mouseDown(handler, {
    clientX: 10,
    clientY: 20,
  });
  fireEvent(handler, down);
  const move = createEvent.mouseMove(document, {
    clientX: 30,
    clientY: 20,
  });
  fireEvent(document, move);
  const up = createEvent.mouseUp(document, {
    clientX: 30,
    clientY: 20,
  });
  fireEvent(document, up);
  const afterWidth = Number(firstTh?.getAttribute('data-width')) || 0;
  expect(afterWidth - beforeWidth).toEqual(20);
});
