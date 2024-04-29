import React, { useEffect, useRef, useState } from 'react';

const Line = ({ canvasOnOff, lineColor, lineDrop, setElements, setCurrentCurve, currentCurve }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineDrop.lineWidth;
  }, []);

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
