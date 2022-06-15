import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DatePicker from '../shared/date-picker';

function consoleDate(date: Date): void {
  console.log(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
}

const datePickerMeta: ComponentMeta<typeof DatePicker> = {
  title: 'headless-ui/DatePicker',
  component: DatePicker,
  argTypes: {
    defaultValue: {
      control: { type: 'date' },
      description: '默认日期',
      table: {
        type: { summary: 'string | Date' },
      },
    },
    value: {
      control: { type: 'date' },
      description: '日期',
      table: {
        type: { summary: 'string | Date' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用',
      table: {
        type: { summary: 'boolean' },
        defaultValue: {
          summary: false,
        },
      },
    },
    popupClassName: {
      control: { type: 'text' },
      description: '弹出框的classname',
      table: {
        type: { summary: 'string' },
      },
    },
    popupStyle: {
      control: { type: 'object' },
      description: '弹出框的style',
      table: {
        type: { summary: 'object' },
      },
    },
    placeholder: {
      defaultValue: '请输入日期',
      control: { type: 'text' },
      description: '没有值时的提示文案',
      table: {
        type: { summary: 'string' },
        defaultValue: {
          summary: '请输入日期',
        },
      },
    },
    inputReadOnly: {
      control: { type: 'boolean' },
      description: '是否只读（当有format时为true）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: {
          summary: false,
        },
      },
    },
    hiddenPresent: {
      control: { type: 'boolean' },
      description: '是否隐藏当前时间按钮',
      table: {
        type: { summary: 'boolean' },
        defaultValue: {
          summary: false,
        },
      },
    },
    timeAccuracy: {
      control: { type: 'inline-radio' },
      options: ['hour', 'minute', 'second'],
      description: '时间的精确度(仅当mode为date和time时生效)',
      table: {
        type: { summary: 'hour|minute|second' },
        defaultValue: {
          summary: 'second',
        },
      },
    },
    placement: {
      control: { type: 'select' },
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      defaultValue: 'bottom-start',
      description: '弹出框显示的位置',
      table: {
        type: { summary: `bottom-start | bottom-end | top-start | top-end` },
        defaultValue: { summary: 'bottom-start' },
      },
    },
    mode: {
      control: { type: 'select' },
      options: ['time', 'date', 'month', 'quarter', 'year'],
      defaultValue: 'date',
      description: '选择日期的范围',
      table: {
        type: { summary: 'time|date|month|quarter|year' },
        defaultValue: { summary: 'date' },
      },
    },
    nextIcon: {
      control: { type: 'object' },
      description: '下一个月的图标',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: '>' },
      },
    },
    prevIcon: {
      control: { type: 'object' },
      description: '上一个月的图标',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: '<' },
      },
    },
    superNextIcon: {
      control: { type: 'object' },
      description: '下一年的图标',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    superPrevIcon: {
      control: { type: 'object' },
      description: '上一年的图标',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    suffixIcon: {
      control: { type: 'object' },
      description: '输入框后缀图标',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    format: {
      control: { type: 'text' },
      description: '格式话日期',
      table: {
        type: { summary: '((date: Date) => string) | string' },
        defaultValue: {
          summary: 'YYYY-MM-DD HH:mm:ss',
        },
      },
    },
    disabledDate: {
      control: { type: 'function' },
      action: 'disabledDate',
      table: {
        category: 'Events',
        type: { summary: '(date: Date) => boolean' },
      },
      description: '禁止日期的回调',
    },
    disabledTime: {
      control: { type: 'function' },
      action: 'disabledTime',
      table: {
        category: 'Events',
        type: { summary: '(type: "hour" | "minute" | "second", time: number) => boolean' },
      },
      description: '禁止时间的回调',
    },
    onOpenChange: {
      action: 'onOpenChange',
      table: {
        category: 'Events',
        type: { summary: '(open: boolean) => void' },
      },
      description: '弹出框显示隐藏时的回调',
    },
    onChange: {
      action: 'onChange',
      table: {
        category: 'Events',
        type: { summary: '(date: Date | undefined) => void' },
      },
      description: '值发生改变时的回调',
    },
  },
};

export default datePickerMeta;

const Template: ComponentStory<typeof DatePicker> = (args) => <DatePicker {...args} />;

export const Normal = Template.bind({});
Normal.args = {
  defaultValue: '2019-10-02',
  hiddenPresent: true,
  onOpenChange(open) {
    console.log(open);
  },
  onChange(date) {
    if (!date) return;
    consoleDate(date);
  },
  disabledDate(date) {
    return date.getFullYear() === 2022;
    // return date.getMonth() === 4;
    // return [2,5,6,8,10].includes(date.getDate());
  }
}

export const Date = Template.bind({});
Date.args = {
  defaultValue: '2019-10-02',
  mode: 'date',
}

export const DateTime = Template.bind({});
DateTime.args = {
  defaultValue: '2019-10-02 09:12:21',
  mode: 'date',
  timeAccuracy: 'second',
  disabledTime(type, time) {
    if (type === 'hour') return [3,5,7].includes(time);
    return false;
  }
}

export const Month = Template.bind({});
Month.args = {
  defaultValue: '2019-10',
  mode: 'month',
}

export const Quarter = Template.bind({});
Quarter.args = {
  defaultValue: '2019-Q1',
  mode: 'quarter',
  disabledDate(date) {
    // consoleDate(date);
    return date.getMonth() === 3;
  }
}

export const Year = Template.bind({});
Year.args = {
  defaultValue: '2019',
  mode: 'year',
}

export const Time = Template.bind({});
Time.args = {
  defaultValue: '10:09:10',
  mode: 'time',
  disabledTime(type, time) {
    if (type === 'hour') return [3,5,7].includes(time);
    return false;
  }
}

export const formatCustom = Template.bind({});
formatCustom.args = {
  timeAccuracy: 'minute',
  format: 'YY/MM-DD HH:mm',
  // format: (date: Date) => `custom: ${date.getFullYear()}-----${date.getMonth()}`
}

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  suffixIcon: <span>c</span>,
  nextIcon: <span style={{ margin: '0 5px' }}>&gt;</span>,
  prevIcon: <span style={{ margin: '0 5px' }}>&lt;</span>,
  superNextIcon: <span>&gt;&gt;</span>,
  superPrevIcon: <span>&lt;&lt;</span>
}

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
}
