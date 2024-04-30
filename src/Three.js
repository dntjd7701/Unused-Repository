import React, { useEffect, useRef, useState } from 'react';

const Three = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scale, setScale] = useState(0.6);
  // let startX, startY;
  const imageContainerRef = useRef(null);

  useEffect(() => {}, [imgIndex]);
  /** 줌 휠 */
  const handleWheel = (event) => {
    event.preventDefault();
    const zoomSpeed = 0.1; // 조절 가능한 확대/축소 속도
    // 마우스 휠 방향에 따라 확대 또는 축소
    const newScale = event.deltaY > 0 ? scale - zoomSpeed : scale + zoomSpeed;
    // 최소 및 최대 확대/축소 비율 지정
    const minScale = 0.1;
    const maxScale = 3;
    // 새로운 확대/축소 비율이 최소 및 최대 비율을 벗어나지 않도록 함
    const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);
    // 확대/축소 비율 적용
    setScale(clampedScale);
  };

  return (
    <div
      className='view_box'
      onWheel={handleWheel}
      onMouseDown={(event) => {
        setStartX(event.clientX);
        setIsDragging(true);
      }}
      onMouseMove={(event) => {
        if (!isDragging) return;
        setImgIndex((prevState) => {
          const left = prevState - 1 < 0 ? 35 : prevState - 1;
          const right = prevState + 1 > 35 ? 0 : prevState + 1;
          return startX - event.clientX > 0 ? right : left;
        });
      }}
      onMouseUp={() => {
        setIsDragging(false);
      }}>
      <div className='img_area'>
        <div
          className='img_wrap animated slideInRight _3d_image'
          ref={imageContainerRef}>
          {Array.from({ length: 36 }).map((_, idx) => {
            return (
              <img
                key={idx}
                src={`/car/car-${idx}.png`}
                alt=''
                style={{ display: imgIndex === idx ? 'inline-block' : 'none', transform: `scale(${scale})` }}
              />
            );
          })}

          {/* {getImg()}
          <img
            src={`/car/car-${0}.png`}
            alt=''
            style={{ display: 'inline-block' }}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Three;
