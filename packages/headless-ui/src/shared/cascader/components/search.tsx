import React, { useMemo } from 'react';
import Icon from '@one-for-all/icon';
import cs from 'classnames';

import { searchPaths, getOriginInfoByPath, isMultiple, Tree } from '../utils';

type Props = {
  searchText: string;
  showSearch: boolean | ShowSearchType;
  forest: Tree<CascaderOptionType>[];
  model: CascaderModelType;
  onChangeChecked: (treeNode: Tree<CascaderOptionType>, isChecked: boolean) => void;
  onClose: () => void;
};

export default function Search({
  searchText,
  showSearch,
  forest,
  model,
  onChangeChecked,
  onClose,
}: Props): JSX.Element {
  const { filter, render, sort, limit }: ShowSearchType = useMemo(() => {
    if (showSearch instanceof Object) return showSearch;
    return {};
  }, [showSearch]);

  const paths = useMemo(() => {
    return searchPaths({ forest, model, searchText, filter, sort, limit });
  }, [searchText]);

  function handleClick(checkNode: Tree<CascaderOptionType>) {
    if (checkNode.origin.disabled) return;

    if (isMultiple(model)) {
      onChangeChecked(checkNode, !checkNode.isChecked);
    } else {
      onChangeChecked(checkNode, true);
      onClose();
    }
  }

  function pathHasDisabled(path: Tree<CascaderOptionType>[]): boolean {
    let hasDisabled = false;
    path.forEach(({ origin }) => {
      if (origin.disabled) hasDisabled = true
    });
    return hasDisabled;
  };

  if (!paths.length)
    return (
      <div className="ofa-cascader-empty">
        <Icon name="data_usage" />
        <p className="ofa-cascader-empty-text">not match data</p>
      </div>
    );

  return (
    <div className="ofa-cascader-search">
      {
        paths.map((path) => {
          const lastNode = path[path.length - 1];
          const { value, label, origins } = getOriginInfoByPath(path);
          const disabled = pathHasDisabled(path);
          return (
            <div
              className={cs('ofa-scacader-search-item', lastNode.isChecked && 'is-selected', disabled && 'is-disabled')}
              key={value.join()}
              onClick={() => handleClick(lastNode)}
            >
              {render ? render(searchText, origins as CascaderOptionType[]) : label.join('/')}
            </div>
          );
        })
      }
    </div>
  );
}
