// /** react */
// import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// /** components */

// /** imgs */
// import icArrDown from './imgs/ic_arrdown@3x.png';
// import icArrUp from './imgs/ic_arrow_up_normal@3x.png';

// /**
//  * =========================================================================================================
//  * @TODO
//  * 물체 선택 drag
//  * =========================================================================================================
//  */

// /**
//  * window event listener hook
//  * @param {string} type-'keydown'|'mousemove'...
//  * @param {function} listener
//  * @param {object} options
//  */
// const useWindowEventListener = (type, listener, options) => {
//   useEffect(() => {
//     window.addEventListener(type, listener, options);
//     return () => {
//       window.removeEventListener(type, listener, options);
//     };
//   }, [type, listener, options]);
// };

// let img = new Image();

// //#region ==============================================================================================================
// const ImageViewer = () => {
//   const EditMode = {
//     STRAIGHT_LINE: 'straightLine',
//     INSERT_SQUARE: 'insertSquare',
//     FREE_DRAW: 'freeDraw',
//     CROP: 'crop',
//     ERASE: 'erase',
//     SELECTOR: 'selector',
//     DEFAULT: 'insertSquare',
//   };

//   /** useState */
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [editMode, setEditMode] = useState(EditMode.DEFAULT);
//   const [elements, setElements] = useState([]);
//   const [lineColor, setLineColor] = useState('#2c2c2c');
//   const [lineDrop, setLineDrop] = useState({
//     isOpen: false,
//     lineWidth: 3,
//     lineWidthImgTag: <span className='line-2 line'></span>,
//   });
//   const [currentCurve, setCurrentCurve] = useState([]);
//   const [viewPosOffset, setViewPosOffset] = useState({ x: 0, y: 0 });
//   const [startViewPosOffset, setStartViewPosOffset] = useState({ x: 0, y: 0 });
//   const [scale, setScale] = useState(1);
//   const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

//   /** useRef */
//   const canvasRef = useRef(null);
//   const inputRef = useRef(null);
//   const backgroundRef = useRef(null);

//   //#region 사용자 정의 함수 ============================================================================================================
//   const getPosition = (event) => {
//     const canvas = canvasRef.current;
//     const { left, top } = canvas.getBoundingClientRect();
//     const { clientX, clientY } = event;
//     /**
//      * client: 마우스 이벤트 발생 위치(브라우저 왼쪽 상단 기준)
//      * getBoundingClientRect: 뷰포트에 대한 상대적인 위치
//      * clientX - left: 마우스 이벤트가 발생한 클라이언트 좌표에서 캔버스 요소의 왼쪽 상단의 뷰포트에 대한 상대적인 위치를 뺀다. 이렇게 하면 마우스 이벤트가 발생한 지점이 캔버스 요소 내에서의 상대적인 위치를 구할 수 있다.
//      *
//      */

//     const x = (clientX - left - (viewPosOffset.x * scale - scaleOffset.x)) / scale;
//     const y = (clientY - top - (viewPosOffset.y * scale - scaleOffset.y)) / scale;
//     return {
//       // x: (clientX - left) / scale + scaleOffset.x - viewPosOffset.x,
//       // y: (clientY - top) / scale + scaleOffset.y - viewPosOffset.y,
//       x,
//       y,
//     };
//   };

//   /**
//    * 각 draw의 정보를 담은 객체를 반환
//    * @param {number} startX
//    * @param {number} startY
//    * @param {number} endX
//    * @param {number} endY
//    * @param {object[]} history-곡선 pos
//    * @returns {object} element
//    */
//   const createElement = (startX, startY, endX, endY, history, distanceX, distanceY) => {
//     return { startX, startY, endX, endY, editMode, color: lineColor, width: lineDrop.lineWidth, history, distanceX, distanceY };
//   };

