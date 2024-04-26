import React, { useRef, useState } from 'react';

const Line = ({ editMode, canvasOnOff }) => {
  const EditMode = {
    STRAIGHT_LINE: 'straightLine',
    IMAGE: 'image',
    INSERT_CIRCLE: 'insertCircle',
    INSERT_SQUARE: 'insertSquare',
    INSERT_TRIANGLE: 'inserTriangle',
    CROP: 'crop',
    LEFT_ROTATE: 'left',
    RIGHT_ROTATE: 'right',
    ERASE: 'erase',
    MEASURE: 'measure',
    COMPARE: 'compare',
    // FREE_DRAW: 'freeDraw',
    // DEFAULT: 'default',
  };

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const hanldeMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    if (!isDrawing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
  };

  const handleMouseUp = (e) => {
    setIsDrawing(false);
  };

  return (
    <canvas
      className={`canvas_line ${canvasOnOff.canvas_line}`}
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={hanldeMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Line;
