import React, { useEffect, useState } from "react";
import cs from "classnames";

import "./index.scss";

function SwiperImage({
  images = [],
  defaultIndex = 0,
  autoplay = true,
  autoplaySpeed = 3000,
  showDots = true,
  onChange,
  className,
  style,
}: SwiperImageProps) {
  const imgLen = images.length;
  const [current, setCurrent] = useState(defaultIndex > imgLen - 1 ? 0 : defaultIndex);
  const [timer, setTimer] = useState<NodeJS.Timer>();

  useEffect(() => {
    if (imgLen > 1 && autoplay) {
      setNext();
    }

    return () => timer && clearInterval(timer);
  }, []);

  function setNext() {
    const nextInterval = setInterval(() => {
      setCurrent((val) => {
        let nextStep = val + 1;
        if (nextStep === imgLen) {
          nextStep = 0;
        }
        onChange?.(nextStep);
        return nextStep;
      });
    }, autoplaySpeed);
    setTimer(nextInterval);
  }

  return (
    <div
      style={style}
      className={cs("ofa-swiper-image-wrapper", className)}
      onMouseEnter={() => timer && clearInterval(timer)}
      onMouseLeave={() => setNext()}
    >
      {images.map((url, index) => {
        return (
          <div
            key={index}
            className={cs("ofa-swiper-image-slide", {
              "ofa-swiper-image-active": current === index,
            })}
            style={{ backgroundImage: `url(${url})` }}
          ></div>
        );
      })}
      {showDots && (
        <ul className="ofa-swiper-image-dots">
          {images.map((_, index) => {
            return (
              <li
                key={index}
                className={cs("ofa-swiper-image-dot", {
                  "ofa-swiper-image-dot-active": current === index,
                })}
                onClick={() => {
                  onChange?.(index);
                  setCurrent(index);
                }}
              ></li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SwiperImage;