//   /**
//    * 선의 기본 디자인 설정
//    * @param {object} ctx
//    * @param {string} mode
//    * @param {string} strokeStyle
//    * @param {number} width
//    * @param {number[]} lineDash
//    */
//   const setLineStyle = (ctx, mode = editMode, strokeStyle = lineColor, width = lineDrop.lineWidth) => {
//     ctx.lineCap = 'round';
//     ctx.setLineDash([]);

//     switch (mode) {
//       case EditMode.CROP:
//         ctx.strokeStyle = 'blue';
//         ctx.lineWidth = 3 / scale;
//         ctx.setLineDash([4, 16]);
//         break;
//       case EditMode.ERASE:
//         ctx.strokeStyle = 'white';
//         ctx.lineWidth = 15 / scale;
//         break;
//       default:
//         ctx.strokeStyle = strokeStyle;
//         ctx.lineWidth = width / scale;
//         break;
//     }
//   };

//   /**
//    * @returns {object} actions
//    */
//   const drawAction = {
//     line: (ctx, { startX, startY, endX, endY }) => {
//       ctx.beginPath();
//       ctx.moveTo(startX, startY);
//       ctx.lineTo(endX, endY);
//       ctx.stroke();
//     },
//     curve: (ctx, { x, y }, paths) => {
//       ctx.beginPath();
//       ctx.moveTo(x, y);
//       paths.forEach(({ x, y }) => {
//         ctx.lineTo(x, y);
//       });
//       ctx.stroke();
//     },
//     square: (ctx, { startX, startY, endX, endY }) => {
//       ctx.beginPath();
//       ctx.rect(startX, startY, endX - startX, endY - startY);
//       ctx.stroke();
//     },
//   };

//   /**
//    * 저장된 Element 그리기
//    * @param {object} ctx
//    * @param {object[]} elements
//    * @param {string} lineColor
//    * @param {number} lineWidth
//    */
//   const drawElement = (ctx, elements) => {
//     elements.forEach((element) => {
//       const { editMode, color, width, history } = element;
//       setLineStyle(ctx, editMode, color, width);

//       switch (editMode) {
//         case EditMode.STRAIGHT_LINE:
//           drawAction.line(ctx, element);
//           break;
//         case EditMode.FREE_DRAW:
//         case EditMode.ERASE:
//           drawAction.curve(ctx, history[0], history);
//           break;
//         case EditMode.INSERT_SQUARE:
//         case EditMode.CROP:
//           drawAction.square(ctx, element);
//           break;
//         default:
//       }
//     });
//   };

//   /**
//    * @param {object} imageData - 기존 이미지
//    * @param {number} width - 새롭게 그려질 이미지의 width
//    * @param {number} height - 새롭게 그려질 이미지의 height
//    * @returns {object} newImageData - 새로운 이미지
//    */
//   const copyImage = (imageData, width, height) => {
//     const { data, width: oldWidth, height: oldHeight } = imageData;

//     // 새로운 크기로 이미지 데이터 생성
//     const newWidth = width;
//     const newHeight = height;
//     const newImageData = new ImageData(newWidth, newHeight);
//     const newData = newImageData.data;

//     // 가로, 세로 비율 계산
//     const scaleX = oldWidth / newWidth;
//     const scaleY = oldHeight / newHeight;

//     // 효율적인 반복문을 사용하여 이미지 데이터 조정
//     for (let y = 0; y < newHeight; y++) {
//       for (let x = 0; x < newWidth; x++) {
//         // 현재 좌표를 이용하여 원본 이미지 데이터의 인덱스 계산
//         const sourceX = Math.floor(x * scaleX);
//         const sourceY = Math.floor(y * scaleY);
//         const sourceIndex = (sourceY * oldWidth + sourceX) * 4;

//         // 새로운 이미지 데이터의 인덱스 계산
//         const targetIndex = (y * newWidth + x) * 4;

