import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const Line = ({ canvasOnOff, lineColor, lineDrop }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  // 곡선 히스토리를 저장할 배열
  const [curveHistory, setCurveHistory] = useState([]);
  // 현재 그리는 곡선의 포인트 배열
  const [currentCurve, setCurrentCurve] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineDrop.lineWidth;
  }, []);

  useLayoutEffect(() => {
    // useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.debug('curveHistory:', curveHistory);

    curveHistory.forEach((history) => {
      const { startX, startY } = history[0];
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      history.forEach(({ x, y }) => {
        ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    if (currentCurve.length > 0) {
      const { startX, startY } = currentCurve[0];
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      // const { x, y } = currentCurve[currentCurve.length - 1];
      currentCurve.forEach(({ x, y }) => {
        ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [currentCurve, curveHistory]);

  const hanldeMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    setCurrentCurve((prevState) => [...prevState, { x, y }]);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    setCurrentCurve((prevState) => [...prevState, { x, y }]);
  };

  const handleMouseUp = (e) => {
    if (currentCurve.length > 0) {
      setCurveHistory((prevState) => [...prevState, currentCurve]);
      setCurrentCurve([]);
    }
    setIsDrawing(false);
  };

  function undo() {
    if (curveHistory.length > 0) {
      const copyCurveHistory = [...curveHistory];
      copyCurveHistory.pop();
      setCurveHistory(copyCurveHistory);
    }
  }

  return (
    <>
      <button
        onClick={undo}
        style={{ position: 'absolute', zIndex: 999999 }}>
        뒤로
      </button>

      <canvas
        className={`canvas_line ${canvasOnOff.canvas_line}`}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseMove={hanldeMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </>
  );
};

export default Line;
