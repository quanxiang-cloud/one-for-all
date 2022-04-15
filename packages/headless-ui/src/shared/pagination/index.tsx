import React, { useEffect, forwardRef, ForwardedRef } from 'react';
import cs from 'classnames';
import Icon from '@one-for-all/icon'

import Select from '../select';
import Input from '../input';

import Pager from './pager';

import './index.scss';

function Pagination(
  {
    current = 1,
    total = 0,
    pageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    renderTotalTip,
    showSizeChanger = true,
    showQuickJumper,
    showLessItems,
    onChange,
    className,
  }: PaginationProps,
  ref: ForwardedRef<HTMLUListElement>,
): JSX.Element | null {
  const [pageParams, setPageParams] = React.useState({
    current: current || 0,
    _current: '',
    pageSize: 10,
  });

  useEffect(() => {
    setPageParams((params) => ({ ...params, current, pageSize: pageSize || params.pageSize }));
  }, [pageSize, current]);

  function calcPage(p?: number): number {
    let pageSizes = p;
    if (typeof pageSizes === 'undefined') {
      pageSizes = pageParams.pageSize;
    }
    return Math.floor((total - 1) / pageSizes) + 1;
  }

  function isValid(page: number): boolean {
    return typeof page === 'number' && page >= 1 && page !== pageParams.current;
  }

  function handleChange(p: number): number {
    let page = p;
    if (isValid(page)) {
      if (page > calcPage()) {
        page = calcPage();
      }
    }

    setPageParams({
      current: page,
      pageSize: pageParams.pageSize,
      _current: '',
    });

    onChange && onChange(page, pageParams.pageSize);

    return pageParams.current;
  }

  function changePageSize(size: number): void {
    setPageParams({
      current: 1,
      pageSize: size,
      _current: '',
    });
    onChange && onChange(1, size);
  }

  function handleInputOnblur(): void {
    const isNumber = pageParams._current !== '' && !isNaN(Number(pageParams._current));
    if (isNumber) {
      handleChange(Number(pageParams._current));
    }
  }

  function handleInputKeydown(e: React.KeyboardEvent): void {
    if (e.key !== 'Enter') {
      return;
    }
    handleInputOnblur();
  }

  function handPrev(): void {
    if (hasPrev()) {
      handleChange(pageParams.current - 1);
    }
  }

  function handleNext(): void {
    if (hasNext()) {
      handleChange(pageParams.current + 1);
    }
  }

  function handleJumpPrev(): void {
    handleChange(Math.max(1, pageParams.current - 5));
  }

  function handleJumpNext(): void {
    handleChange(Math.min(calcPage(), pageParams.current + 5));
  }

  function hasPrev(): boolean {
    return pageParams.current > 1;
  }

  function hasNext(): boolean {
    return pageParams.current < calcPage();
  }

  function handleInputChange(value: string): void {
    setPageParams({
      pageSize: pageParams.pageSize,
      current: pageParams.current,
      _current: value,
    });
  }

  const prevIcon = (
    <li
      className={cs('ofa-pagination-prev', {
        'ofa-pagination-disabled': pageParams.current === 1,
      })}
      onClick={handPrev}
    >
      <Icon name="chevron_left" />
    </li>
  );

  const nextIcon = (
    <li
      className={cs('ofa-pagination-next', {
        'ofa-pagination-disabled': pageParams.current === calcPage(),
      })}
      onClick={handleNext}
    >
      <Icon name="chevron_right" />
    </li>
  );

  const allPages = calcPage();
  const pagerList = [];
  let firstPager = null;
  let lastPager = null;
  let jumpPrev = null;
  let jumpNext = null;
  let totalText = null;
  let pageSizeText = null;
  let quickJumperText = null;

  if (allPages <= 9) {
    for (let i = 1; i <= allPages; i += 1) {
      const active = pageParams.current === i;
      pagerList.push(<Pager key={i} page={i} active={active} onClick={() => handleChange(i)} />);
    }
  } else {
    lastPager = (
      <Pager key={allPages} page={allPages} active={false} onClick={() => handleChange(allPages)} />
    );
    firstPager = <Pager key={1} page={1} active={false} onClick={() => handleChange(1)} />;
    jumpPrev = (
      <li
        key="jumpPrev"
        className="ofa-pagination-page ofa-pagination-jump ofa-pagination-jump-prev"
        onClick={handleJumpPrev}
      >
        <Icon className="icon" name="more_horiz" />
        <Icon className="prev" name="double_arrow" />
      </li>
    );
    jumpNext = (
      <li
        key="jumpNext"
        className="ofa-pagination-page ofa-pagination-jump ofa-pagination-jump-next"
        onClick={handleJumpNext}
      >
        <Icon className="icon" name="more_horiz" />
        <Icon className="next" name="double_arrow" />
      </li>
    );

    const num = showLessItems ? 2 : 4;
    const secondNum = showLessItems ? 3 : 4;

    const _current = pageParams.current;
    let left = Math.max(1, _current - num / 2);
    let right = Math.min(_current + num / 2, allPages);

    if (_current - 1 <= num / 2) {
      right = 1 + num;
    }

    if (allPages - _current <= num / 2) {
      left = allPages - num;
    }

    for (let i = left; i <= right; i += 1) {
      const active = _current === i;
      pagerList.push(<Pager key={i} page={i} active={active} onClick={() => handleChange(i)} />);
    }

    if (_current - 1 >= secondNum) {
      pagerList.unshift(jumpPrev);
    }
    if (allPages - _current >= secondNum) {
      pagerList.push(jumpNext);
    }

    if (left !== 1) {
      pagerList.unshift(firstPager);
    }
    if (right !== allPages) {
      pagerList.push(lastPager);
    }
  }

  if (renderTotalTip) {
    totalText = <>{renderTotalTip(allPages)}</>;
  }

  if ((showSizeChanger && total <= 50) || total > 50) {
    pageSizeText = (
      <li className="ofa-pagination-select-wrapper">
        <div>每页</div>
        <Select
          value={pageParams.pageSize}
          onChange={changePageSize}
          options={
            pageSizeOptions
              ? pageSizeOptions.map((page: number) => ({
                label: `${page} 条`,
                value: page,
              }))
              : []
          }
        />
      </li>
    );
  }

  if (showQuickJumper) {
    quickJumperText = (
      <li className="ofa-pagination-quick-jumper">
        <div>跳至</div>
        <Input
          className="ofa-pagination-quick-jumper-input"
          value={pageParams._current}
          onChange={handleInputChange}
          onBlur={handleInputOnblur}
          onKeyDown={handleInputKeydown}
        />
        <div>页</div>
      </li>
    );
  }

  return (
    <ul ref={ref} className={cs('ofa-pagination', className)}>
      <li className="ofa-pagination-total">{totalText || `共 ${total} 条数据`}</li>
      {prevIcon}
      {pagerList}
      {nextIcon}
      {pageSizeText}
      {quickJumperText}
    </ul>
  );
}

export default forwardRef(Pagination);