//         // 원본 이미지 데이터의 픽셀을 새로운 이미지 데이터에 복사
//         newData[targetIndex] = data[sourceIndex];
//         newData[targetIndex + 1] = data[sourceIndex + 1];
//         newData[targetIndex + 2] = data[sourceIndex + 2];
//         newData[targetIndex + 3] = data[sourceIndex + 3];
//       }
//     }

//     return newImageData;
//   };

//   /** 나누어진 canvas 합치기 */
//   const getMergedCanvas = (elements) => {
//     // 캔버스 합치기용 캔버스 생성
//     const mergedCanvas = document.createElement('canvas');
//     const mergedCtx = mergedCanvas.getContext('2d');

//     // 캔버스 합치기용 캔버스 크기 설정
//     mergedCanvas.width = window.innerWidth;
//     mergedCanvas.height = window.innerHeight;

//     const container = document.getElementsByClassName('canvas-container');
//     const children = container[0].childNodes;

//     // 각 캔버스의 이미지 데이터를 합친 캔버스에 그리기
//     children.forEach((canvas) => {
//       mergedCtx.drawImage(canvas, 0, 0);
//       drawElement(
//         mergedCtx,
//         elements.filter(({ editMode }) => editMode !== EditMode.CROP)
//       );
//     });

//     return mergedCanvas;
//   };

//   const cropImage = () => {
//     // 크롭 박스 제거
//     const elementsCopy = [...elements];
//     const { startX, startY, endX, endY } = elementsCopy.pop();

//     const canvas = backgroundRef.current;
//     const mergedCanvas = getMergedCanvas(elementsCopy);
//     const mergedCtx = mergedCanvas.getContext('2d');

//     const x1 = startX;
//     const y1 = startY;
//     const x2 = endX - startX;
//     const y2 = endY - startY;

//     const imageData = mergedCtx.getImageData(x1, y1, x2, y2);
//     const newImageData = copyImage(imageData, canvas.width, canvas.height);
//     mergedCtx.putImageData(newImageData, 0, 0);

//     const cropedImage = mergedCanvas.toDataURL('image/png');
//     img.src = cropedImage;
//     setElements([]);
//     handleChangeMode(EditMode.DEFAULT);
//   };

//   const mouseDownAction = (e) => {
//     const { x, y } = getPosition(e);

//     switch (editMode) {
//       case EditMode.FREE_DRAW:
//       case EditMode.ERASE:
//         setCurrentCurve((prevState) => [...prevState, { x, y }]);
//         break;
//       case EditMode.CROP:
//       case EditMode.STRAIGHT_LINE:
//       case EditMode.INSERT_SQUARE:
//         setElements((prevState) => [...prevState, createElement(x, y, x, y)]);
//         break;

//       case EditMode.SELECTOR:
//         setStartViewPosOffset({ x, y });
//         break;

//       default:
//         break;
//     }
//   };

//   const mouseMoveAction = (e) => {
//     const { x, y } = getPosition(e);

//     switch (editMode) {
//       case EditMode.FREE_DRAW:
//       case EditMode.ERASE:
//         setCurrentCurve((prevState) => [...prevState, { x, y }]);
//         break;
//       case EditMode.CROP:
//       case EditMode.STRAIGHT_LINE:
//       case EditMode.INSERT_SQUARE:
//         let elementsCopy = [...elements];
//         const { startX, startY } = elementsCopy[elementsCopy.length - 1];
//         elementsCopy[elementsCopy.length - 1] = createElement(startX, startY, x, y);
//         setElements(elementsCopy);
//         break;
//       case EditMode.SELECTOR:
//         const deltaX = x - startViewPosOffset.x;
//         const deltaY = y - startViewPosOffset.y;
//         setViewPosOffset({ x: viewPosOffset.x + deltaX, y: viewPosOffset.y + deltaY });
//         break;
//       default:
//         break;
//     }
//   };

//   const mouseUpAction = (e) => {
//     switch (editMode) {
//       case EditMode.CROP:
//         cropImage();
//         break;
//       case EditMode.FREE_DRAW:
//         setCurrentCurve([]);
//         setElements((prevState) => [...prevState, createElement(null, null, null, null, currentCurve)]);
//         break;

