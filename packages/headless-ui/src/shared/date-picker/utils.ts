import dayjs, { Dayjs } from "dayjs";
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear);

export type DateType = {
  value: number;
  relativeMonth: -1 | 0 | 1;
  disabled?: boolean;
  checked?: boolean;
  isToDay?: boolean;
};

export type QuarterType = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type PickScope = '' | 'time' | 'date' | 'month' | 'quarter' | 'year' | 'century';

export const defaultFormatMap: {[key in DatePickerModeType]: string} = {
  'time': 'HH:mm:ss',
  'date': 'YYYY-MM-DD',
  'month': 'YYYY-MM',
  'quarter': 'YYYY-Q',
  'year': 'YYYY',
};

export function isLegalDate(dateStr: string, mode: DatePickerModeType): boolean {
  return dayjs(transformDate(dateStr, mode)).isValid();
};

export function transformDate(dateStr: string, mode: DatePickerModeType): string {
  let transformDate = dateStr;
  const matchStr = dateStr.match(/Q\d/)?.[0];
  if (matchStr) {
    transformDate = transformDate.replace(matchStr, '' + (getStartMonthOfQuarter(matchStr as QuarterType)) + 1);
  }
  if (mode === 'time') {
    transformDate = dayjs().format('YYYY-MM-DD') + ' ' + transformDate;
  }
  return transformDate;
}

export function getDatesOfMonth(date: Dayjs, disabledDate?: (date: Date) => boolean): DateType[] {
  const startDate = date.startOf('month').date();
  const endDate = date.endOf('month').date();
  const beforeMonthLastDate = date.subtract(1, 'month').endOf('month').date();

  const startDay = date.startOf('month').day();
  const endDay = date.endOf('month').day();
  
  const dates: DateType[] = [];
  for (let i = startDay; i > 0; i--) {
    dates.push({
      value: beforeMonthLastDate - i + 1,
      relativeMonth: -1,
      disabled: disabledDate?.(date.subtract(1, 'month').set('date', beforeMonthLastDate - i + 1).toDate()),
    });
  }
  
  for (let i = startDate; i <= endDate; i++) {
    dates.push({
      value: i,
      relativeMonth: 0,
      disabled: disabledDate?.(date.clone().set('date', i).toDate()),
    });
  }

  for (let i = endDay; i < 6; i++) {
    dates.push({
      value: i - endDay + 1,
      relativeMonth: 1,
      disabled: disabledDate?.(date.add(1, 'month').set('date', i - endDay + 1).toDate()),
    });
  }
  return dates;
}

export function getStartYear(date: Dayjs, type: 'ten_years' | 'century'): number {
  const curYear = date.get('year');
  if (type === 'ten_years') return curYear - curYear % 10;
  return curYear - curYear % 100;
}

export function getQuarterByMonth(month: number): QuarterType {
  return `Q${dayjs().month(month).quarter()}` as QuarterType;
}

export function getStartMonthOfQuarter(quarter: QuarterType): number {
  return dayjs().quarter(Number(quarter.replace('Q', ''))).startOf('quarter').month();
}

export function getDate(mode: PickScope, timeAccuracy: DatePickerTimeAccuracyType | undefined): Dayjs {
  if (timeAccuracy) return dayjs().startOf(timeAccuracy);
  if (mode === '') return dayjs().startOf('date');
  if (mode === 'time') return dayjs().startOf('second');
  if (mode === 'century') return dayjs().startOf('year');
  return dayjs().startOf(mode);
}

export function scrollTo(dom: HTMLElement, location: number, delay?: number): void {
  if (!window.requestAnimationFrame) {
    dom.scrollTop = location;
    return;
  }

  const times = Math.ceil((delay || 600) / 60);
  const speed = (location - dom.scrollTop) / times;
  function scrollByTimes(dom: HTMLElement, location: number, speed: number, times: number): void {
    if (times <= 0) {
      dom.scrollTop = location;
      return;
    }
    dom.scrollTop += speed;
    requestAnimationFrame(() => scrollByTimes(dom, location, speed, times - 1));
  }
  requestAnimationFrame(() => scrollByTimes(dom, location, speed, times));
}
