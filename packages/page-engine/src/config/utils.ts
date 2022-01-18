type StyleKey = 'value' | 'unit';

export const STYLE_NUMBER = [
  'width', 'height', 'fontSize', 'lineHeight', 'borderWidth', 'fontWeight',
  'marginTop', 'marginLeft', 'marginRight', 'marginBottom', 'borderTopWidth', 'borderLeftWidth',
  'borderRightWidth', 'borderBottomWidth', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom',
  'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius',
  'zIndex',
];

const NEW_STYLES = [
  'width', 'height', 'fontSize', 'lineHeight', 'top', 'left', 'right', 'bottom',
];

// 拿到样式格式化为表单所需要的格式
export function parseStyleToForm(styles: Record<string, string | number>): Record<string, string | number> {
  const newStyles: Record<string, string | number> = {};

  if (typeof (styles) !== 'object' || styles === null) {
    return newStyles;
  }

  Object.entries(styles).forEach((style) => {
    const [key, value] = style;

    if (key === 'backgroundImage') {
      newStyles[key] = handleImageUrl(value as string);
      return;
    }

    if (NEW_STYLES.includes(key)) {
      const _value = parseStyleString(value as (string | number));
      newStyles[key] = _value.value;
      newStyles[`${key}Unit`] = _value.unit;
      return;
    }

    newStyles[key] = value;
  });

  return newStyles;
}

// 将表单格式的样式格式化为css所接受样式，并移除 为空，为 0的值
export const formatStyles = (styles: Record<string, string | number>): Record<string, string | number> => {
  const newStyles: Record<string, string | number> = {};
  if (typeof (styles) !== 'object' || styles === null) {
    return newStyles;
  }

  Object.entries(styles).forEach((style) => {
    const [key, value] = style;

    if (value === '' || value === 0) return;

    if (key.indexOf('Unit') >= 0) return;

    if (key === 'backgroundImage') {
      if (value === 'none') return;

      newStyles[key] = `url(${value})`;
      return;
    }

    if (NEW_STYLES.includes(key)) {
      const _value = formatStyleString(value, (styles[`${key}Unit`] as string) || 'px');
      newStyles[key] = _value;
      return;
    }

    if (STYLE_NUMBER.includes(key)) {
      newStyles[key] = Number(value) || 0;
      return;
    }
    newStyles[key] = value;
  });

  return newStyles;
};

// 根据值解析得出 值以及单位
export function parseStyleString(value: string | number): Record<StyleKey, string> {
  const _value = {
    value: '',
    unit: 'px',
  };

  if (value === 0 || !value || !(['string', 'number'].includes(typeof (value)))) return _value;

  if (typeof (value) === 'number') {
    _value.value = value.toString();
    _value.unit = 'px';
    return _value;
  }
  // auto
  if (value === 'auto') {
    _value.value = 'auto';
    _value.unit = 'auto';
    return _value;
  }
  // px
  if (value.indexOf('px') >= 0) {
    const _site = value.indexOf('px');
    _value.value = value.substring(0, _site);
    return _value;
  }
  // %
  if (value.indexOf('%') >= 0) {
    const _site = value.indexOf('%');
    _value.value = value.substring(0, _site);
    _value.unit = '%';
    return _value;
  }

  return _value;
}

export function formatStyleString(value: string | number, unitValue = 'px'): string {
  const newValue = '';

  if (value === 0 || !value) return '0' + unitValue;

  if (value === 'auto') {
    return 'auto';
  }

  if (unitValue === 'px' || unitValue === '%') {
    return value.toString() + unitValue;
  }

  return newValue;
}

// todo: 单独处理边框样式
// function handleBorderStyle(): Record<string, string | number> {
//   const newStyles = {};
//   return newStyles;
// }

function handleImageUrl(url: string): string {
  let _url = '';

  if (url.indexOf('url') === 0) {
    _url = url.substring(4, url.length - 1);
  }

  if (url === 'none') {
    return _url;
  }

  return _url;
}