//       case EditMode.ERASE:
//         setCurrentCurve([]);
//         setElements((prevState) => [...prevState, createElement(null, null, null, null, currentCurve)]);
//         handleChangeMode(EditMode.DEFAULT);
//         break;

//       default:
//         break;
//     }
//   };

//   //#endregion ============================================================================================================

//   // useEffect(() => {
//   //   const addr = 'https://img.lovepik.com/bg/20240209/The-Background-of-an-Anatomy-of-the-Human-Body_3366559_wh860.jpg!/fw/860';
//   //   const canvas = backgroundRef.current;
//   //   const ctx = canvas.getContext('2d');
//   //   img.onload = () => {
//   //     // const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
//   //     // const scaledWidth = img.width * scaleFactor;
//   //     // const scaledHeight = img.height * scaleFactor;
//   //     // ctx.drawImage(img, canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8);
//   //     ctx.drawImage(img, 0, canvas.height * 0.1, canvas.width, canvas.height);
//   //   };
//   //   img.src = addr;
//   // }, []);

//   useLayoutEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     const scaleOffsetX = (canvas.width * scale - canvas.width) / 2;
//     const scaleOffsetY = (canvas.height * scale - canvas.height) / 2;
//     setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

//     ctx.save();
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.setTransform(scale, 0, 0, scale, viewPosOffset.x * scale - scaleOffsetX, viewPosOffset.y * scale - scaleOffsetY);

//     drawElement(ctx, elements);
//     if (currentCurve.length > 0) {
//       setLineStyle(ctx);
//       drawAction.curve(ctx, currentCurve[0], currentCurve);
//     }
//     ctx.restore();

//     const backgroundCanvas = backgroundRef.current;
//     const backgroundCtx = backgroundCanvas.getContext('2d');

//     backgroundCtx.reset();
//     backgroundCtx.setTransform(scale, 0, 0, scale, viewPosOffset.x * scale - scaleOffsetX, viewPosOffset.y * scale - scaleOffsetY);
//     backgroundCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
//   }, [elements, currentCurve, viewPosOffset, scale]);

//   /** custom hook */
//   useWindowEventListener('keydown', (e) => {
//     if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
//   });

//   //#region handler

//   /** 초기화 버튼 */
//   const handleClearRect = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     ctx.reset();
//     setElements([]);
//     setScale(1);
//     setViewPosOffset({ x: 0, y: 0 });
//     setScaleOffset({ x: 0, y: 0 });
//     // cropImgRef.current = null;
//     // img = new Image();
//   };

//   /** canvas onMouseMove */
//   const hanldeMouseMove = (e) => {
//     if (!isDrawing) return;
//     mouseMoveAction(e);
//   };

//   /** canvas onMouseDown */
//   const handleMouseDown = (e) => {
//     setIsDrawing(true);
//     mouseDownAction(e);
//   };

//   /** canvas onMouseUp */
//   const handleMouseUp = (e) => {
//     setIsDrawing(false);
//     setStartViewPosOffset({ x: 0, y: 0 });
//     mouseUpAction(e);
//   };

//   /** 선 색상 변경 */
//   const handleColorPickerChange = (e) => setLineColor(e.target.value);

//   /** Undo - elements 제거 */
//   const handleUndo = () => {
//     const elementsCopy = [...elements];
//     if (elements.length > 0) {
//       elementsCopy.pop();
//     } else {
//       handleClearRect();
//     }
//     setElements(elementsCopy);
//   };

//   /** 선 굵기 드랍다운 */
//   const handleToggleLineDrop = () => {
//     setLineDrop((prevState) => {
//       return {
//         ...lineDrop,
//         isOpen: !prevState.isOpen,
//       };
//     });
//   };

//   /** 선 굵기 선택 */
//   const handleSelectLineDrop = (e) => {
//     const { value } = e.target;

