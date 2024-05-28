/** react */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** dep */

/** scss */
import './ImageEditor.scss';

/** imgs */
import icArrDown from './imgs/ic_arrdown@3x.png';
import icArrUp from './imgs/ic_arrow_up_normal@3x.png';
import xRay from './x-ray.png';

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
const ImageViewer = ({ imageChangeFlag, onSaveImage, onDeleteImage, list, pageContainer, accordianGroupValue, width = '100%', height = '100%' }) => {
  //#region Def
  const EditMode = {
    STRAIGHT_LINE: 'straightLine',
    INSERT_SQUARE: 'insertSquare',
    FREE_DRAW: 'freeDraw',
    CROP: 'crop',
    ERASE: 'erase',
    SELECTOR: 'selector',
    DEFAULT: 'insertSquare',
    PIN: 'pin',
  };
  //#endregion

  //#region useState
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [editMode, setEditMode] = useState(EditMode.PIN);
  const [elements, setElements] = useState([]);
  const [lineColor, setLineColor] = useState('#fd0d0d');
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
  //#endregion

  //#region useRef
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const backgroundRef = useRef(null);
  //#endregion

  //#region useEffect
  useEffect(() => {
    const canvasConatiner = document.getElementsByClassName('canvas-container')[0];

    const canvasBackground = backgroundRef.current;
    canvasBackground.width = canvasConatiner.clientWidth;
    canvasBackground.height = canvasConatiner.clientHeight;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = canvasConatiner.clientWidth;
    canvas.height = canvasConatiner.clientHeight;

    img = new Image();

    setScale(1);
    setViewPosOffset({ x: 0, y: 0 });
    setScaleOffset({ x: 0, y: 0 });
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = xRay;
  }, []);

  useEffect(() => {}, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const backgroundCanvas = backgroundRef.current;
    const backgroundCtx = backgroundCanvas.getContext('2d');

    console.log(cursorPos);
    const scaleOffsetX = (canvas.width * scale - canvas.width) / 2;
    console.debug('scaleOffsetX:', scaleOffsetX);
    const scaleOffsetY = (canvas.height * scale - canvas.height) / 2;
    console.debug('scaleOffsetY:', scaleOffsetY);
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, viewPosOffset.x * scale - scaleOffsetX, viewPosOffset.y * scale - scaleOffsetY);

    backgroundCtx.reset();
    // backgroundCtx.setTransform(scale, 0, 0, scale, viewPosOffset.x * scale - scaleOffsetX, viewPosOffset.y * scale - scaleOffsetY);
    backgroundCtx.setTransform(scale, 0, 0, scale, -scaleOffsetX, -scaleOffsetY);
    backgroundCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

    drawElement(ctx, elements);
    if (currentCurve.length > 0) {
      setLineStyle(ctx);
      drawAction.curve(ctx, currentCurve[0], currentCurve);
    }
    ctx.restore();
  }, [elements, currentCurve, viewPosOffset, scale]);

  /** custom hook */
  useWindowEventListener('keydown', (e) => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
  });
  //#endregion

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
        ctx.lineWidth = 3 / scale;
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
    circle: (ctx, { x, y, size, color }) => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.fill();
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
        case EditMode.PIN:
          drawAction.circle(ctx, {
            ...element,
            x: element.x - 12,
            y: element.y - 20,
          });
          ctx.fillStyle = 'white';
          ctx.font = '15px Arial ';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(element.innerNumberCount, element.x - 12, element.y - 20);
          ctx.fillText('📍', element.x, element.y);
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
    const canvas = canvasRef.current;
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;

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

  //#endregion ============================================================================================================

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
  };

  /** canvas onMouseMove */
  const hanldeMouseMove = (e) => {
    const { x, y } = getPosition(e);
    setCursorPos({ x, y });
    if (!isDrawing) return;

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
        /** 이미지를 벗어난 Dragging이 안되도록 막기 */
        if (scale === 1) return;

        const deltaX = x - startViewPosOffset.x;
        const deltaY = y - startViewPosOffset.y;
        setViewPosOffset({ x: viewPosOffset.x + deltaX, y: viewPosOffset.y + deltaY });
        break;
      default:
        break;
    }
  };

  /** canvas onMouseDown */
  const handleMouseDown = (e) => {
    setIsDrawing(true);

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
      case EditMode.PIN:
        const cnt = elements.filter(({ editMode }) => EditMode.PIN === editMode).length + 1;
        setElements((prevState) => [
          ...prevState,
          {
            editMode: EditMode.PIN,
            x,
            y,
            size: 8,
            color: lineColor,
            innerNumberCount: cnt,
          },
        ]);
        break;
      default:
    }
  };

  /** canvas onMouseUp */
  const handleMouseUp = (e) => {
    setIsDrawing(false);
    setStartViewPosOffset({ x: 0, y: 0 });

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

  /** 드로우 타입 선택 */
  const handleChangeMode = (mode) => setEditMode(mode);

  /** 이미지 다운로드 */
  const handleImageSave = async (e) => {
    const mergedCanvas = getMergedCanvas(elements);
    // 이미지로 변환하여 저장
    const imageDataURL = mergedCanvas.toDataURL('image/png');
    img.src = imageDataURL;
    await onSaveImage(imageDataURL);

    pageContainer.snackbar({
      tyep: 'success',
      labelText: '저장되었습니다.',
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = e.deltaY > 0 ? Math.min(scale + 0.2, 3) : Math.max(scale - 0.2, 1);
    setScale(newScale);
  };
  //#endregion
  return (
    <>
      <div
        className='imageViewer'
        style={{ width, height }}>
        <div className='img-edit'>
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
            className='btn-pin-str'
            data-for='btnTooltip'
            data-tip='핀'
            onClick={() => {
              handleChangeMode(EditMode.PIN);
            }}>
            📍
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
          {/* <button
            className='btn-image-upload'
            onClick={() => {
              inputRef.current.click();
            }}
          >
            이미지 업로드
            <input ref={inputRef} id='image-upload' type='file' accept='image/*' onChange={handleImageUpload} />
          </button> */}
          {typeof onSaveImage === 'function' && (
            <button
              disabled={!list?.[accordianGroupValue]?.patientCd}
              className='btn-image-upload'
              onClick={handleImageSave}>
              저장
            </button>
          )}
          {typeof onDeleteImage === 'function' && (
            <button
              disabled={!list?.[accordianGroupValue]?.patientCd}
              className='btn-image-upload'
              onClick={onDeleteImage}>
              삭제
            </button>
          )}
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
        <div
          ref={canvasContainerRef}
          className='canvas-container'
          onWheel={handleWheel}>
          <canvas
            className={`canvas`}
            ref={canvasRef}
            onMouseMove={hanldeMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
          <canvas
            className={`canvas_background`}
            ref={backgroundRef}
          />
        </div>
      </div>
    </>
  );
};

//#endregion ==============================================================================================================

export default ImageViewer;
