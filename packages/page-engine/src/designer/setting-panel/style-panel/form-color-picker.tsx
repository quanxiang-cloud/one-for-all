import React from 'react';
import { useController } from 'react-hook-form';

import { ColorPicker } from '@ofa/ui';

interface Props {
  control: any;
  name: string;
}

function FormColorPicker({ name, control }: Props): JSX.Element {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    // rules: { required: true },
    // defaultValue: "",
  });
  return (
    <div>
      <ColorPicker onChange={onChange} value={value} />
    </div>
  );
}

export default FormColorPicker;
