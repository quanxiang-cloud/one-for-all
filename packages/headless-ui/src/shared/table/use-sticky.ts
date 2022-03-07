// based on https://github.com/GuillaumeJasmin/react-table-sticky
interface Column {
  Header: any;
  columns?: Column[];
  getHeaderProps: () => {
    style: Record<string, any>;
  };
  id: string | number;
  parent?: Column;
  fixed?: boolean;
  totalLeft: number;
}

export function columnIsLastLeftSticky(columnId: Column['id'], columns: any): boolean {
  const index = columns.findIndex(({ id }: any) => id === columnId);
  const column = columns[index];
  const nextColumn = columns[index + 1];
  // todo fixed property must be continuously, do you have a better way?
  return nextColumn && !nextColumn?.fixed && column.fixed;
}

export function columnIsFirstRightSticky(columnId: Column['id'], columns: any): boolean {
  const index = columns.findIndex(({ id }: any) => id === columnId);
  const column = columns[index];
  const prevColumn = columns[index - 1];
  // todo fixed property must be continuously, do you have a better way?
  return prevColumn && !prevColumn?.fixed && column.fixed;
}

export function getMargin(columnId: Column['id'], columns: any) {
  const currentIndex = columns.findIndex(({ id }: any) => id === columnId);
  let leftMargin = 0;
  let rightMargin = 0;
  for (let i = 0; i < currentIndex; i += 1) {
    if (columns[i].fixed) {
      leftMargin += columns[i].width;
    }
  }

  for (let i = currentIndex + 1; i < columns.length; i += 1) {
    if (columns[i].fixed) {
      rightMargin += columns[i].width;
    }
  }

  return { leftMargin, rightMargin };
}

const cellStylesSticky = {
  // hard coded inline style will be remove in the next major release
  position: 'sticky',
  zIndex: 3,
};

function findHeadersSameLevel(header: any, headers: any) {
  return headers.filter((flatHeaderItem: any) => {
    return flatHeaderItem.depth === header.depth;
  });
}

function getStickyProps(header: any, instance: any): { style: React.CSSProperties } {
  let style = {};
  const dataAttrs: Record<string, string | boolean> = {};

  if (!header.fixed) {
    return {
      style,
      ...dataAttrs,
    };
  }

  style = {
    ...cellStylesSticky,
  };

  dataAttrs['data-sticky-td'] = true;

  const headers = findHeadersSameLevel(header, instance.flatHeaders);
  const { leftMargin, rightMargin } = getMargin(header.id, headers);
  // todo explain this
  const index = headers.findIndex(({ id }: any) => id === header.id);
  const zIndex = headers.length - index + 1;
  style = {
    ...style,
    zIndex,
    minWidth: header.minWidth,
    maxWidth: header.maxWidth,
    left: `${leftMargin}px`,
    right: `${rightMargin}px`,
  };

  const isLastLeftSticky = columnIsLastLeftSticky(header.id, headers);
  if (isLastLeftSticky) {
    dataAttrs['data-sticky-last-left-td'] = true;
  } else if (columnIsFirstRightSticky(header.id, headers)) {
    dataAttrs['data-sticky-first-right-td'] = true;
  }

  return {
    style,
    ...dataAttrs,
  };
}

const useSticky = (hooks: any) => {
  hooks.getHeaderProps.push((props: any, { instance, column }: any) => {
    const nextProps = getStickyProps(column, instance);
    return [props, nextProps];
  });

  hooks.getCellProps.push((props: any, { instance, cell }: any) => {
    const nextProps = getStickyProps(cell.column, instance);
    // all cell should have the same z-index
    nextProps.style.zIndex = 1;
    return [props, nextProps];
  });
};

useSticky.pluginName = 'useSticky';

export default useSticky;
