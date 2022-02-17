import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  FormEvent,
} from "react";
import cs from "classnames";

import { ColData } from "./config-form";
interface Props {
  className?: string;
  style?: CSSProperties;
  "data-node-key"?: string;
  cols: ColData[];
  rows: Record<string, string>[];
}

function Table(
  { className, cols, rows, ...rest }: Props,
  ref: ForwardedRef<HTMLTableElement>
) {
  function handleSumit(e: FormEvent): void {
    e.preventDefault();
  }
  const renderHead = () => {
    try {
      return cols?.map((col) => (
        <th className="border p-4" key={col.id}>
          {col.label}
        </th>
      ));
    } catch (e: any) {
      return [];
    }
  };
  const renderRows = () => {
    try {
      return rows?.map((row, index) => {
        const renderContent = cols.map((col) => {
          const content = row[col.key] || "--";
          return (
            <td className="border p-4" key={`row${index}-col${col.id}`}>
              {content}
            </td>
          );
        });
        return <tr key={`row${index}`}>{renderContent}</tr>;
      });
    } catch (e: any) {
      return [];
    }
  };

  return (
    <table
      className={cs("table-fixed", "border-collapse", className)}
      {...rest}
      onSubmit={handleSumit}
      ref={ref}
    >
      <colgroup>
        {
          cols.map((col) => <col key={`col-${col.id}`} width={100} span={1}></col>)
        }
      </colgroup>
      <thead>
        <tr>{renderHead()}</tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
}

export default forwardRef(Table);
