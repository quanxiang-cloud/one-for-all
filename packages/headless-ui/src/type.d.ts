import { MutableRefObject } from 'react';

export interface GridProps {
  colRatio: string; // 列比例
  colGap: string; // 列间距
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface InputProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
  type?: string;
}

export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

export type TargetElement = HTMLElement | Element | Document | Window;

type ScrollElement = Element | Window;
