type StyleKey = 'value' | 'unit';

export function parseStyleString(value: string | number): Record<StyleKey, string> {
  const _value = {
    value: '',
    unit: 'px',
  };

  if (value === 0 || !value || !(['string', 'number'].includes(typeof(value)))) return _value;

  if (typeof(value) === 'number') {
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
