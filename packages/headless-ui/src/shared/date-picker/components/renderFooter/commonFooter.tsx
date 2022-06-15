import React from 'react';
import cs from 'classnames';

type Props = {
  onPickPresent?: () => void;
  onConfirm?: () => void;
  disabledPresent?: boolean;
  presentText?: string;
  buttonText?: string;
};

export default function CommonFooter({
  onPickPresent,
  onConfirm,
  disabledPresent,
  buttonText = '确定',
  presentText = '今天',
}: Props): JSX.Element {
  function handleClickPresent() {
    if (disabledPresent) return;
    onPickPresent?.();
  }

  if (!onPickPresent && !onConfirm) return <></>;

  return (
    <div className="ofa-date-picker-common-footer">
      {onPickPresent && <span
        className={cs('ofa-date-picker-text-button', disabledPresent && 'is-disabled')}
        onClick={handleClickPresent}
      >{ presentText }</span>}
      {onConfirm && <button onClick={onConfirm}>{ buttonText }</button>}
    </div>
  );
}
