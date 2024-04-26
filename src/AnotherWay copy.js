import temp_undo from './imgs/ic_arrow_left_01_m_disable@2x.png';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ImageEditor from './components/ImageEditor';

const useWindowEventListener = (type, listener, options) => {
  useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => {
      window.removeEventListener(type, listener, options);
    };
  }, [type, listener, options]);
};

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

const createElement = (startX, startY, endX, endY, editMode) => {
  return { startX, startY, endX, endY, editMode };
};

/**
 *  이미지 저장 방식이 아닌, 좌표를 저장하여 다시 그려주도록 작업
 */
function AnotherWay() {
  /** useState */
  const [isDrawing, setIsDrawing] = useState(false);
  const [editMode, setEditMode] = useState(EditMode.STRAIGHT_LINE);
  const [elements, setElements] = useState([]);
  // const [elementsIdx, setElementsIdx] = useState(-1);

  /** useRef */
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach(({ startX, startY, endX, endY, editMode }, idx) => {
      switch (editMode) {
        case EditMode.STRAIGHT_LINE:
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
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

  /** handler */
  const hanldeMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    const ctx = canvas.getContext('2d');

    if (!isDrawing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      return;
    }

    let elementsCopy = [...elements];
    const { startX, startY } = elementsCopy[elementsCopy.length - 1];

    if (editMode === EditMode.STRAIGHT_LINE) {
      elementsCopy[elementsCopy.length - 1] = createElement(startX, startY, x, y, editMode);
    } else {
      elementsCopy[elementsCopy.length - 1] = createElement(x, y, x, y, editMode);
    }

    setElements(elementsCopy);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    setElements((prevState) => [...prevState, createElement(x, y, x, y)]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleUndo = () => {
    const elementsCopy = [...elements];
    elementsCopy.pop();
    setElements(elementsCopy);
  };

  return (
    <>
      <div className='img-edit'>
        <div className='tool'>
          <div className='flex-start'>
            <button className='btn-edit'>편집</button>
            <button
              className='btn-clear'
              // onClick={onClear}
            >
              초기화
            </button>
            <button
              className='btn-line-str'
              data-for='btnTooltip'
              data-tip='직선'
              onClick={() => setEditMode(EditMode.STRAIGHT_LINE)}></button>
            {/* <button
              className='btn-line'
              data-for='btnTooltip'
              data-tip='곡선'
              onClick={() => setEditMode(EditMode.FREE_DRAW)}></button> */}
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
                // value={lineColor}
                // onChange={handleColorPickerChange}
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
            {/* </button> */}
            <button className='btn-line-bold'>
              선 굵기
              {/* <div className='drop-list-wrap'>
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
              </div> */}
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
            {/* <button
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
                onChange={onImageUpload}
              />
            </button> */}
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
          id='canvas'
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseMove={hanldeMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
}

export default AnotherWay;

// useWindowEventListener('keydown', (e) => {
//   if (e.key === 'z' && (e.ctrlKey || e.metaKey)) undo();
// });
