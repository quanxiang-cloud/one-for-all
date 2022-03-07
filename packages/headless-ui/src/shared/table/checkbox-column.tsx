import React from 'react';
import { CellProps, HeaderProps } from 'react-table';

export default {
  id: '_selector',
  disableResizing: true,
  disableGroupBy: true,
  width: 48,
  // The header can use the table's getToggleAllRowsSelectedProps method
  // to render a checkbox
  Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
    <input type='checkbox' {...getToggleAllRowsSelectedProps()} />
  ),
  // The cell can use the individual row's getToggleRowSelectedProps method
  // to the render a checkbox
  Cell: ({ row }: CellProps<any>) => <input type='checkbox' {...row.getToggleRowSelectedProps()} />,
};
