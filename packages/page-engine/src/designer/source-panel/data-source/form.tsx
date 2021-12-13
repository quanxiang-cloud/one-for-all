import React from 'react';
import { FieldErrors } from 'react-hook-form';

export function FormItem({
  label,
  children,
}: {label: string; children?: React.ReactNode}): JSX.Element {
  return (
    <div className='form-item mb-24'>
      <div className='form-item-label'>{label}</div>
      <div className='form-item-ctrl'>
        {children}
      </div>
    </div>
  );
}

export function ErrorMsg({ errors, name }: {errors: FieldErrors, name: string}): JSX.Element | null {
  return errors[name] ? <p className='text-red-400 text-12 mb-5'>{errors[name].message}</p> : null;
}
