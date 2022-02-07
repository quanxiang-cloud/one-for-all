import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldValues, UseFormSetValue } from 'react-hook-form';

import { RadioButtonGroup, Icon, Tooltip } from '@one-for-all/ui';

type LabelValue = {
  label: string;
  value: string;
}

const FILL_LIST: LabelValue[] = [
  { value: 'block', label: '块级' },
  { value: 'inline', label: '行内' },
  { value: 'inline-block', label: '行内块' },
  { value: 'flex', label: '弹' },
];

const DIRECTION_LIST: Record<string, string | JSX.Element>[] = [
  { value: 'row', label: (<Tooltip position='top' label='Direction:row'>
    <Icon name="direction_row" color='gray' /></Tooltip>) },
  { value: 'column', label: (<Tooltip position='top' label='Direction:column'>
    <Icon name="direction_column" color='gray' /></Tooltip>) },
  { value: 'row-reverse', label: (<Tooltip position='top' label='Direction:row-reverse'>
    <Icon name="direction_row-reverse" color='gray' /></Tooltip>) },
  { value: 'column-reverse', label: (<Tooltip position='top' label='Direction:column-reverse'>
    <Icon name="direction_column-reverse" color='gray' /></Tooltip>) },
];

const WRAP_LIST: Record<string, string | JSX.Element>[] = [
  { value: 'nowrap', label: (<Tooltip position='top' label='Wrap:nowrap'>
    <Icon name="direction_row" color='gray' /></Tooltip>) },
  { value: 'wrap', label: (<Tooltip position='top' label='Wrap:wrap'>
    <Icon name="direction_column" color='gray' /></Tooltip>) },
  { value: 'wrap-reverse', label: (<Tooltip position='top' label='Wrap:wrap-reverse'>
    <Icon name="direction_row-reverse" color='gray' /></Tooltip>) },
  { value: 'initial', label: (<Tooltip position='top' label='Wrap:initial'>
    <Icon name="direction_column-reverse" color='gray' /></Tooltip>) },
  { value: 'inherit', label: (<Tooltip position='top' label='Wrap:inherit'>
    <Icon name="direction_column-reverse" color='gray' /></Tooltip>) },
];

const DISPLAY_ICONS: Record<string, string[]> = {
  row: ['row_align_flex-start', 'row_align_center', 'row_align_flex-end',
    'row_align_stretch', 'row_align_baseline', 'row_justify_flex-start', 'row_justify_center',
    'row_justify_flex-end', 'row_justify_stretch', 'row_justify_baseline'],
  column: ['col_align_flex-start', 'col_align_center', 'col_align_flex-end',
    'col_align_stretch', 'col_align_baseline', 'col_justify_flex-start', 'col_justify_center',
    'col_justify_flex-end', 'col_justify_stretch', 'col_justify_baseline'],
  'row-reverse': ['row-re_align_flex-start', 'row-re_align_center', 'row-re_align_flex-end',
    'row-re_align_stretch', 'row-re_align_baseline', 'row-re_justify_flex-start', 'row-re_justify_center',
    'row-re_justify_flex-end', 'row-re_justify_stretch', 'row-re_justify_baseline'],
  'column-reverse': ['col-re_align_flex-start', 'col-re_align_center', 'col-re_align_flex-end',
    'col-re_align_stretch', 'col-re_align_baseline', 'col-re_justify_flex-start', 'col-re_justify_center',
    'col-re_justify_flex-end', 'col-re_justify_stretch', 'col-re_justify_baseline'],
};

interface Props {
  register: UseFormRegister<FieldValues>;
  initValues: Record<string, string | number>;
  setValue: UseFormSetValue<FieldValues>;
}