//     setLineDrop({
//       isOpen: false,
//       lineWidth: value,
//       lineWidthImgTag: React.createElement('span', { className: `line-${value + 1} line` }),
//     });
//   };

//   /** 이미지 업로드 */
//   const handleImageUpload = (e) => {
//     if (e.target.files.length === 0) return;

//     const canvas = backgroundRef.current;
//     const image = e.target.files[0];
//     console.debug('image:', image);

//     const ctx = canvas.getContext('2d');
//     setScale(1);
//     setViewPosOffset({ x: 0, y: 0 });
//     setScaleOffset({ x: 0, y: 0 });
//     img.onload = () => {
//       // const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
//       // const scaledWidth = img.width * scaleFactor;
//       // const scaledHeight = img.height * scaleFactor;
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     };
//     img.src = URL.createObjectURL(image);
//     e.target.value = '';
//   };

//   /** 드로우 타입 선택 */
//   const handleChangeMode = (mode) => {
//     setEditMode(mode);
//   };

//   /** 이미지 다운로드 */
//   const handleImageDownload = (e) => {
//     const mergedCanvas = getMergedCanvas(elements);
//     // 이미지로 변환하여 저장
//     const imageDataURL = mergedCanvas.toDataURL('image/png');

//     // 가상 링크 생성
//     const link = document.createElement('a');
//     link.href = imageDataURL;
//     link.download = 'kkk.png';

//     // 클릭 이벤트 발생시키기
//     link.click();
//   };

//   /** 줌 휠 */
//   const handleWheel = (e) => setScale((prevState) => (e.deltaY > 0 ? Math.min(prevState + 0.1, 2) : Math.max(prevState - 0.1, 0.1)));

//   // const handleWheel = (e) => {
//   //   const { offsetX, offsetY } = e.nativeEvent;
//   //   e.preventDefault();
//   //   const xs = (offsetX - viewPosRef.current.x) / scaleRef.current;
//   //   const ys = (offsetY - viewPosRef.current.y) / scaleRef.current;
//   //   const delta = -e.deltaY;
//   //   const newScale = delta > 0 ? scaleRef.current * 1.2 : scaleRef.current / 1.2;

//   //   if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
//   //     scaleRef.current = newScale;
//   //     viewPosRef.current = {
//   //       x: offsetX - xs * scaleRef.current,
//   //       y: offsetY - ys * scaleRef.current,
//   //     };
//   //   }
//   //   draw();
//   // };
//   // const handleWheel = (e) => {
//   //   const { offsetX, offsetY } = e.nativeEvent;
//   //   e.preventDefault();
//   //   const xs = (offsetX - viewPosRef.current.x) / scaleRef.current;
//   //   const ys = (offsetY - viewPosRef.current.y) / scaleRef.current;
//   //   const delta = -e.deltaY;
//   //   const newScale = delta > 0 ? scaleRef.current * 1.2 : scaleRef.current / 1.2;

//   //   if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
//   //     scaleRef.current = newScale;
//   //     viewPosRef.current = {
//   //       x: offsetX - xs * scaleRef.current,
//   //       y: offsetY - ys * scaleRef.current,
//   //     };
//   //   }
//   //   draw();
//   // };

//   //#endregion

