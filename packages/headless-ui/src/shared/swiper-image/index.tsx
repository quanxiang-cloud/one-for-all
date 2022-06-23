import React, { useEffect, useState, ForwardedRef } from 'react';
import cs from 'classnames';

import useNext from './hooks';

import './index.scss';

function SwiperImage(
  {
    images = [],
    defaultIndex = 0,
    disableAutoplay = false,
    fillMode = 'cover',
    autoplaySpeed = 3000,
    hideDots = false,
    onChange,
    className,
    style,
  }: SwiperImageProps,
  ref?: ForwardedRef<HTMLDivElement>,
) {
  const { newImages, current, setCurrent, setNext, clearTimer } = useNext(
    images,
    defaultIndex,
    disableAutoplay,
    autoplaySpeed,
    onChange,
  );
  const [dots, setDots] = useState(hideDots);

  useEffect(() => {
    setDots(hideDots);
  }, [hideDots]);

  return (
    <div
      style={style}
      ref={ref}
      className={cs('ofa-swiper-image-wrapper', className)}
      onMouseEnter={() => clearTimer()}
      onMouseLeave={() => !disableAutoplay && setNext()}
    >
      {newImages.map((imgUrl) => {
        return (
          <div
            key={imgUrl}
            style={{ backgroundImage: `url(${imgUrl})`, backgroundSize: `${fillMode}` }}
            className={cs('ofa-swiper-image-slide', {
              'ofa-swiper-image-active': newImages[current] === imgUrl,
            })}
          ></div>
        );
      })}
      {!dots && (
        <ul className='ofa-swiper-image-dots'>
          {newImages.map((imgUrl, index) => {
            return (
              <li
                key={imgUrl}
                className={cs('ofa-swiper-image-dot', {
                  'ofa-swiper-image-dot-active': newImages[current] === imgUrl,
                })}
                onClick={() => {
                  onChange?.(index);
                  setCurrent(index);
                }}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default React.forwardRef<HTMLDivElement, SwiperImageProps>(SwiperImage);
