import React, { useEffect, useState } from "react";
import { cloneDeep, defaults } from "lodash";
import { observer } from "mobx-react";
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { nanoid } from "nanoid";

import { Icon, Button, Modal, toast } from "@one-for-all/ui";

import { useCtx, DataBind as ConfigBind } from "../../../index";

export type ColData = {
  id: string;
  key: string;
  label: string;
  fixed?: boolean;
  width?: number;
};

export type RowData = {
  key: string;
  value: string;
};

export const DEFAULT_CONFIG: Props = {
  cols: [
    {
      id: `col-${nanoid(8)}`,
      key: "",
      label: "第1列",
      fixed: false,
      width: 100,
    },
  ],
  rows: [],
  hasBorder: true,
};

export interface Props {
  cols?: ColData[];
  rows?: RowData[][];
  hasBorder?: boolean;
}

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState(getDefaultProps());
  const [modalTableDataOpen, setModalTableDataOpen] = useState(false);
  const [tableData, setTableData] = useState(JSON.stringify(values?.rows));
  const { activeElem } = page;

  useEffect(() => {
    page.updateElemProperty(activeElem.id, "props", values);
  }, [values]);

  function getDefaultProps(): Record<string, any> {
    return defaults({}, page.activeElemProps, DEFAULT_CONFIG);
  }

  function addCol(): void {
    setValues({
      ...values,
      cols: [
        ...values.cols,
        {
          id: `col-${nanoid(8)}`,
          key: "",
          label: `第${values.cols.length + 1}列`,
          fixed: false,
          width: 100,
        },
      ],
    });
  }

  function deleteCol(index: number): void {
    if (values.cols.length <= 1) {
      return;
    }
    values.cols.splice(index, 1);
    setValues({
      ...values,
    });
  }

  function handleColChange(key: string, index: number, value: string | boolean): void {
    const cols = cloneDeep(values.cols)
    cols[index][key] = value;
    setValues({
      ...values,
      cols: [...cols]
    });
  }

  function handleTableDataVal(): void {
    try {
      const bindVal = JSON.parse(tableData);
      if (bindVal === null) {
        setModalTableDataOpen(false);
        return;
      }
      if (!Array.isArray(bindVal)) {
        toast.error('表格数据必须为数组');
        return;
      }
      setValues({
        ...values,
        rows: bindVal
      });
      setModalTableDataOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <form>
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <label className="mr-4 text-12 text-gray-600">ID</label>
          </div>
          <div className="mb-8 flex items-center justify-between">
            <input
              type="text"
              className="mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
              value={values.id}
              onChange={(e) =>
                setValues({
                  ...values,
                  id: e.target.value,
                })
              }
            />
            <ConfigBind name="id" />
          </div>
        </div>
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <label className="mr-4 text-12 text-gray-600">单元格边框</label>
            <input type="checkbox" name="border" checked={values.hasBorder} onChange={(e) => {
              setValues({
                ...values,
                hasBorder: !values.hasBorder,
              })
            }}/>
          </div>
        </div>
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <label className="mr-4 text-12 text-gray-600">列配置</label>
            <ConfigBind name="cols" />
          </div>
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-4">
              <label>key</label>
              <label>名称</label>
              <label>宽度</label>
              <label>固定</label>
            </div>
            {values.cols.map((col: ColData, index: number) => (
              <div
                className="mb-8 flex items-center justify-between"
                key={col.id}
              >
                <div className="w-full grid grid-cols-4 gap-4">
                  <input
                    type="text"
                    className="px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
                    value={col.key}
                    onChange={(e) => handleColChange("key", index, e.target.value)}
                  />
                  <input
                    type="text"
                    className="px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
                    value={col.label}
                    onChange={(e) => handleColChange("label", index, e.target.value)}
                  />
                  <input
                    type="text"
                    className="px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
                    value={col.width}
                    onChange={(e) => handleColChange("width", index, e.target.value)}
                  />
                  <div className="inline-flex items-center justify-around">
                    <input type="checkbox" className="mr-8" checked={col.fixed} onChange={(e) => handleColChange("fixed", index, !col.fixed)} />
                    <Icon
                      clickable
                      name="delete"
                      disabled={values.cols.length <= 1}
                      onClick={() => deleteCol(index)}
                    ></Icon>
                  </div>
                </div>
              </div>
            ))}
            <Icon name="add" clickable onClick={addCol}></Icon>
          </div>
        </div>
        <div className="mb-8">
          <div className="mb-8 flex items-center justify-between">
            <Button onClick={() => setModalTableDataOpen(true)}>绑定表格数据</Button>
            <ConfigBind name="rows" />
          </div>
        </div>
      </form>
      {modalTableDataOpen && (
        <Modal
          title="绑定表格数据"
          onClose={() => setModalTableDataOpen(false)}
          footerBtns={[
            {
              key: "close",
              iconName: "close",
              onClick: () => setModalTableDataOpen(false),
              text: "取消",
            },
            {
              key: "check",
              iconName: "check",
              modifier: "primary",
              onClick: handleTableDataVal,
              text: "绑定",
            },
          ]}
        >
          <Editor
            value={
              typeof tableData === "string"
                ? tableData
                : JSON.stringify(tableData)
            }
            height="120px"
            extensions={[javascript()]}
            onChange={(value) => {
              setTableData(value);
            }}
          />
        </Modal>
      )}
    </>
  );
}

export default observer(ConfigForm);
