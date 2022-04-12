import React from 'react';
import Icon from '@one-for-all/icon';

import cs from 'classnames';

import Checkbox from '../checkbox';
import { Tree } from './hooks';

type Props = {
  forest: Tree<CascaderOptionType>[];
  expandNodes: Tree<CascaderOptionType>[];
  multipleSelect: boolean;
  expandTrigger: CascaderExpandTrigger;
  expandIcon?: React.ReactNode;
  notFoundContent: React.ReactNode;
  changeOnSelect: boolean;
  onChecked: (treeNode: Tree<CascaderOptionType>, isChecked: boolean) => void;
  onExpandNodes: (expandNodes: Tree<CascaderOptionType>[]) => void;
  onClose: () => void;
  loadData?: (selectedOptions?: CascaderOptionType[]) => void;
};

export default function RenderOptions({
  forest,
  expandNodes,
  multipleSelect,
  expandTrigger,
  expandIcon,
  notFoundContent,
  changeOnSelect,
  onChecked,
  onExpandNodes,
  onClose,
  loadData,
}: Props): JSX.Element {
  const handleOptionSelected = (expandNode: Tree<CascaderOptionType>, trigger: CascaderExpandTrigger) => {
    const { origin, isLeaf, children } = expandNode;
    if (
      origin.disabled ||
      (expandTrigger === 'click' && trigger === 'hover') ||
      (expandTrigger === 'hover' && trigger === 'click' && !isLeaf)
    )
      return;

    const currentExpandNodes: Tree<CascaderOptionType>[] = [];
    let currentExpandNode: Tree<CascaderOptionType> | undefined = expandNode;
    while (currentExpandNode) {
      currentExpandNodes.unshift(currentExpandNode);
      currentExpandNode = currentExpandNode.parent;
    }

    if (isLeaf && trigger !== 'hover' && !multipleSelect) {
      onClose();
    }

    if (!isLeaf && !children) {
      loadData?.(currentExpandNodes.map((node) => node.origin));
    }

    if ((isLeaf && trigger !== 'hover') || changeOnSelect) {
      onChecked(expandNode, true);
    }
    onExpandNodes(currentExpandNodes);
  };

  const handleCheckChange = (treeNode: Tree<CascaderOptionType>) => {
    onChecked(treeNode, !treeNode.isChecked);
  };

  const renderOptionsBySelected = (
    forest: Tree<CascaderOptionType>[],
    expandNodes: Tree<CascaderOptionType>[],
  ): JSX.Element[] => {
    const key = getKeyByExpandNodesValue(expandNodes);
    if (!expandNodes.length || !expandNodes[0].children) return [renderOption(forest, key)];
    return [
      renderOption(forest, key),
      ...renderOptionsBySelected(expandNodes[0].children, expandNodes.slice(1)),
    ];
  };

  function getKeyByExpandNodesValue(nodes: Tree<CascaderOptionType>[]): string {
    const computedLength = expandNodes.length - nodes.length;
    const res: NumberString[] = [];
    for (let i = 0; i < computedLength; i++) {
      res.push(expandNodes[i].origin.value);
    }
    return res.join('/');
  }

  const renderOption = (forest: Tree<CascaderOptionType>[], key: string) => (
    <div className="ofa-cascader-option" key={key}>
      {forest.map((treeNode) => {
        const { origin: option, isChecked, indeterminate, isLeaf } = treeNode;
        return (
          <div
            className={cs(
              'ofa-cascader-option-item',
              expandNodes.includes(treeNode) && 'is-selected',
              option.disabled && 'is-disabled',
            )}
            key={option.value}
            onClick={() => handleOptionSelected(treeNode, 'click')}
            onMouseEnter={() => handleOptionSelected(treeNode, 'hover')}
          >
            {multipleSelect && (
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  style={{ marginRight: 5 }}
                  indeterminate={indeterminate}
                  value={isChecked}
                  checked={isChecked}
                  onChange={() => handleCheckChange(treeNode)}
                />
              </div>
            )}
            <p className="ofa-cascader-item-text">{option.label}</p>
            {!isLeaf && (expandIcon || <Icon name="keyboard_arrow_right" />)}
          </div>
        );
      })}
    </div>
  );

  if (!forest || !forest.length)
    return (
      <div className="ofa-cascader-empty">
        {notFoundContent || (
          <>
            <Icon name="data_usage" />
            <p className="ofa-cascader-empty-text">not option</p>
          </>
        )}
      </div>
    );

  return <div className="ofa-cascader-options">{renderOptionsBySelected(forest, expandNodes)}</div>;
}
