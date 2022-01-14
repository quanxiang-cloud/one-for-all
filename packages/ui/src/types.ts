import { DetailedHTMLProps, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export interface GridProps {
  colRatio: string; // 列比例
  colGap: string; // 列间距
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  // todo: remove
  'data-node-key'?: string;
}

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
  type?: string;
  className?: string;
}

export interface TextareaProps extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  cols?: number;
  rows?: number;
  minLength?: number;
  maxLength?: number;
}