//   return (
//     <>
//       <div className='img-edit'>
//         <div className='tool'>
//           <div className='flex-start'>
//             <button className='btn-edit'>편집</button>
//             <button
//               className='btn-clear'
//               onClick={handleClearRect}>
//               초기화
//             </button>
//             <button
//               className='btn-selection'
//               data-for='btnTooltip'
//               data-tip='선택'
//               onClick={() => {
//                 handleChangeMode(EditMode.SELECTOR);
//               }}>
//               ✋
//             </button>
//             <button
//               className='btn-line-str'
//               data-for='btnTooltip'
//               data-tip='직선'
//               onClick={() => {
//                 handleChangeMode(EditMode.STRAIGHT_LINE);
//               }}></button>
//             <button
//               className='btn-line'
//               data-for='btnTooltip'
//               data-tip='곡선'
//               onClick={() => {
//                 handleChangeMode(EditMode.FREE_DRAW);
//               }}></button>
//             <button
//               className='btn-square'
//               data-for='btnTooltip'
//               data-tip='네모'
//               onClick={() => {
//                 handleChangeMode(EditMode.INSERT_SQUARE);
//               }}></button>
//             <button
//               className='btn-crop'
//               data-for='btnTooltip'
//               data-tip='크롭'
//               onClick={() => {
//                 setScale(1);
//                 setViewPosOffset({ x: 0, y: 0 });
//                 setScaleOffset({ x: 0, y: 0 });
//                 handleChangeMode(EditMode.CROP);
//               }}></button>
//             <button
//               className='btn-edit-del'
//               data-for='btnTooltip'
//               data-tip='지우개'
//               onClick={(e) => {
//                 handleChangeMode(EditMode.ERASE);
//               }}></button>
//             <button className='btn-color'>
//               선 색상
//               <input
//                 type='color'
//                 className='colorPicker'
//                 name='colorPicker'
//                 value={lineColor}
//                 onChange={handleColorPickerChange}
//               />
//             </button>
//             <button className='btn-line-bold'>
//               선 굵기
//               <div className='drop-list-wrap'>
//                 <p
//                   className={`drop-list-btn ${lineDrop.isOpen ? 'on' : ''}`}
//                   onClick={handleToggleLineDrop}>
//                   {lineDrop.lineWidth}pt
//                   {lineDrop.lineWidthImgTag}
//                   <img
//                     src={lineDrop.isOpen ? icArrUp : icArrDown}
//                     alt=''
//                   />
//                 </p>
//                 {lineDrop.isOpen && (
//                   <ul
//                     className='drop-list'
//                     onClick={handleSelectLineDrop}>
//                     <li value={1}>
//                       1pt<span className='line-2 line'></span>
//                     </li>
//                     <li value={2}>
//                       2pt<span className='line-3 line'></span>
//                     </li>
//                     <li value={3}>
//                       3pt<span className='line-4 line'></span>
//                     </li>
//                     <li value={4}>
//                       4pt<span className='line-5 line'></span>
//                     </li>
//                     <li value={5}>
//                       5pt<span className='line-6 line'></span>
//                     </li>
//                   </ul>
//                 )}
//               </div>
//             </button>
//             <button
//               className='btn-image-upload'
//               onClick={() => {
//                 inputRef.current.click();
//               }}>
//               이미지 업로드
//               <input
//                 ref={inputRef}
//                 id='image-upload'
//                 type='file'
//                 accept='image/*'
//                 onChange={handleImageUpload}
//               />
//             </button>
//             <button
//               className='btn-image-upload'
//               onClick={handleImageDownload}>
//               이미지 다운로드
//             </button>
//             <div>
//               <button>-</button>
//               <span>{new Intl.NumberFormat('en-GB', { style: 'percent' }).format(scale)}</span>
//               <button
//                 onClick={() => {
//                   console.log('clicked!');
//                 }}>
//                 +
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         className='canvas-container'
//         onWheel={handleWheel}>
//         <canvas
//           className={`canvas`}
//           ref={canvasRef}
//           width={window.innerWidth}
//           height={window.innerHeight}
//           onMouseMove={hanldeMouseMove}
//           onMouseDown={handleMouseDown}
//           onMouseUp={handleMouseUp}
//         />
//         <canvas
//           className={`canvas_background`}
//           ref={backgroundRef}
//           width={window.innerWidth}
//           height={window.innerHeight}
//           //   onMouseMove={hanldeMouseMove}
//           //   onMouseDown={handleMouseDown}
//           //   onMouseUp={handleMouseUp}
//         />
//       </div>
//     </>
//   );
// };

// //#endregion ==============================================================================================================

// export default ImageViewer;
