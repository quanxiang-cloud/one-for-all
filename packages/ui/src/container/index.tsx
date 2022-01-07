import React from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Container(
  { style, children, ...rest }: Props,
  ref: React.LegacyRef<HTMLDivElement>,
): JSX.Element {
  const pathname = window.location.pathname;
  const isSee = pathname.indexOf('/page-preview') >= 0;
  return (
    <div
      {...rest}
      style={style}
      ref={ref}
    >
      {children || (
        !isSee && (
          <div
            style={{ minHeight: 60 }}
            className="w-full h-full bg-gray-100 border border-dashed flex items-center justify-center"
          >
          拖拽组件或模板到这里
          </div>
        ))}
    </div>
  );
}

export default React.forwardRef(Container);