function DisplayConfig({ initValues, register, setValue }: Props): JSX.Element {
  const { display, flexDirection, alignItems, justifyContent } = initValues;
  const [flexValue, setFlexValue] = useState({
    display: 'block',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: '',
    justifyContent: '',
  });

  useEffect(() => {
    setFlexValue({
      ...flexValue,
      display: display as string || 'block',
      flexDirection: (flexDirection as string) || 'row',
      alignItems: (alignItems as string) || '',
      justifyContent: (justifyContent as string) || '',
    });
  }, [display, flexDirection, alignItems, justifyContent]);

  function handleFlexChange(value: string | number | boolean, key: 'display' | 'flexDirection' |
   'alignItems' | 'justifyContent' | 'flexWrap'): void {
    const _value = value as string;
    if (flexValue[key] === _value) return;
    if (key === 'display' && value !== 'flex') {
      setValue('flexDirection', '');
      setValue('alignItems', '');
      setValue('justifyContent', '');
      setValue('flexWrap', 'nowrap');
    }
    setValue(key, _value);
    setFlexValue({
      ...flexValue,
      [key]: _value,
    });
  }

  let ALIGN_LIST: Record<string, string | JSX.Element>[] = [];
  let JUSTIFY_LIST: Record<string, string | JSX.Element>[] = [];

  if (flexValue.display === 'flex') {
    ALIGN_LIST = [
      { value: 'flex-start', label: (<Tooltip position='top' label="Align:flex-start">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][0]} color='gray' /></Tooltip>) },
      { value: 'center', label: (<Tooltip position='top' label="Align:center">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][1]} color='gray' /></Tooltip>) },
      { value: 'flex-end', label: (<Tooltip position='top' label="Align:flex-end">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][2]} color='gray' /></Tooltip>) },
      { value: 'stretch', label: (<Tooltip position='top' label="Align:stretch">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][3]} color='gray' /></Tooltip>) },
      { value: 'baseline', label: (<Tooltip position='top' label="Align:baseline">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][4]} color='gray' /></Tooltip>) },
    ];

    JUSTIFY_LIST = [
      { value: 'flex-start', label: (<Tooltip position='top' label="Justify:flex-start">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][5]} color='gray' /></Tooltip>) },
      { value: 'center', label: (<Tooltip position='top' label="Justify:center">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][6]} color='gray' /></Tooltip>) },
      { value: 'flex-end', label: (<Tooltip position='top' label="Justify:flex-end">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][7]} color='gray' /></Tooltip>) },
      { value: 'space-between', label: (<Tooltip position='top' label="Justify:space-between">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][8]} color='gray' /></Tooltip>) },
      { value: 'space-around', label: (<Tooltip position='top' label="Justify:space-around">
        <Icon name={DISPLAY_ICONS[flexValue['flexDirection']][9]} color='gray' /></Tooltip>) },
    ];
  }

  return (
    <div>
      <input type="hidden" {...register('display', { value: display || 'block' })} />
      <input type="hidden" {...register('flexDirection', { value: flexDirection || '' })} />
      <input type="hidden" {...register('alignItems', { value: alignItems || '' })} />
      <input type="hidden" {...register('justifyContent', { value: justifyContent || '' })} />
      <div className='text-12 text-gray-600'>填充类型</div>
      <RadioButtonGroup
        listData={FILL_LIST as []}
        onChange={(val) => handleFlexChange(val, 'display')}
        currentValue={flexValue.display}
      />
      { flexValue.display === 'flex' && (
        <>
          <div className='mt-8 text-12 text-gray-600'>弹性布局</div>
          <div>
            <RadioButtonGroup
              className='w-full'
              listData={DIRECTION_LIST as []}
              onChange={(val) => handleFlexChange(val, 'flexDirection')}
              currentValue={flexValue['flexDirection']}
            />
          </div>
          <div className='mt-4'>
            <RadioButtonGroup
              className='w-full'
              listData={WRAP_LIST as []}
              onChange={(val) => handleFlexChange(val, 'flexWrap')}
              currentValue={flexValue['flexWrap']}
            />
          </div>
          <div className='mt-4'>
            <RadioButtonGroup
              listData={ALIGN_LIST as []}
              onChange={(val) => handleFlexChange(val, 'alignItems')}
              currentValue={flexValue['alignItems']}
            />
          </div>
          <div className='mt-4'>
            <RadioButtonGroup
              listData={JUSTIFY_LIST as []}
              onChange={(val) => handleFlexChange(val, 'justifyContent')}
              currentValue={flexValue['justifyContent']}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default DisplayConfig;
