import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
} from "react";
import cs from "classnames";

import { ColData } from "./config-form";
import { getStickyStyles } from "./sticky";

import './index.scss';
interface Props {
  className?: string;
  style?: CSSProperties;
  "data-node-key"?: string;
  cols: ColData[];
  rows: Record<string, string>[];
  hasBorder: boolean;
}

function Table(
  { className, cols, rows, hasBorder, ...rest }: Props,
  ref: ForwardedRef<HTMLTableElement>
) {
  const renderHead = () => {
    try {
      return cols?.map((col) => {
        const style = getStickyStyles(col, cols)
        return (
          <th className={cs('p-4', hasBorder && 'border')} key={col.id} style={style}>
            {col.label}
          </th>
        )
      });
    } catch (e: any) {
      return [];
    }
  };
  const renderRows = () => {
    try {
      return rows?.map((row, index) => {
        const renderContent = cols.map((col) => {
          const content = row[col.key] || "--";
          const style = getStickyStyles(col, cols)
          return (
            <td className={cs('p-4', hasBorder && 'border')} key={`row${index}-col${col.id}`} style={style}>
              {content}
            </td>
          );
        });
        return <tr className='qxp-table-tr' key={`row${index}`}>{renderContent}</tr>;
      });
    } catch (e: any) {
      return [];
    }
  };

  return (
    <div className={cs("qxp-table-wrapper", "relative", className)} {...rest} ref={ref}>
      <div className={cs('qxp-table', className, `qxp-table-middle`)}>
        <table
          className={cs("table-fixed", "border-collapse", className)}
        >
          <colgroup>
            {
              cols.map((col) => {
                const style = getStickyStyles(col, cols)
                return <col width={col.width || 100} key={`col-${col.id}`} span={1} style={style}></col>
              })
            }
          </colgroup>
          <thead>
            <tr className='qxp-table-tr'>{renderHead()}</tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default forwardRef(Table);
