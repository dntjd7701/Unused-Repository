import { useCallback, useEffect, useRef, useState } from 'react';

function ImageViewer() {
  let painting = false;
  let startX,
    startY = 0;

  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  });
  const [ctx, setCtx] = useState(null);

  const canvasRef = useRef(null);
  const canvasContainer = useCallback((ref) => {
    setCanvasSize({
      width: ref?.offsetWidth,
      height: ref?.offsetHeight,
    });
  }, []);

  /** useEffect */
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');
    setCtx(ctx);
  }, [canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [ctx]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    if (ctx) {
      if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
        // if (editMode === EditMode.STRAIGHT_LINE) {
        //   drawStraight(x, y);
        // } else if (editMode === EditMode.FREE_DRAW) {
        //   ctx.lineTo(x, y);
        //   ctx.stroke();
        // }
      }
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    startX = x;
    startY = y;
    painting = true;
  };

  const handleMouseUp = (e) => {
    painting = false;
  };

  const handleChangeMode = (mode) => {
    // setEditMode(mode);
  };

  const drawStraight = (endX, endY) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  };

  return (
    <div
      className='canvas-container'
      ref={canvasContainer}>
      <canvas
        id='canvas'
        ref={canvasRef}
        // width={canvasSize.width}
        // height={canvasSize.height}
      />
    </div>
  );
}

export default ImageViewer;
