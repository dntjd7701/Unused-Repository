/** react */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** components */
import Background from './components/Background';

/** imgs */
import icArrDown from './imgs/ic_arrdown@3x.png';
import icArrUp from './imgs/ic_arrow_up_normal@3x.png';

const EditMode = {
  STRAIGHT_LINE: 'straightLine',
  INSERT_SQUARE: 'insertSquare',
  FREE_DRAW: 'freeDraw',
  CROP: 'crop',
  ERASE: 'erase',
  SELECTOR: 'selector',
  // IMAGE: 'image',
  // INSERT_CIRCLE: 'insertCircle',
  // INSERT_TRIANGLE: 'inserTriangle',
  // LEFT_ROTATE: 'left',
  // RIGHT_ROTATE: 'right',
  // MEASURE: 'measure',
  // COMPARE: 'compare',
  // DEFAULT: 'default',
};

/**
 * window event listener hook
 * @param {string} type-'keydown'|'mousemove'...
 * @param {function} listener
 * @param {object} options
 */
const useWindowEventListener = (type, listener, options) => {
  useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => {
      window.removeEventListener(type, listener, options);
    };
  }, [type, listener, options]);
};

/**
 * 각 draw의 정보를 담은 객체를 반환
 * @param {number} startX
 * @param {number} startY
 * @param {number} endX
 * @param {number} endY
 * @param {string<EditMode>} editMode
 * @param {string} color
 * @param {number} width
 * @param {object[]} history
 * @returns {object} element
 */
const createElement = (startX, startY, endX, endY, editMode, color, width, history) => {
  return { startX, startY, endX, endY, editMode, color, width, history };
};

/**
 * 선의 기본 디자인 설정
 * @param {object} ctx
 * @param {string} editMode
 * @param {string} strokeStyle
 * @param {number} width
 * @param {number[]} lineDash
 */
const setLineStyle = (ctx, editMode, strokeStyle, width, lineDash = []) => {
  ctx.lineCap = 'round';
  ctx.setLineDash([]);

  switch (editMode) {
    case EditMode.CROP:
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 16]);
      break;
    case EditMode.ERASE:
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 15;
      break;
    default:
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = width;
      break;
  }
};

/**
 * @returns {object} actions
 */
const drawAction = {
  line: (ctx, { startX, startY, endX, endY }) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  },
  curve: (ctx, { x, y }, paths) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    paths.forEach(({ x, y }) => {
      ctx.lineTo(x, y);
    });
    ctx.stroke();
  },
  square: (ctx, { startX, startY, endX, endY }) => {
    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.stroke();
  },
};

/**
 * 저장된 Element 그리기
 * @param {object} ctx
 * @param {object[]} elements
 * @param {string} lineColor
 * @param {number} lineWidth
 */
const drawElement = (ctx, elements) => {
  elements.forEach((element) => {
    const { editMode, color, width, history } = element;
    setLineStyle(ctx, editMode, color, width);

    switch (editMode) {
      case EditMode.STRAIGHT_LINE:
        drawAction.line(ctx, element);
        break;
      case EditMode.FREE_DRAW:
      case EditMode.ERASE:
        drawAction.curve(ctx, history[0], history);
        break;
      case EditMode.INSERT_SQUARE:
      case EditMode.CROP:
        drawAction.square(ctx, element);
        break;
      default:
    }
  });
};

/**
 * @param {object} imageData - 기존 이미지
 * @param {number} width - 새롭게 그려질 이미지의 width
 * @param {number} height - 새롭게 그려질 이미지의 height
 * @returns {object} newImageData - 새로운 이미지
 */
const copyImage = (imageData, width, height) => {
  const { data, width: oldWidth, height: oldHeight } = imageData;

  // 새로운 크기로 이미지 데이터 생성
  const newWidth = width;
  const newHeight = height;
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

  return newImageData;
};

/**
 * @param {object[]} elements
 * @param {React.ref} canvasRef
 * @param {function} callback
 *
 * @TODO
 * 현재, background(이미지) 에 대해서만 크롭 기능 활성화, 이미 그려진 element에 대해서도 crop할 수 있또록
 * merge 필요
 */
const cropImage = (elements, canvasRef, callback) => {
  // 크롭 박스 제거
  const elementsCopy = [...elements];
  const { startX, startY, endX, endY } = elementsCopy.pop();

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  // 현재 이미지 데이터 가져오기
  const imageData = ctx.getImageData(startX, startY, endX - startX, endY - startY);
  const newImageData = copyImage(imageData, canvas.width, canvas.height);

  // 변경된 이미지 데이터를 캔버스에 그리기
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(newImageData, 0, 0);
  callback();
};

/** 나누어진 canvas 합치기 */
const getMergedCanvas = (elements) => {
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

    drawElement(mergedCtx, elements);
  });

  return mergedCanvas;
};

