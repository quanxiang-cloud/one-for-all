import {
  ColData
} from "./config-form";

const cellStylesSticky = {
  // hard coded inline style will be remove in the next major release
  position: 'sticky',
  zIndex: 3,
};

function getMargin(columnId: ColData['id'], columns: ColData[]): {
  leftMargin: number;rightMargin: number;
} {
  const currentIndex = columns.findIndex(({ id }: any) => id === columnId);
  let leftMargin = 0;
  let rightMargin = 0;
  for (let i = 0; i < currentIndex; i += 1) {
    if (columns[i].fixed) {
      leftMargin += columns[i].width || 100;
    }
  }

  for (let i = currentIndex + 1; i < columns.length; i += 1) {
    if (columns[i].fixed) {
      rightMargin += columns[i].width || 100;
    }
  }

  return {
    leftMargin,
    rightMargin
  };
}

export function getStickyStyles(col: ColData, columns: ColData[]): React.CSSProperties {
  let style = {};

  if (!col.fixed) {
    return {};
  }

  style = {
    ...cellStylesSticky,
  };

  const {
    leftMargin,
    rightMargin
  } = getMargin(col.id, columns);
  const index = columns.findIndex(({ id }: any) => id === col.id);
  const zIndex = columns.length - index + 1;
  style = {
    ...style,
    zIndex,
    left: `${leftMargin}px`,
    right: `${rightMargin}px`,
  };

  return style;
}
