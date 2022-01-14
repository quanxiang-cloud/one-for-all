import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface GridProps {
  colRatio: string; // 列比例
  colGap: string; // 列间距
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  'data-node-key'?: string;
}

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
  type?: string;
  className?: string;
}
