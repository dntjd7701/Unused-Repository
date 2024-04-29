import React, { useRef, useState } from 'react';

const Line = ({ canvasOnOff, lineColor, lineDrop, setElements, setCurrentCurve, currentCurve, cancelEraser }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const hanldeMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    setCurrentCurve({ x, y });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    setCurrentCurve({ x, y });
  };

  const handleMouseUp = (e) => {
    setElements({ editMode: 'freeDraw', color: lineColor, width: lineDrop.lineWidth, history: currentCurve });
    setCurrentCurve();
    setIsDrawing(false);
    // cancelEraser();
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
