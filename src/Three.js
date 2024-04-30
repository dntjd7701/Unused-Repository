import React, { useEffect, useRef, useState } from 'react';

const Three = () => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  // let startX, startY;
  const imageContainerRef = useRef(null);

  useEffect(() => {}, [imgIndex]);

  return (
    <div
      className='view_box'
      onMouseDown={(event) => {
        setStartX(event.clientX);
        setIsDragging(true);
      }}
      onMouseMove={(event) => {
        if (!isDragging) return;
        setImgIndex((prevState) => {
          const left = prevState - 1 < 0 ? 35 : prevState - 1;
          const right = prevState + 1 > 35 ? 0 : prevState + 1;
          return startX < event.clientX ? right : left;
        });
      }}
      onMouseUp={() => {
        setIsDragging(false);
      }}>
      <button
        onClick={() => {
          setImgIndex((prevState) => {
            return prevState - 1 < 0 ? 35 : prevState - 1;
          });
        }}>
        {'<'}
      </button>
      <button
        onClick={() => {
          setImgIndex((prevState) => {
            return prevState + 1 > 35 ? 0 : prevState + 1;
          });
        }}>
        {'>'}
      </button>
      <div className='img_area'>
        <div
          className='img_wrap animated slideInRight _3d_image'
          ref={imageContainerRef}>
          {Array.from({ length: 36 }).map((_, idx) => {
            return (
              <img
                key={idx}
                // width={'500px'}
                height={'300px'}
                src={`/car/car-${idx}.png`}
                alt=''
                style={{ display: imgIndex === idx ? 'inline-block' : 'none' }}
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