const ImageViewer = () => {
  let isSelected = false;

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
  const [currentCurve, setCurrentCurve] = useState([]);
  const [scale, setScale] = useState(1);

  /** useRef */
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const backgroundRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawElement(ctx, elements);

    if (currentCurve.length > 0) {
      setLineStyle(ctx, editMode, lineColor, lineDrop.lineWidth);
      drawAction.curve(ctx, currentCurve[0], currentCurve);
    }
  }, [elements, currentCurve]);

  /** custom hook */
  useWindowEventListener('keydown', (e) => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
  });

  //#region handler

  /** 초기화 버튼 */
  const handleClearRect = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.reset();
    setElements([]);
  };

  /** canvas onMouseMove */
  const hanldeMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    switch (editMode) {
      case EditMode.FREE_DRAW:
      case EditMode.ERASE:
        setCurrentCurve((prevState) => [...prevState, { x, y }]);
        break;
      case EditMode.CROP:
      case EditMode.STRAIGHT_LINE:
      case EditMode.INSERT_SQUARE:
        let elementsCopy = [...elements];
        const { startX, startY } = elementsCopy[elementsCopy.length - 1];
        elementsCopy[elementsCopy.length - 1] = createElement(startX, startY, x, y, editMode, lineColor, lineDrop.lineWidth);
        setElements(elementsCopy);
        break;
      default:
        break;
    }
  };

  /** canvas onMouseDown */
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    switch (editMode) {
      case EditMode.FREE_DRAW:
      case EditMode.ERASE:
        setCurrentCurve((prevState) => [...prevState, { x, y }]);
        break;
      case EditMode.CROP:
      case EditMode.STRAIGHT_LINE:
      case EditMode.INSERT_SQUARE:
        setElements((prevState) => [...prevState, createElement(x, y, x, y, editMode, lineColor, lineDrop.lineWidth)]);
        break;
      case EditMode.SELECTOR:
        console.log(elements);
        console.log(x, y);
      //
      // elements.find(({}))
      default:
        break;
    }
  };

  /** canvas onMouseUp */
  const handleMouseUp = (e) => {
    setIsDrawing(false);

    switch (editMode) {
      case EditMode.CROP:
        cropImage(elements, backgroundRef, () => {
          setElements([]);
          handleChangeMode(EditMode.FREE_DRAW);
        });
        break;
      case EditMode.FREE_DRAW:
        setCurrentCurve([]);
        setElements((prevState) => [...prevState, createElement(null, null, null, null, editMode, lineColor, lineDrop.lineWidth, currentCurve)]);
        break;
      case EditMode.ERASE:
        setCurrentCurve([]);
        setElements((prevState) => [...prevState, createElement(null, null, null, null, editMode, 'white', lineDrop.lineWidth, currentCurve)]);
        handleChangeMode(EditMode.FREE_DRAW);
        break;
      default:
        break;
    }
  };

  /** 선 색상 변경 */
  const handleColorPickerChange = (e) => {
    setLineColor(e.target.value);
  };

  /** Undo - elements 제거 */
  const handleUndo = () => {
    const elementsCopy = [...elements];
    if (elements.length > 0) {
      elementsCopy.pop();
    } else {
      handleClearRect();
    }
    setElements(elementsCopy);
  };

  /** 선 굵기 드랍다운 */
  const handleToggleLineDrop = () => {
    setLineDrop((prevState) => {
      return {
        ...lineDrop,
        isOpen: !prevState.isOpen,
      };
    });
  };

  /** 선 굵기 선택 */
  const handleSelectLineDrop = (e) => {
    const { value } = e.target;

    setLineDrop({
      isOpen: false,
      lineWidth: value,
      lineWidthImgTag: React.createElement('span', { className: `line-${value + 1} line` }),
    });
  };

  /** 이미지 업로드 */
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

  /** 드로우 타입 선택 */
  const handleChangeMode = (mode) => {
    setEditMode(mode);
  };

  /** 이미지 다운로드 */
  const handleImageDownload = (e) => {
    const mergedCanvas = getMergedCanvas(elements);
    // 이미지로 변환하여 저장
    const imageDataURL = mergedCanvas.toDataURL('image/png');

    // 가상 링크 생성
    const link = document.createElement('a');
    link.href = imageDataURL;
    link.download = 'kkk.png';

    // 클릭 이벤트 발생시키기
    link.click();
  };

  /** 줌 휠 */
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
              data-tip='선택'
              onClick={() => {
                handleChangeMode(EditMode.SELECTOR);
              }}></button>
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
              onClick={() => {
                handleChangeMode(EditMode.CROP);
              }}></button>
            <button
              className='btn-edit-del'
              data-for='btnTooltip'
              data-tip='지우개'
              onClick={(e) => {
                handleChangeMode(EditMode.ERASE);
              }}></button>
            {/* <button
            className='btn-circle'
            data-for='btnTooltip'
            data-tip='원'
            //   onClick={(e) => handleChangeEditMode(EditMode.INSERT_CIRCLE)}
          ></button>
          <button
            className='btn-triangle'
            data-for='btnTooltip'
            data-tip='삼각형'
            // onClick={(e) => handleChangeEditMode(EditMode.INSERT_TRIANGLE)}
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
          className={`canvas`}
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseMove={hanldeMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        <Background backgroundRef={backgroundRef} />
      </div>
    </>
  );
};

export default ImageViewer;
