import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
const image = new Image();

function Background() {
  const backgroundRef = useRef(null);
  const [on, setOn] = useState(false);
  const [viewPosOffset, setViewPosOffset] = useState({ x: 0, y: 0 });
  const [startViewPosOffset, setStartViewPosOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const draw = () => {
    const canvas = backgroundRef.current;
    const ctx = canvas.getContext('2d');
    image.src = 'https://anatomykorea.com/web/product/big/202202/79f42c6988ee4c7d1f2371776b11cf24.jpg';
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };

  const getPos = (e) => {
    const canvas = backgroundRef.current;
    const { left, top } = canvas.getBoundingClientRect();
    const { clientX, clientY } = e;
    return {
      x: clientX - left - viewPosOffset.x,
      y: clientY - top - viewPosOffset.y,
    };
  };

  useEffect(() => {
    draw();
  }, []);

  useLayoutEffect(() => {
    const canvas = backgroundRef.current;
    const ctx = canvas.getContext('2d');
    const scaleOffsetX = (canvas.width * scale - canvas.width) / 2;
    const scaleOffsetY = (canvas.height * scale - canvas.height) / 2;

    ctx.reset();
    ctx.setTransform(scale, 0, 0, scale, viewPosOffset.x * scale - scaleOffsetX, viewPosOffset.y * scale - scaleOffsetY);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [viewPosOffset, scale]);

  const handleMouseDown = (e) => {
    setOn(true);
    const { x, y } = getPos(e);
    setStartViewPosOffset({
      x,
      y,
    });
  };

  const handleMouseUp = () => {
    setOn(false);
  };

  const hanldeMouseMove = (e) => {
    if (!on) return;

    e.preventDefault();
    const { x, y } = getPos(e);
    const deltaX = x - startViewPosOffset.x;
    const deltaY = y - startViewPosOffset.y;
    setViewPosOffset((prevState) => ({
      x: prevState.x + deltaX,
      y: prevState.y + deltaY,
    }));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    // e.nativeEvent.preventDefault();
    const { deltaY } = e;
    const newScale = deltaY > 0 ? scale * 1.2 : scale / 1.2;

    // setScale(Math.max(Math.min(newScale, 0.1), 3));
    setScale(newScale);
    // const xs = (offsetX - viewPosRef.current.x) / scaleRef.current;
    // const ys = (offsetY - viewPosRef.current.y) / scaleRef.current;
    // const delta = -e.deltaY;
    // if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
    //   scaleRef.current = newScale;
    //   viewPosRef.current = {
    //     x: offsetX - xs * scaleRef.current,
    //     y: offsetY - ys * scaleRef.current,
    //   };
    // }
    // draw();
  };

  return (
    <canvas
      ref={backgroundRef}
      style={{ backgroundColor: 'gray' }}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={hanldeMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}
export default Background;
