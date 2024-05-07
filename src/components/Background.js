import React, { useEffect, useRef } from 'react';

const Background = () => {
  const img = new Image();
  const backgroundRef = useRef(null);
  const scaleRef = useRef(1);
  const viewPosRef = useRef({ x: 0, y: 0 });

  const setTransform = () => {
    const zoomCanvas = backgroundRef.current;
    const context = zoomCanvas.getContext('2d');
    console.debug('viewPosRef:', viewPosRef);
    console.debug('scaleRef:', scaleRef);

    context.setTransform(scaleRef.current, 0, 0, scaleRef.current, viewPosRef.current.x, viewPosRef.current.y);
  };

  const draw = () => {
    const zoomCanvas = backgroundRef.current;
    const context = zoomCanvas.getContext('2d');
    // zoomCanvas.width = zoomCanvas.width;
    context.reset();
    setTransform();
    // context.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
    context.drawImage(img, 0, 0, zoomCanvas.width, zoomCanvas.height);
  };

  useEffect(() => {
    img.src = 'https://anatomykorea.com/web/product/big/202202/79f42c6988ee4c7d1f2371776b11cf24.jpg';
    // Load image
    img.onload = function () {
      draw();
    };
  }, []);

  const handleWheel = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    e.preventDefault();
    const xs = (offsetX - viewPosRef.current.x) / scaleRef.current;
    const ys = (offsetY - viewPosRef.current.y) / scaleRef.current;
    const delta = -e.deltaY;
    const newScale = delta > 0 ? scaleRef.current * 1.2 : scaleRef.current / 1.2;

    if (newScale >= 0.1 && newScale <= 10) {
      scaleRef.current = newScale;
      viewPosRef.current = {
        x: offsetX - xs * scaleRef.current,
        y: offsetY - ys * scaleRef.current,
      };
    }
    draw();
  };

  return (
    <>
      <div
        className='canvas-container'
        onWheel={handleWheel}>
        <canvas
          className={`canvas_background`}
          ref={backgroundRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onWheel={handleWheel}
          //   onMouseMove={hanldeMouseMove}
          //   onMouseDown={handleMouseDown}
          //   onMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
};

export default Background;
