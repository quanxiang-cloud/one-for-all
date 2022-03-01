import React, { ForwardedRef, forwardRef } from 'react';
import cs from 'classnames';

type BreadcrumbChildProps = {
  segment: Segment;
  isLast: boolean;
}

function Breadcrumb(props: BreadcrumbProps, ref?: ForwardedRef<HTMLDivElement>): JSX.Element {
  const {
    segments,
    separator = '/',
    activeClass, 
    segmentRender,
    style,
    className,
    segmentClass,
    segmentStyle,
  } = props;

  function BreadcrumbChild({segment, isLast}: BreadcrumbChildProps):  JSX.Element {
    if (segmentRender) {
      return (
        <>
          {segmentRender(segment, isLast)}
          {!isLast && <span className="ofa-breadcrumb-separator">{separator}</span>}
        </>
      )
    } 

    if(!isLast) {
      return (
        <>
          {segment.render ? segment.render(segment) : breadItem(segment)}
          <span className="ofa-breadcrumb-separator">{separator}</span>
        </>
      )
    }

    return (
      <span className='ofa-breadcrumb-link'>{segment.text}</span>
    )
  }

  const breadItem = (link: Segment): JSX.Element | string => {
    return !link.path ? link.text : (
      <a href={link.path} className='ofa-breadcrumb-link'>
        {link.text}
      </a>
    );
  };

  return (
    <div className={cs('ofa-breadcrumb', className)} style={style} ref={ref}>
       {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          return (
            <div
              key={segment.key}
              style={segmentStyle}
              className={cs('ofa-breadcrumb-item', segmentClass, {
                activeClass: isLast
              })}
            >
              <BreadcrumbChild segment={segment} isLast={isLast}/>
            </div>
          );
        })}
    </div>
  );
}

export default forwardRef(Breadcrumb);
