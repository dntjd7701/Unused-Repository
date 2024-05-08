import React, { useRef, useEffect, useState } from 'react';

function Test() {
  const zoomCanvasRef = useRef(null);
  const [viewPos, setViewPos] = useState({ x: 100, y: 100 });

  const draw = (x1, y1, x2, y2) => {
    const canvas = zoomCanvasRef.current;
    const context = canvas.getContext('2d');

    context.beginPath();
    context.rect(x1, y1, x2, y2);
    context.stroke();
  };

  const getContext = () => {
    const canvas = zoomCanvasRef.current;
    return canvas.getContext('2d');
  };

  useEffect(() => {
    const ctx = getContext();
    draw(100, 200, 100, 100);
    ctx.setTransform(1, 0, 0, 1, viewPos.x, viewPos.y);
    draw(200, 300, 100, 100);
  }, []);

  return (
    <canvas
      ref={zoomCanvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ border: ' 1px solid' }}
      onClick={(e) => {
        const { clientX, clientY } = e;
        const ctx = getContext();
        const { left, top } = zoomCanvasRef.current.getBoundingClientRect();
        console.debug('left:', left);
        console.debug('clientY:', clientY);
        console.debug('clientX:', clientX);
        draw(clientX - left - viewPos.x, clientY - top - viewPos.y, 100, 100);
      }}
    />
  );
}
export default Test;
