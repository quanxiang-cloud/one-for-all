import React, { useEffect, useState, useRef } from 'react';
import cs from 'classnames';
import { useTable, TableOptions, useRowSelect } from 'react-table';

import { getDefaultSelectMap, useExtendColumns, DEFAULT_WIDTH, MINIMUM_WIDTH } from './utils';
import useSticky from './use-sticky';
import AdjustHandle from './adjust-handle';

import './index.scss';

function Table<T extends Record<string, any>>({
  className,
  columns,
  data,
  emptyTips,
  initialSelectedRowKeys,
  loading,
  onRowClick,
  isCompact,
  onSelectChange,
  rowKey = 'id',
  showCheckbox,
  style,
  canSetColumnWidth,
  canAcrossPageChoose,
  initWidthMap,
  widthMapChange,
}: TableProps<T>): JSX.Element {
  const _columns = useExtendColumns(columns, showCheckbox);
  const widthMapRef = useRef<WidthMap>({});
  const [widthMap, setWidthMap] = useState<WidthMap>(initWidthMap || {});
  widthMapRef.current = widthMap;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      data,
      columns: _columns,
      getRowId: (row) => row[rowKey],
      initialState: { selectedRowIds: getDefaultSelectMap(initialSelectedRowKeys || []) },
    } as TableOptions<T>,
    useRowSelect,
    useSticky,
  );

  const handleWidthChange = (x: number, columnID: string): void => {
    if (x < MINIMUM_WIDTH) {
      return;
    }

    const _widthMap = {
      ...widthMapRef.current,
      [columnID]: x,
    };
    setWidthMap(_widthMap);
  };

  useEffect(() => {
    const _widthMap: WidthMap = {};
    _columns.forEach((col) => {
      const _width = widthMapRef.current[col.id];
      if (!_width || !canSetColumnWidth) {
        _widthMap[col.id] = col.width || DEFAULT_WIDTH;
      } else {
        _widthMap[col.id] = _width;
      }
    });

    setWidthMap({ ...widthMapRef.current, ..._widthMap });
  }, [_columns]);

  useEffect(() => {
    if (!onSelectChange) {
      return;
    }

    const selectedRows = selectedFlatRows.map(({ original }) => original);
    const selectedKeys = canAcrossPageChoose
      ? Object.keys(selectedRowIds)
      : selectedRows.map((row) => row[rowKey] as string);
    onSelectChange(selectedKeys, selectedRows);
  }, [Object.keys(selectedRowIds).length]);

  const tableFooterRender = (): JSX.Element | undefined => {
    if (rows.length === 0) {
      return <div className="ofa-table-empty">{emptyTips}</div>;
    }
  };

  if (!headerGroups.length) {
    return <div>data error</div>;
  }

  return (
    <div className={cs('ofa-table', className, { 'ofa-table-compact': isCompact })} style={style}>
      <table {...getTableProps()}>
        <colgroup id="colgroup">
          {headerGroups[0].headers.map((header) => {
            return (
              <col
                {...header.getHeaderProps()}
                id={`th-${header.id}`}
                width={widthMap[header.id]}
                key={header.id}
              />
            );
          })}
        </colgroup>
        <thead>
          <tr className={cs({ 'ofa-table-adjust-header': canSetColumnWidth })}>
            {headerGroups[0].headers.map((header, index) => {
              return (
                <th
                  data-width={widthMap[header.id]}
                  {...header.getHeaderProps()}
                  key={header.id}
                  className="ofa-table-th"
                >
                  {header.render('Header')}
                  {canSetColumnWidth && header.id !== '_selector' && index !== _columns.length - 1 && (
                    <AdjustHandle
                      onMouseUp={() => widthMapChange?.(widthMapRef.current)}
                      thID={`th-${header.id}`}
                      onChange={(x) => handleWidthChange(x, header.id)}
                    />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => onRowClick?.(row.id, row.original)}
                key={row.id}
                className="ofa-table-tr"
                data-row={JSON.stringify({
                  id: row?.id ?? '',
                  selectedRow: row?.original ?? {},
                })}
              >
                {row.cells.map((cell) => {
                  return (
                    <td className="ofa-table-td" {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {tableFooterRender()}
      {loading && <div className="ofa-table-loading-box">Loading...</div>}
    </div>
  );
}

export default Table;
