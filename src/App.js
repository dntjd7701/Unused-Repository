import { useCallback, useEffect, useRef, useState } from 'react';
import ImageEditor from './components/ImageEditor';

function ImageViewer() {
  const EditMode = {
    DEFAULT: 'default',
    STRAIGHT_LINE: 'straightLine',
    INSERT_CIRCLE: 'insertCircle',
    INSERT_SQUARE: 'insertSquare',
    INSERT_TRIANGLE: 'inserTriangle',
    CROP: 'crop',
    LEFT_ROTATE: 'left',
    RIGHT_ROTATE: 'right',
    FREE_DRAW: 'freeDraw',
    ERASE: 'erase',
    MEASURE: 'measure',
    COMPARE: 'compare',
  };

  let painting = false;
  let startX,
    startY = 0;

  const historyRef = useRef([]); // useRef를 사용하여 초기화_undo 효과를 위한 히스토리 작업
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  });
  const [canvas, setCanvas] = useState(null);
  const [editMode, setEditMode] = useState(EditMode.FREE_DRAW);

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
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
    }

    setCanvas(canvas);
  }, [canvasSize]);

  useEffect(() => {
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [canvas, editMode]);

  const handleMouseMove = (e) => {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    if (ctx) {
      if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        switch (editMode) {
          case EditMode.STRAIGHT_LINE:
            drawStraight(x, y);
            break;
          default:
            ctx.lineTo(x, y);
            ctx.stroke();
            break;
        }
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
    const ctx = canvas.getContext('2d');
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    painting = false;
  };

  const handleChangeMode = (mode) => {
    setEditMode(mode);
  };

  const handleClearCanvas = () => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
    historyRef.current = [];
  };

  const handleUndo = () => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
    historyRef.current.pop();
    if (historyRef.current.length > 0) {
      ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
      ctx.stroke();
    }
  };

  const drawStraight = (endX, endY) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
    if (Array.isArray(historyRef.current) && historyRef.current.length > 0) {
      ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
    }
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  };

  return (
    <>
      <ImageEditor
        onChangeMode={handleChangeMode}
        onClear={handleClearCanvas}
        EditMode={EditMode}
        canvas={canvas}
        onUndo={handleUndo}
      />
      <div
        className='canvas-container'
        ref={canvasContainer}>
        <canvas
          id='canvas'
          ref={canvasRef}
        />
      </div>
    </>
  );
}

export default ImageViewer;

// useWindowEventListener('keydown', (e) => {
//   if (e.key === 'z' && (e.ctrlKey || e.metaKey)) undo();
// });
