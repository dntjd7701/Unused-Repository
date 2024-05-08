/** react */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** components */

/** imgs */
import icArrDown from './imgs/ic_arrdown@3x.png';
import icArrUp from './imgs/ic_arrow_up_normal@3x.png';

/**
 * =========================================================================================================
 * @TODO
 * zoom in/out 좌표값 재계산
 * 물체 선택 drag
 * =========================================================================================================
 */

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

let img = new Image();

//#region ==============================================================================================================
const ImageViewer = () => {
  const EditMode = {
    STRAIGHT_LINE: 'straightLine',
    INSERT_SQUARE: 'insertSquare',
    FREE_DRAW: 'freeDraw',
    CROP: 'crop',
    ERASE: 'erase',
    SELECTOR: 'selector',
    DEFAULT: 'insertSquare',
  };

  /** useState */
  const [isDrawing, setIsDrawing] = useState(false);
  const [editMode, setEditMode] = useState(EditMode.DEFAULT);
  const [elements, setElements] = useState([]);
  const [lineColor, setLineColor] = useState('#2c2c2c');
  const [lineDrop, setLineDrop] = useState({
    isOpen: false,
    lineWidth: 3,
    lineWidthImgTag: <span className='line-2 line'></span>,
  });
  const [currentCurve, setCurrentCurve] = useState([]);
  const [viewPosOffset, setViewPosOffset] = useState({ x: 0, y: 0 });
  const [startViewPosOffset, setStartViewPosOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

  /** useRef */
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const backgroundRef = useRef(null);
  const cropImgRef = useRef(null);

  //#region 사용자 정의 함수 ============================================================================================================
  const getPosition = (event) => {
    const canvas = canvasRef.current;
    const { left, top } = canvas.getBoundingClientRect();
    const { clientX, clientY } = event;
    /**
     * client: 마우스 이벤트 발생 위치(브라우저 왼쪽 상단 기준)
     * getBoundingClientRect: 뷰포트에 대한 상대적인 위치
     * clientX - left: 마우스 이벤트가 발생한 클라이언트 좌표에서 캔버스 요소의 왼쪽 상단의 뷰포트에 대한 상대적인 위치를 뺀다. 이렇게 하면 마우스 이벤트가 발생한 지점이 캔버스 요소 내에서의 상대적인 위치를 구할 수 있다.
     *
     */

    const x = (clientX - left - (viewPosOffset.x * scale - scaleOffset.x)) / scale;
    const y = (clientY - top - (viewPosOffset.y * scale - scaleOffset.y)) / scale;
    return {
      // x: (clientX - left) / scale + scaleOffset.x - viewPosOffset.x,
      // y: (clientY - top) / scale + scaleOffset.y - viewPosOffset.y,
      x,
      y,
    };
  };

  /**
   * 각 draw의 정보를 담은 객체를 반환
   * @param {number} startX
   * @param {number} startY
   * @param {number} endX
   * @param {number} endY
   * @param {object[]} history-곡선 pos
   * @returns {object} element
   */
  const createElement = (startX, startY, endX, endY, history, distanceX, distanceY) => {
    return { startX, startY, endX, endY, editMode, color: lineColor, width: lineDrop.lineWidth, history, distanceX, distanceY };
  };

  /**
   * 선의 기본 디자인 설정
   * @param {object} ctx
   * @param {string} mode
   * @param {string} strokeStyle
   * @param {number} width
   * @param {number[]} lineDash
   */
  const setLineStyle = (ctx, mode = editMode, strokeStyle = lineColor, width = lineDrop.lineWidth) => {
    ctx.lineCap = 'round';
    ctx.setLineDash([]);

    switch (mode) {
      case EditMode.CROP:
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1 / scale;
        ctx.setLineDash([4, 16]);
        break;
      case EditMode.ERASE:
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 15 / scale;
        break;
      default:
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width / scale;
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
      drawElement(
        mergedCtx,
        elements.filter(({ editMode }) => editMode !== EditMode.CROP)
      );
    });

    return mergedCanvas;
  };

  const cropImage = () => {
    // 크롭 박스 제거
    const elementsCopy = [...elements];
    const { startX, startY, endX, endY } = elementsCopy.pop();

    const canvas = backgroundRef.current;
    const mergedCanvas = getMergedCanvas(elementsCopy);
    const mergedCtx = mergedCanvas.getContext('2d');

    const x1 = startX;
    const y1 = startY;
    const x2 = endX - startX;
    const y2 = endY - startY;

    const imageData = mergedCtx.getImageData(x1, y1, x2, y2);
    const newImageData = copyImage(imageData, canvas.width, canvas.height);
    mergedCtx.putImageData(newImageData, 0, 0);

    const cropedImage = mergedCanvas.toDataURL('image/png');
    img.src = cropedImage;
    setElements([]);
    handleChangeMode(EditMode.DEFAULT);
  };

  const mouseDownAction = (e) => {
    const { x, y } = getPosition(e);

    switch (editMode) {
      case EditMode.FREE_DRAW:
      case EditMode.ERASE:
        setCurrentCurve((prevState) => [...prevState, { x, y }]);
        break;
      case EditMode.CROP:
      case EditMode.STRAIGHT_LINE:
      case EditMode.INSERT_SQUARE:
        setElements((prevState) => [...prevState, createElement(x, y, x, y)]);
        break;

      case EditMode.SELECTOR:
        setStartViewPosOffset({ x, y });
        break;

      default:
        break;
    }
  };

  const mouseMoveAction = (e) => {
    const { x, y } = getPosition(e);

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
        elementsCopy[elementsCopy.length - 1] = createElement(startX, startY, x, y);
        setElements(elementsCopy);
        break;
      case EditMode.SELECTOR:
        const deltaX = x - startViewPosOffset.x;
        const deltaY = y - startViewPosOffset.y;
        setViewPosOffset({ x: viewPosOffset.x + deltaX, y: viewPosOffset.y + deltaY });
        break;
      default:
        break;
    }
  };

  const mouseUpAction = (e) => {
    switch (editMode) {
      case EditMode.CROP:
        cropImage();
        break;
      case EditMode.FREE_DRAW:
        setCurrentCurve([]);
        setElements((prevState) => [...prevState, createElement(null, null, null, null, currentCurve)]);
        break;

      case EditMode.ERASE:
        setCurrentCurve([]);
        setElements((prevState) => [...prevState, createElement(null, null, null, null, currentCurve)]);
        handleChangeMode(EditMode.DEFAULT);
        break;

      default:
        break;
    }
  };

  //#endregion ============================================================================================================

  useEffect(() => {
    // const addr =
    //   'data:image/jpeg;base64,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';
    // const canvas = backgroundRef.current;
    // const ctx = canvas.getContext('2d');
    // img.onload = () => {
    //   // const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
    //   // const scaledWidth = img.width * scaleFactor;
    //   // const scaledHeight = img.height * scaleFactor;
    //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // };
    // img.src = addr;
  });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const scaleOffsetX = (canvas.width * scale - canvas.width) / 2;
    const scaleOffsetY = (canvas.height * scale - canvas.height) / 2;
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, viewPosOffset.x * scale - scaleOffsetX, viewPosOffset.y * scale - scaleOffsetY);

    drawElement(ctx, elements);
    if (currentCurve.length > 0) {
      setLineStyle(ctx);
      drawAction.curve(ctx, currentCurve[0], currentCurve);
    }
    ctx.restore();

    const backgroundCanvas = backgroundRef.current;
    const backgroundCtx = backgroundCanvas.getContext('2d');

    backgroundCtx.reset();
    backgroundCtx.setTransform(scale, 0, 0, scale, viewPosOffset.x * scale - scaleOffsetX, viewPosOffset.y * scale - scaleOffsetY);
    backgroundCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [elements, currentCurve, viewPosOffset, scale]);

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
    setScale(1);
    setViewPosOffset({ x: 0, y: 0 });
    setScaleOffset({ x: 0, y: 0 });
    cropImgRef.current = null;
    img = new Image();
  };

  /** canvas onMouseMove */
  const hanldeMouseMove = (e) => {
    if (!isDrawing) return;
    mouseMoveAction(e);
  };

  /** canvas onMouseDown */
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    mouseDownAction(e);
  };

  /** canvas onMouseUp */
  const handleMouseUp = (e) => {
    setIsDrawing(false);
    setStartViewPosOffset({ x: 0, y: 0 });
    mouseUpAction(e);
  };

  /** 선 색상 변경 */
  const handleColorPickerChange = (e) => setLineColor(e.target.value);

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

    // const img = new Image();
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
  const handleWheel = (e) => setScale((prevState) => (e.deltaY > 0 ? Math.min(prevState + 0.1, 2) : Math.max(prevState - 0.1, 0.1)));

  // const handleWheel = (e) => {
  //   const { offsetX, offsetY } = e.nativeEvent;
  //   e.preventDefault();
  //   const xs = (offsetX - viewPosRef.current.x) / scaleRef.current;
  //   const ys = (offsetY - viewPosRef.current.y) / scaleRef.current;
  //   const delta = -e.deltaY;
  //   const newScale = delta > 0 ? scaleRef.current * 1.2 : scaleRef.current / 1.2;

  //   if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
  //     scaleRef.current = newScale;
  //     viewPosRef.current = {
  //       x: offsetX - xs * scaleRef.current,
  //       y: offsetY - ys * scaleRef.current,
  //     };
  //   }
  //   draw();
  // };
  // const handleWheel = (e) => {
  //   const { offsetX, offsetY } = e.nativeEvent;
  //   e.preventDefault();
  //   const xs = (offsetX - viewPosRef.current.x) / scaleRef.current;
  //   const ys = (offsetY - viewPosRef.current.y) / scaleRef.current;
  //   const delta = -e.deltaY;
  //   const newScale = delta > 0 ? scaleRef.current * 1.2 : scaleRef.current / 1.2;

  //   if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
  //     scaleRef.current = newScale;
  //     viewPosRef.current = {
  //       x: offsetX - xs * scaleRef.current,
  //       y: offsetY - ys * scaleRef.current,
  //     };
  //   }
  //   draw();
  // };

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
              className='btn-selection'
              data-for='btnTooltip'
              data-tip='선택'
              onClick={() => {
                handleChangeMode(EditMode.SELECTOR);
              }}>
              ✋
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
                setScale(1);
                setViewPosOffset({ x: 0, y: 0 });
                setScaleOffset({ x: 0, y: 0 });
                handleChangeMode(EditMode.CROP);
              }}></button>
            <button
              className='btn-edit-del'
              data-for='btnTooltip'
              data-tip='지우개'
              onClick={(e) => {
                handleChangeMode(EditMode.ERASE);
              }}></button>
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
        <canvas
          className={`canvas_background`}
          ref={backgroundRef}
          width={window.innerWidth}
          height={window.innerHeight}
          //   onMouseMove={hanldeMouseMove}
          //   onMouseDown={handleMouseDown}
          //   onMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
};

//#endregion ==============================================================================================================

export default ImageViewer;
