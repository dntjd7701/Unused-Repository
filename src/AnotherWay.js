/** react */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** imgs */
import temp_undo from './imgs/ic_arrow_left_01_m_disable@2x.png';
import icArrDown from './imgs/ic_arrdown@3x.png';
import icArrUp from './imgs/ic_arrow_up_normal@3x.png';
import Line from './components/Line';

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

const createElement = (startX, startY, endX, endY, editMode, color, width) => {
  return { startX, startY, endX, endY, editMode, color, width };
};

/**
 *  이미지 저장 방식이 아닌, 좌표를 저장하여 다시 그려주도록 작업
 */
function AnotherWay() {
  /** useState */
  const [isDrawing, setIsDrawing] = useState(false);
  const [editMode, setEditMode] = useState(EditMode.STRAIGHT_LINE);
  const [elements, setElements] = useState([]);
  const [lineColor, setLineColor] = useState('#2c2c2c');
  const [lineDrop, setLineDrop] = useState({
    isOpen: false,
    lineWidth: 3,
    lineWidthImgTag: <span className='line-2 line'></span>,
  });
  const [canvasOnOff, setCanvasOnOff] = useState({
    canvas: 'on',
    canvas_line: 'off',
  });

  // const [elementsIdx, setElementsIdx] = useState(-1);

  /** useRef */
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineDrop.lineWidth;
  }, []);

  // useLayoutEffect(() => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundRef.current) {
      // const img = new Image();
      // img.src = backgroundRef.current;
      // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // img.onload = () => {
      //   // const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
      //   // const scaledWidth = img.width * scaleFactor;
      //   // const scaledHeight = img.height * scaleFactor;
      //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      //   // backgroundRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // };
      // img.src = backgroundRef.current;
      ctx.putImageData(backgroundRef.current, 0, 0);
      ctx.stroke();
    }

    elements.forEach(({ startX, startY, endX, endY, editMode, color, width }, idx) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      switch (editMode) {
        case EditMode.STRAIGHT_LINE:
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          break;
        case EditMode.FREE_DRAW:
          break;
        default:
          break;
      }
    });
  }, [elements]);

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
    backgroundRef.current = null;
    setElements([]);
  };

  const hanldeMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

    if (!isDrawing) {
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(x, y);
      return;
    }

    if (editMode === EditMode.FREE_DRAW) {
      ctx.lineTo(x, y);
      ctx.stroke();
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
    setElements((prevState) => [...prevState, createElement(x, y, x, y, editMode, lineColor, lineDrop.lineWidth)]);
  };

  const handleMouseUp = (e) => {
    // const canvas = canvasRef.current;
    // const rect = canvas.getBoundingClientRect();
    // let elementsCopy = [...elements];
    // const { startX, startY } = elementsCopy[elementsCopy.length - 1];
    // const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    // elementsCopy[elementsCopy.length - 1] = createElement(startX, startY, x, y, editMode, lineColor, lineDrop.lineWidth);
    // setElements(elementsCopy);

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

    const canvas = canvasRef.current;
    const image = e.target.files[0];
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      // const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
      // const scaledWidth = img.width * scaleFactor;
      // const scaledHeight = img.height * scaleFactor;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      backgroundRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // backgroundRef.current = URL.createObjectURL(image);
    };

    handleClearRect();
    img.src = URL.createObjectURL(image);
    e.target.value = '';
  };

  const handleChangeMode = (mode) => {
    console.debug('mode:', mode);
    setEditMode(mode);

    setCanvasOnOff({
      canvas: mode === EditMode.STRAIGHT_LINE ? 'on' : 'off',
      canvas_line: mode === EditMode.FREE_DRAW ? 'on' : 'off',
    });
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
            <button
              className='btn-edit-del'
              data-for='btnTooltip'
              data-tip='지우개'
              //   onClick={(e) => handleRemoveObject(e, EditMode.ERASE)}
            ></button>
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
              className='btn-undo-bold'
              onClick={handleUndo}>
              뒤로
              <img
                src={temp_undo}
                alt=''
              />
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
      <div className='canvas-container'>
        <canvas
          className={`canvas ${canvasOnOff.canvas}`}
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseMove={hanldeMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        <Line
          editMode={editMode}
          canvasOnOff
        />
      </div>
    </>
  );
}

export default AnotherWay;

// useWindowEventListener('keydown', (e) => {
//   if (e.key === 'z' && (e.ctrlKey || e.metaKey)) undo();
// });
