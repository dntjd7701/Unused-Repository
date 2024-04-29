/** react */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** components */
import Line from './components/Line';
import Background from './components/Background';

/** imgs */
import icArrDown from './imgs/ic_arrdown@3x.png';
import temp_undo from './imgs/ic_arrow_left_01_m_disable@2x.png';
import icArrUp from './imgs/ic_arrow_up_normal@3x.png';

const useWindowEventListener = (type, listener, options) => {
  useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => {
      window.removeEventListener(type, listener, options);
    };
  }, [type, listener, options]);
};

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
  FREE_DRAW: 'freeDraw',
  // DEFAULT: 'default',
};

const createElement = (startX, startY, endX, endY, editMode, color, width, history) => {
  return { startX, startY, endX, endY, editMode, color, width, history };
};

/** 선 디자인 설정 */
const setLineStyle = (ctx, strokeStyle, width, lineDash = []) => {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.setLineDash(lineDash);
};

/**
 *  이미지 저장 방식이 아닌, 좌표를 저장하여 다시 그려주도록 작업
 */
function ImageViewer() {
  /** useState */
  const [isDrawing, setIsDrawing] = useState(false);
  const [editMode, setEditMode] = useState(EditMode.FREE_DRAW);
  const [elements, setElements] = useState([]);
  const [lineColor, setLineColor] = useState('#2c2c2c');
  const [lineDrop, setLineDrop] = useState({
    isOpen: false,
    lineWidth: 3,
    lineWidthImgTag: <span className='line-2 line'></span>,
  });
  const [canvasOnOff, setCanvasOnOff] = useState({
    canvas: 'off',
    canvas_line: 'on',
  });
  const [currentCurve, setCurrentCurve] = useState([]);
  const [eraserTempColor, setEraserTempColor] = useState(null);

  const [scale, setScale] = useState(1);

  // const [elementsIdx, setElementsIdx] = useState(-1);

  /** useRef */
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const backgroundRef = useRef(null);

  useLayoutEffect(() => {
    // useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      const { startX, startY, endX, endY, editMode, color, width, history } = element;
      setLineStyle(ctx, color, width);

      switch (editMode) {
        case EditMode.STRAIGHT_LINE:
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          break;
        case EditMode.FREE_DRAW:
          ctx.beginPath();
          ctx.moveTo(history[0].x, history[0].y);
          history.forEach(({ x, y }) => {
            ctx.lineTo(x, y);
          });
          ctx.stroke();
          break;
        case EditMode.INSERT_SQUARE:
          ctx.beginPath();
          ctx.rect(startX, startY, endX - startX, endY - startY);
          ctx.stroke();
          break;
        case EditMode.CROP:
          setLineStyle(ctx, 'blue', 1, [4, 16]);

          ctx.beginPath();
          ctx.rect(startX, startY, endX - startX, endY - startY);
          ctx.stroke();

          setLineStyle(ctx, lineColor, lineDrop.lineWidth, []);
          break;
        default:
          break;
      }
    });

    if (currentCurve.length > 0) {
      setLineStyle(ctx, lineColor, lineDrop.lineWidth);
      ctx.beginPath();
      ctx.moveTo(currentCurve[0].x, currentCurve[0].y);
      currentCurve.forEach(({ x, y }) => {
        ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [elements, currentCurve]);

  /** custom hook */
  useWindowEventListener('keydown', (e) => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
  });

  //#region 사용자 정의 함수

  //#endregion

  //#region handler
  const handleClearRect = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.reset();

    // const back = backgroundRef.current;
    // const ctx2 = back.getContext('2d');
    // ctx2.reset();
    setElements([]);
  };

  const hanldeMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    if (editMode === EditMode.FREE_DRAW) {
      setCurrentCurve((prevState) => [...prevState, { x, y }]);
    } else {
      let elementsCopy = [...elements];
      const { startX, startY } = elementsCopy[elementsCopy.length - 1];
      elementsCopy[elementsCopy.length - 1] = createElement(startX, startY, x, y, editMode, lineColor, lineDrop.lineWidth);
      setElements(elementsCopy);
    }
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    if (editMode === EditMode.FREE_DRAW) {
      setCurrentCurve((prevState) => [...prevState, { x, y }]);
    } else {
      setElements((prevState) => [...prevState, createElement(x, y, x, y, editMode, lineColor, lineDrop.lineWidth)]);
    }
  };

  const handleMouseUp = (e) => {
    if (EditMode.CROP === editMode) {
      const elementsCopy = [...elements];
      const { startX, startY, endX, endY } = elementsCopy.pop();

      const canvas = backgroundRef.current;
      const ctx = canvas.getContext('2d');

      // 현재 이미지 데이터 가져오기
      const imageData = ctx.getImageData(startX, startY, endX - startX, endY - startY);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { data, width: oldWidth, height: oldHeight } = imageData;

      // 새로운 크기로 이미지 데이터 생성
      const newWidth = canvas.width;
      const newHeight = canvas.height;
      const newImageData = new ImageData(newWidth, newHeight);
      const newData = newImageData.data;

      // 가로, 세로 비율 계산
      const scaleX = oldWidth / newWidth;
      const scaleY = oldHeight / newHeight;

      // 효율적인 반복문을 사용하여 이미지 데이터 조정
      for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
          // 현재 좌표를 이용하여 원본 이미지 데이터의 인덱스 계산
          const sourceX = Math.floor(x * scaleX);
          const sourceY = Math.floor(y * scaleY);
          const sourceIndex = (sourceY * oldWidth + sourceX) * 4;

          // 새로운 이미지 데이터의 인덱스 계산
          const targetIndex = (y * newWidth + x) * 4;

          // 원본 이미지 데이터의 픽셀을 새로운 이미지 데이터에 복사
          newData[targetIndex] = data[sourceIndex];
          newData[targetIndex + 1] = data[sourceIndex + 1];
          newData[targetIndex + 2] = data[sourceIndex + 2];
          newData[targetIndex + 3] = data[sourceIndex + 3];
        }
      }

      // 변경된 이미지 데이터를 캔버스에 그리기
      ctx.putImageData(newImageData, 0, 0);
      setElements([]);
      handleChangeMode(EditMode.FREE_DRAW);
    }

    if (editMode === EditMode.FREE_DRAW) {
      setCurrentCurve([]);
      setElements((prevState) => [...prevState, createElement(null, null, null, null, editMode, lineColor, lineDrop.lineWidth, currentCurve)]);
    }

    setIsDrawing(false);
  };

  const handleColorPickerChange = (e) => {
    setLineColor(e.target.value);
  };

  const handleUndo = () => {
    const elementsCopy = [...elements];
    if (elements.length > 0) {
      elementsCopy.pop();
    } else {
      handleClearRect();
    }
    setElements(elementsCopy);
  };

  const handleToggleLineDrop = () => {
    setLineDrop((prevState) => {
      return {
        ...lineDrop,
        isOpen: !prevState.isOpen,
      };
    });
  };

  const handleSelectLineDrop = (e) => {
    const { value } = e.target;

    setLineDrop({
      isOpen: false,
      lineWidth: value,
      lineWidthImgTag: React.createElement('span', { className: `line-${value + 1} line` }),
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files.length === 0) return;

    const canvas = backgroundRef.current;
    const image = e.target.files[0];
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      // const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
      // const scaledWidth = img.width * scaleFactor;
      // const scaledHeight = img.height * scaleFactor;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = URL.createObjectURL(image);
    e.target.value = '';
  };

  const handleChangeMode = (mode) => {
    setEditMode(mode);

    setCanvasOnOff({
      canvas: [EditMode.STRAIGHT_LINE, EditMode.INSERT_SQUARE, EditMode.CROP].includes(mode) ? 'on' : 'off',
      canvas_line: [EditMode.FREE_DRAW, EditMode.ERASE].includes(mode) ? 'on' : 'off',
    });
  };

  const handleImageDownload = (e) => {
    // 캔버스 합치기용 캔버스 생성
    const mergedCanvas = document.createElement('canvas');
    const mergedCtx = mergedCanvas.getContext('2d');

    // 캔버스 합치기용 캔버스 크기 설정
    mergedCanvas.width = window.innerWidth;
    mergedCanvas.height = window.innerHeight;

    const container = document.getElementsByClassName('canvas-container');
    const children = container[0].childNodes;

    // 각 캔버스의 이미지 데이터를 합친 캔버스에 그리기
    children.forEach((canvas) => {
      mergedCtx.drawImage(canvas, 0, 0);
      elements.forEach(({ startX, startY, endX, endY, editMode, color, width, history }) => {
        mergedCtx.strokeStyle = color;
        mergedCtx.lineWidth = width;

        switch (editMode) {
          case EditMode.STRAIGHT_LINE:
            mergedCtx.beginPath();
            mergedCtx.moveTo(startX, startY);
            mergedCtx.lineTo(endX, endY);
            mergedCtx.stroke();
            break;
          case EditMode.FREE_DRAW:
            mergedCtx.beginPath();
            mergedCtx.moveTo(history[0].x, history[0].y);
            history.forEach(({ x, y }) => {
              mergedCtx.lineTo(x, y);
            });
            mergedCtx.stroke();
            break;
          default:
            break;
        }
      });
    });

    // 이미지로 변환하여 저장
    const imageDataURL = mergedCanvas.toDataURL('image/png');

    // 가상 링크 생성
    const link = document.createElement('a');
    link.href = imageDataURL;
    link.download = 'kkk.png';

    // 클릭 이벤트 발생시키기
    link.click();
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const zoomSpeed = 0.1; // 조절 가능한 확대/축소 속도
    // 마우스 휠 방향에 따라 확대 또는 축소
    const newScale = event.deltaY > 0 ? scale - zoomSpeed : scale + zoomSpeed;
    // 최소 및 최대 확대/축소 비율 지정
    const minScale = 0.1;
    const maxScale = 3;
    // 새로운 확대/축소 비율이 최소 및 최대 비율을 벗어나지 않도록 함
    const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);
    // 확대/축소 비율 적용

    const container = document.getElementsByClassName('canvas-container');
    const children = container[0].childNodes;

    children.forEach((child) => {
      console.debug('child:', child);
      // const ctx = child.getContext('2d');
      // ctx.scale(clampedScale, clampedScale);
      child.style.transform = `scale(${clampedScale})`;
    });
    setScale(clampedScale);
  };

  //#endregion

  return (
    <>
      <div className='img-edit'>
        <div className='tool'>
          <div className='flex-start'>
            <button className='btn-edit'>편집</button>
            <button
              className='btn-clear'
              onClick={handleClearRect}>
              초기화
            </button>
            <button
              className='btn-line-str'
              data-for='btnTooltip'
              data-tip='직선'
              onClick={() => {
                handleChangeMode(EditMode.STRAIGHT_LINE);
              }}></button>
            <button
              className='btn-line'
              data-for='btnTooltip'
              data-tip='곡선'
              onClick={() => {
                handleChangeMode(EditMode.FREE_DRAW);
              }}></button>

            {/* <button
            className='btn-circle'
            data-for='btnTooltip'
            data-tip='원'
            //   onClick={(e) => handleChangeEditMode(EditMode.INSERT_CIRCLE)}
          ></button>
          <button
            className='btn-square'
            data-for='btnTooltip'
            data-tip='사각형'
            // onClick={(e) => handleChangeEditMode(EditMode.INSERT_SQUARE)}
          ></button>
          <button
            className='btn-triangle'
            data-for='btnTooltip'
            data-tip='삼각형'
            // onClick={(e) => handleChangeEditMode(EditMode.INSERT_TRIANGLE)}
          ></button>
          <button
            className='btn-crop'
            data-for='btnTooltip'
            data-tip='크롭'
            //   onClick={(e) => handleChangeEditMode(EditMode.CROP)}
          ></button>
          <button
            className='btn-lotate-left'
            data-for='btnTooltip'
            data-tip='좌회전'
            //   onClick={(e) => rotate(EditMode.LEFT_ROTATE)}
          ></button>
          <button
            className='btn-lotate-right'
            data-for='btnTooltip'
            data-tip='우회전'
            //   onClick={(e) => rotate(EditMode.RIGHT_ROTATE)}
          ></button> */}
            {/* <button
              className='btn-edit-del'
              data-for='btnTooltip'
              data-tip='지우개'
              onClick={(e) => {
                const color = lineColor;
                console.debug('color:', color);
                setEraserTempColor(color);
                setLineColor('white');
                handleChangeMode(EditMode.ERASE);
              }}></button> */}
            {/* <button
            className='btn-ruler'
            //   onClick={(e) => handleChangeEditMode(EditMode.MEASURE)}
          >
            측정<span></span>
          </button> */}
            <button className='btn-color'>
              선 색상
              <input
                type='color'
                className='colorPicker'
                name='colorPicker'
                value={lineColor}
                onChange={handleColorPickerChange}
              />
            </button>
            {/* <button className='btn-color'> */}
            {/* 채우기 */}
            {/* <span
              className='colorPicker'
              onClick={(e) => {
                // setFillColor((prevFillColor) => ({
                //   ...prevFillColor,
                //   isOpen: !prevFillColor.isOpen,
                // }));
              }}
            >
              <em style={{ backgroundColor: fillColor.color }}></em>
              <img src={icArrDown} alt='' />
              {fillColor.isOpen && (
                <OBTColorPicker
                  value={fillColor.color}
                  onChange={(e) => {
                    setFillColor({
                      isOpen: false,
                      color: e.value.hex,
                    });
                  }}
                />
              )}
            </span> */}
            <button className='btn-line-bold'>
              선 굵기
              <div className='drop-list-wrap'>
                <p
                  className={`drop-list-btn ${lineDrop.isOpen ? 'on' : ''}`}
                  onClick={handleToggleLineDrop}>
                  {lineDrop.lineWidth}pt
                  {lineDrop.lineWidthImgTag}
                  <img
                    src={lineDrop.isOpen ? icArrUp : icArrDown}
                    alt=''
                  />
                </p>
                {lineDrop.isOpen && (
                  <ul
                    className='drop-list'
                    onClick={handleSelectLineDrop}>
                    <li value={1}>
                      1pt<span className='line-2 line'></span>
                    </li>
                    <li value={2}>
                      2pt<span className='line-3 line'></span>
                    </li>
                    <li value={3}>
                      3pt<span className='line-4 line'></span>
                    </li>
                    <li value={4}>
                      4pt<span className='line-5 line'></span>
                    </li>
                    <li value={5}>
                      5pt<span className='line-6 line'></span>
                    </li>
                  </ul>
                )}
              </div>
            </button>
            <button
              className='btn-image-upload'
              onClick={() => {
                inputRef.current.click();
              }}>
              이미지 업로드
              <input
                ref={inputRef}
                id='image-upload'
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
              />
            </button>
            <button
              className='btn-image-upload'
              onClick={handleImageDownload}>
              이미지 다운로드
            </button>
            <div>
              <button>-</button>
              <span>{new Intl.NumberFormat('en-GB', { style: 'percent' }).format(scale)}</span>
              <button
                onClick={() => {
                  console.log('clicked!');
                }}>
                +
              </button>
            </div>
            <button
              onClick={() => {
                const canvas = backgroundRef.current;
                const ctx = canvas.getContext('2d');

                // 현재 이미지 데이터 가져오기
                const imageData = ctx.getImageData(0, 0, 200, 200);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const { data, width: oldWidth, height: oldHeight } = imageData;

                // 새로운 크기로 이미지 데이터 생성
                const newWidth = 1000;
                const newHeight = 500;
                const newImageData = new ImageData(newWidth, newHeight);
                const newData = newImageData.data;

                // 가로, 세로 비율 계산
                const scaleX = oldWidth / newWidth;
                const scaleY = oldHeight / newHeight;

                // 효율적인 반복문을 사용하여 이미지 데이터 조정
                for (let y = 0; y < newHeight; y++) {
                  for (let x = 0; x < newWidth; x++) {
                    // 현재 좌표를 이용하여 원본 이미지 데이터의 인덱스 계산
                    const sourceX = Math.floor(x * scaleX);
                    const sourceY = Math.floor(y * scaleY);
                    const sourceIndex = (sourceY * oldWidth + sourceX) * 4;

                    // 새로운 이미지 데이터의 인덱스 계산
                    const targetIndex = (y * newWidth + x) * 4;

                    // 원본 이미지 데이터의 픽셀을 새로운 이미지 데이터에 복사
                    newData[targetIndex] = data[sourceIndex];
                    newData[targetIndex + 1] = data[sourceIndex + 1];
                    newData[targetIndex + 2] = data[sourceIndex + 2];
                    newData[targetIndex + 3] = data[sourceIndex + 3];
                  }
                }

                // 변경된 이미지 데이터를 캔버스에 그리기
                ctx.putImageData(newImageData, 0, 0);
              }}>
              test
            </button>
            <button
              className='btn-square'
              data-for='btnTooltip'
              data-tip='네모'
              onClick={() => {
                handleChangeMode(EditMode.INSERT_SQUARE);
              }}></button>
            <button
              className='btn-crop'
              data-for='btnTooltip'
              data-tip='크롭'
              onClick={() => handleChangeMode(EditMode.CROP)}></button>
            {/* <button
              className='btn-zoom-in'
              onClick={() => {
                // 현재 캔버스의 크기를 가져옵니다.
                const { width, height } = canvas.getBoundingClientRect();
                // console.debug('height:', height);
                // console.debug('width:', width);

                // let width = 1166;
                // let height = 934;

                // 현재 캔버스의 너비와 높이를 2배로 설정하여 확대 효과 적용
                canvas.style.width = `${width * 1.2}px`;
                canvas.style.height = `${height * 1.2}px`;
              }}>
              확대
            </button> */}
            {/* <button
              className='btn-zoom-in'
              onClick={() => {
                // 현재 캔버스의 크기를 가져옵니다.
                const { width, height } = canvas.getBoundingClientRect();
                // let width = 1166;
                // let height = 934;

                // 현재 캔버스의 너비와 높이를 2배로 설정하여 확대 효과 적용
                canvas.style.width = `${width * 0.8}px`;
                canvas.style.height = `${height * 0.8}px`;
              }}>
              축소
            </button> */}
            <div className='flex-end'>
              {/* <OBTButton imageUrl={icPrint} width='27px' height='27px' onClick={handlePrint} />
          <OBTButton imageUrl={icDownload} width='27px' height='27px' onClick={() => saveImage('compare')} /> */}
            </div>
          </div>
        </div>
      </div>

      <div
        className='canvas-container'
        onWheel={handleWheel}>
        <canvas
          className={`canvas ${canvasOnOff.canvas}`}
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseMove={hanldeMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        {/* <Line
          editMode={editMode}
          canvasOnOff={canvasOnOff}
          lineColor={lineColor}
          lineDrop={lineDrop}
          setElements={(element) => {
            setElements((prevState) => [...prevState, element]);
          }}
          currentCurve={currentCurve}
          setCurrentCurve={(element) => {
            if (!element) {
              setCurrentCurve([]);
            } else {
              setCurrentCurve((prevState) => [...prevState, element]);
            }
          }}
          cancelEraser={() => {
            const color = eraserTempColor;
            console.debug('color:', color);
            setLineColor(color);
            setEraserTempColor(null);
            handleChangeMode(EditMode.FREE_DRAW);
          }}
        /> */}
        <Background backgroundRef={backgroundRef} />
      </div>
    </>
  );
}

export default ImageViewer;

// useWindowEventListener('keydown', (e) => {
//   if (e.key === 'z' && (e.ctrlKey || e.metaKey)) undo();
// });
