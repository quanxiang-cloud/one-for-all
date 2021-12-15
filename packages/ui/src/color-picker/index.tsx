import React, { useState, useRef, forwardRef } from 'react';
import { SketchPicker, ColorResult, RGBColor } from 'react-color';

import { Popper } from '@ofa/ui';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

function ColorPicker(props: Props, refss: any): JSX.Element {
  console.log('props', props);
  const { value, onChange } = props;
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);
  const [currColor, setCurrColor] = useState<RGBColor>({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });

  // useEffect(() => {
  //   if (value) {
  //     const _val = formatStringToRgba(value);
  //     setCurrColor(_val);
  //   }
  // }, [value]);

  function handleColorChange(color: ColorResult): void {
    const { rgb } = color;
    setCurrColor(rgb);
    const _val = formatRgba(rgb);
    console.log('走了改变了呀');
    onChange && onChange(_val);
  }

  function formatRgba(rgba: RGBColor): string {
    let _rgba = '';
    const { r, g, b, a } = rgba;
    _rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
    return _rgba;
  }

  function formatStringToRgba(val: string): RGBColor {
    const rgba = {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    };

    const arr = val.split(',');
    if (arr.length !== 4) {
      return rgba;
    }

    rgba.r = Number(arr[0].substring(5)) || 255;
    rgba.g = Number(arr[1]) || 255;
    rgba.b = Number(arr[2]) || 255;
    rgba.a = Number(arr[3].substring(0, arr[3].length - 1)) || 255;
    return rgba;
  }

  return (
    <div >
      <div
        ref={reference}
        className='w-16 h-16 border border-gray-300'
        style={{ backgroundColor: formatRgba(currColor) }}
      ></div>
      <Popper
        ref={popperRef}
        reference={reference}
      >
        <SketchPicker
          color={currColor}
          onChangeComplete={handleColorChange}
        />
      </Popper>
    </div>
  );
}

export default forwardRef(ColorPicker);
