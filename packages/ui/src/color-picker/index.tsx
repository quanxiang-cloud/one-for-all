import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker, ColorResult, RGBColor } from 'react-color';

import { Popper } from '@ofa/ui';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  opacity?: boolean;
}

function ColorPicker(props: Props): JSX.Element {
  const { value, onChange, opacity = false } = props;
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);
  const [currColor, setCurrColor] = useState<RGBColor>({
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  });

  useEffect(() => {
    if (value) {
      const _val = formatStringToRgba(value);
      setCurrColor(_val);
    }
  }, [value]);

  function handleColorChange(color: ColorResult): void {
    const { rgb } = color;
    setCurrColor(rgb);
    const _val = formatRgba(rgb);
    onChange && onChange(_val);
  }

  function formatRgba(rgba: RGBColor): string {
    let _rgba = '';
    const { r, g, b, a } = rgba;
    _rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
    const _rgb = `rgb(${r}, ${g}, ${b})`;
    return opacity ? _rgba : _rgb;
  }

  function formatStringToRgba(val: string): RGBColor {
    const rgba = {
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    };

    const arr = val.split(',');
    const _r = Number(arr[0].split('(')[1]) || 0;
    rgba.r = _r >= 0 ? _r : 255;
    rgba.g = Number(arr[1]) >= 0 ? Number(arr[1]) : 255;
    if (opacity) {
      rgba.b = Number(arr[2]) >= 0 ? Number(arr[1]) : 255;
    } else {
      const _b = Number(arr[2].split(')')[0]);
      rgba.b = _b >= 0 ? _b : 255;
    }

    if (opacity) {
      const _a = Number(arr[3].split(')')[0]) || 1;
      rgba.a = _a >= 0 ? _a : 1;
    }
    return rgba;
  }

  console.log('currColor', currColor);

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

function stringRgbToHex(val: string): string {
  let color = '#ffffff';
  if (!val) return color;
  const arr = val.split(',');
  const r = parseInt(arr[0].split('(')[1]);
  const g = parseInt(arr[1]);
  const b = parseInt(arr[2].split(')')[0]);

  color = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  return color;
}

ColorPicker.stringRgbToHex = stringRgbToHex;

export default ColorPicker;
