import React from 'react';
import cs from 'classnames';

interface Props {
  key: number;
  page: number;
  active: boolean;
  onClick(): void;
}

function Pager({ page, active, onClick }: Props) {
  return (
    <li
      onClick={onClick}
      className={cs('ofa-pagination-page-item', { 'ofa-pagination-current-page': active })}
    >
      {page}
    </li>
  );
}

export default Pager;
