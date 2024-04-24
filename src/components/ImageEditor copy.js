import icArrDown from '../imgs/ic_arrdown@3x.png';
import icArrUp from '../imgs/ic_arrow_up_normal@3x.png';
import React, { useEffect, useState } from 'react';
import './ImageEditor.scss';

const ImageEditor = ({ ctx, onChangeMode }) => {
  /** state */
  const [lineColor, setLineColor] = useState('#2c2c2c');
  // 선굵기
  const [lineDrop, setLineDrop] = useState({
    isOpen: false,
    lineWidth: 1,
    lineWidthImgTag: <span className='line-2 line'></span>,
  });

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

  useEffect(() => {
    console.debug('ctx:', ctx);

    if (ctx) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineDrop.lineWidth;
    }
  }, [ctx]);

  const handleColorPickerChange = (e) => {
    ctx.strokeStyle = e.target.value;
    setLineColor(e.target.value);
  };

  const handleClearCanvas = (e) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
    console.log(e.target.value);
    const { value } = e.target;

    ctx.lineWidth = value;

    setLineDrop({
      isOpen: false,
      lineWidth: value,
      lineWidthImgTag: React.createElement('span', { className: `line-${value + 1} line` }),
    });
  };

  return (
    <div className='img-edit'>
      <div className='tool'>
        <div className='flex-start'>
          <button className='btn-edit'>편집</button>
          <button className='btn-clear' onClick={handleClearCanvas}>
            초기화
          </button>
          <button className='btn-line-str' data-for='btnTooltip' data-tip='직선' onClick={(e) => onChangeMode(EditMode.STRAIGHT_LINE)}></button>
          <button
            className='btn-line'
            data-for='btnTooltip'
            data-tip='곡선'
            onClick={(e) => onChangeMode(EditMode.FREE_DRAW)}
            //   onClick={(e) => handleChangeEditMode(EditMode.FREE_DRAW)}
          ></button>
          <button
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
          ></button>
          <button
            className='btn-edit-del'
            data-for='btnTooltip'
            data-tip='지우개'
            //   onClick={(e) => handleRemoveObject(e, EditMode.ERASE)}
          ></button>
          <button
            className='btn-ruler'
            //   onClick={(e) => handleChangeEditMode(EditMode.MEASURE)}
          >
            측정<span></span>
          </button>
          <button className='btn-color'>
            선 색상
            <input type='color' className='colorPicker' name='colorPicker' value={lineColor} onChange={handleColorPickerChange} />
            {/* <em style={{ backgroundColor: strokeColor.color }}></em>
              <img src={icArrDown} alt='' />
              {strokeColor.isOpen && (
                <OBTColorPicker
                  value={strokeColor.color}
                  onChange={(e) => {
                    setStrokeColor({
                      isOpen: false,
                      color: e.value.hex,
                    });
                  }}
                /> */}
            {/* )} */}
          </button>
          <button className='btn-color'>
            채우기
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
          </button>
          <div className='btn-line-bold'>
            선 굵기
            <div className='drop-list-wrap'>
              <p className={`drop-list-btn ${lineDrop.isOpen ? 'on' : ''}`} onClick={handleToggleLineDrop}>
                {lineDrop.lineWidth}pt
                {lineDrop.lineWidthImgTag}
                <img src={lineDrop.isOpen ? icArrUp : icArrDown} alt='' />
              </p>
              {lineDrop.isOpen && (
                <ul className='drop-list' onClick={handleSelectLineDrop}>
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
          </div>
          <div className='flex-end'>
            {/* <OBTButton imageUrl={icPrint} width='27px' height='27px' onClick={handlePrint} />
          <OBTButton imageUrl={icDownload} width='27px' height='27px' onClick={() => saveImage('compare')} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
