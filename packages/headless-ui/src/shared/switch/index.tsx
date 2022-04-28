import React, { Ref, forwardRef, useState, useEffect } from 'react';
import cs from 'classnames';

import './index.css';

function Switch(
  { onChange, className, style, onText = '', offText = '', disabled = false, checked = false }: SwitchProps,
  ref?: Ref<HTMLLabelElement>,
): JSX.Element {
  const [switcChecked, setSwitchChecked] = useState(checked);

  useEffect(() => {
    setSwitchChecked(checked);
  }, [checked])

  const handleToggleSwitch = (): void => {
    if (disabled) {
      return;
    }
    setSwitchChecked(!switcChecked);
    onChange && onChange(!switcChecked);
  };

  return (
    <label
      className={cs('ofa-switch', className, {
        'ofa-switch-disabled': disabled,
        'ofa-switch-checked': switcChecked,
      })}
      style={style}
      onClick={handleToggleSwitch}
      ref={ref}
    >
      <span
        className={cs('ofa-switch-text', {
          'ofa-switch-text-checked': switcChecked,
        })}
      >
        {checked ? onText : offText}
      </span>
    </label>
  );
}

export default forwardRef(Switch);
