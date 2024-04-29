// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import ImageEditor from './components/ImageEditor';

// /** imgs */
// import icArrDown from './imgs/ic_arrdown@3x.png';
// import icArrUp from './imgs/ic_arrow_up_normal@3x.png';
// import temp_undo from './imgs/ic_arrow_left_01_m_disable@2x.png';

// const useWindowEventListener = (type, listener, options) => {
//   useEffect(() => {
//     window.addEventListener(type, listener, options);
//     return () => {
//       window.removeEventListener(type, listener, options);
//     };
//   }, [type, listener, options]);
// };

// function ImageViewer() {
//   const EditMode = {
//     DEFAULT: 'default',
//     STRAIGHT_LINE: 'straightLine',
//     INSERT_CIRCLE: 'insertCircle',
//     INSERT_SQUARE: 'insertSquare',
//     INSERT_TRIANGLE: 'inserTriangle',
//     CROP: 'crop',
//     LEFT_ROTATE: 'left',
//     RIGHT_ROTATE: 'right',
//     FREE_DRAW: 'freeDraw',
//     ERASE: 'erase',
//     MEASURE: 'measure',
//     COMPARE: 'compare',
//   };

//   let painting = false;
//   let startX,
//     startY = 0;
//   let zoom = 1;
//   let zoomCnt = 0;

//   /** state */
//   const [canvasSize, setCanvasSize] = useState({
//     width: 0,
//     height: 0,
//   });
//   const [canvas, setCanvas] = useState(null);
//   const [editMode, setEditMode] = useState(EditMode.FREE_DRAW);

//   /** state */
//   const [lineColor, setLineColor] = useState('#2c2c2c');
//   // 선굵기
//   const [lineDrop, setLineDrop] = useState({
//     isOpen: false,
//     lineWidth: 1,
//     lineWidthImgTag: <span className='line-2 line'></span>,
//   });

//   /** ref */
//   const inputRef = useRef(null);
//   const historyRef = useRef([]); // useRef를 사용하여 초기화_undo 효과를 위한 히스토리 작업
//   const canvasRef = useRef(null);
//   const canvasContainer = useCallback((ref) => {
//     setCanvasSize({
//       width: ref?.offsetWidth,
//       height: ref?.offsetHeight,
//     });
//   }, []);

//   /** custom hook */
//   useWindowEventListener('keydown', (e) => {
//     if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
//   });

//   /** useEffect */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       canvas.width = canvasSize.width;
//       canvas.height = canvasSize.height;

//       const ctx = canvas.getContext('2d');
//       ctx.strokeStyle = lineColor;
//       ctx.lineWidth = lineDrop.lineWidth;
//     }

//     setCanvas(canvas);
//   }, [canvasSize]);

//   useEffect(() => {
//     if (canvas) {
//       canvas.addEventListener('mousemove', handleMouseMove);
//       canvas.addEventListener('mousedown', handleMouseDown);
//       canvas.addEventListener('mouseup', handleMouseUp);
//     }
//     return () => {
//       if (canvas) {
//         canvas.removeEventListener('mousemove', handleMouseMove);
//         canvas.removeEventListener('mousedown', handleMouseDown);
//         canvas.removeEventListener('mouseup', handleMouseUp);
//       }
//     };
//   }, [canvas, editMode]);

//   const drawStraight = (endX, endY) => {
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
//     if (Array.isArray(historyRef.current) && historyRef.current.length > 0) {
//       ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
//     }
//     ctx.beginPath();
//     ctx.moveTo(startX, startY);
//     ctx.lineTo(endX, endY);
//     ctx.stroke();
//   };

//   const handleMouseMove = (e) => {
//     const ctx = canvas.getContext('2d');
//     const rect = canvas.getBoundingClientRect();
//     const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

//     if (ctx) {
//       if (!painting) {
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//       } else {
//         switch (editMode) {
//           case EditMode.STRAIGHT_LINE:
//             drawStraight(x, y);
//             break;
//           default:
//             ctx.lineTo(x, y);
//             ctx.stroke();
//             break;
//         }
//       }
//     }
//   };

//   const handleMouseDown = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
//     startX = x;
//     startY = y;
//     painting = true;
//   };

//   const handleMouseUp = (e) => {
//     const ctx = canvas.getContext('2d');
//     historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
//     painting = false;
//   };

//   const handleChangeMode = (mode) => {
//     setEditMode(mode);
//   };

//   const handleClearCanvas = () => {
//     const context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
//     historyRef.current = [];
//   };

//   const handleUndo = () => {
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
//     console.debug('historyRef:', historyRef);
//     historyRef.current.pop();
//     if (historyRef.current.length > 0) {
//       ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
//       ctx.stroke();
//     }
//   };

//   const handleImageUpload = (e) => {
//     const image = e.target.files[0]; // 업로드된 파일 가져오기
//     const img = new Image();
//     img.onload = () => {
//       const ctx = canvas.getContext('2d');
//       const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
//       const scaledWidth = img.width * scaleFactor;
//       const scaledHeight = img.height * scaleFactor;
//       ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

//       historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
//     };
//     img.src = URL.createObjectURL(image);

//     e.target.value = '';
//   };

//   const handleZoomIn = () => {
//     // const ctx = canvas.getContext('2d');
//     // const imageData = historyRef.current[historyRef.current.length - 1];
//     // ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
//     // setCanvasSize({
//     //   width: canvasSize.width * 1.5,
//     //   height: canvasSize.height * 1.5,
//     // });
//     // ctx.putImageData(imageData, 0, 0, 50, 0, 24, 24);
//     // ctx.stroke();
//     // console.log(historyRef.current);
//     // ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
//     // ctx.stroke();
//     // setCanvas({
//     //   width: canvasSize.width * 2,
//     //   height: canvasSize.height * 2,
//     // });
//     // ctx.setTransform(0, 2, 2, 0, 0, 0);
//     // // ctx.transs
//     // // setCanvasSize({
//     // //   width: canvasSize.width * 2,
//     // //   height: canvasSize.height * 2
//     // // })
//   };

//   const handleColorPickerChange = (e) => {
//     const ctx = canvas.getContext('2d');
//     ctx.strokeStyle = e.target.value;
//     setLineColor(e.target.value);
//   };

//   const handleToggleLineDrop = () => {
//     setLineDrop((prevState) => {
//       return {
//         ...lineDrop,
//         isOpen: !prevState.isOpen,
//       };
//     });
//   };

//   const handleSelectLineDrop = (e) => {
//     const { value } = e.target;
//     const ctx = canvas.getContext('2d');
//     ctx.lineWidth = value;

//     setLineDrop({
//       isOpen: false,
//       lineWidth: value,
//       lineWidthImgTag: React.createElement('span', { className: `line-${value + 1} line` }),
//     });
//   };

//   return (
//     <>
//       <div className='img-edit'>
//         <div className='tool'>
//           <div className='flex-start'>
//             <button className='btn-edit'>편집</button>
//             <button
//               className='btn-clear'
//               onClick={handleClearCanvas}>
//               초기화
//             </button>
//             <button
//               className='btn-line-str'
//               data-for='btnTooltip'
//               data-tip='직선'
//               onClick={(e) => handleChangeMode(EditMode.STRAIGHT_LINE)}></button>
//             <button
//               className='btn-line'
//               data-for='btnTooltip'
//               data-tip='곡선'
//               onClick={(e) => handleChangeMode(EditMode.FREE_DRAW)}></button>
//             {/* <button
//             className='btn-circle'
//             data-for='btnTooltip'
//             data-tip='원'
//             //   onClick={(e) => handleChangeEditMode(EditMode.INSERT_CIRCLE)}
//           ></button>
//           <button
//             className='btn-square'
//             data-for='btnTooltip'
//             data-tip='사각형'
//             // onClick={(e) => handleChangeEditMode(EditMode.INSERT_SQUARE)}
//           ></button>
//           <button
//             className='btn-triangle'
//             data-for='btnTooltip'
//             data-tip='삼각형'
//             // onClick={(e) => handleChangeEditMode(EditMode.INSERT_TRIANGLE)}
//           ></button>
//           <button
//             className='btn-crop'
//             data-for='btnTooltip'
//             data-tip='크롭'
//             //   onClick={(e) => handleChangeEditMode(EditMode.CROP)}
//           ></button>
//           <button
//             className='btn-lotate-left'
//             data-for='btnTooltip'
//             data-tip='좌회전'
//             //   onClick={(e) => rotate(EditMode.LEFT_ROTATE)}
//           ></button>
//           <button
//             className='btn-lotate-right'
//             data-for='btnTooltip'
//             data-tip='우회전'
//             //   onClick={(e) => rotate(EditMode.RIGHT_ROTATE)}
//           ></button> */}
//             <button
//               className='btn-edit-del'
//               data-for='btnTooltip'
//               data-tip='지우개'
//               //   onClick={(e) => handleRemoveObject(e, EditMode.ERASE)}
//             ></button>
//             {/* <button
//             className='btn-ruler'
//             //   onClick={(e) => handleChangeEditMode(EditMode.MEASURE)}
//           >
//             측정<span></span>
//           </button> */}
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
//             {/* <button className='btn-color'> */}
//             {/* 채우기 */}
//             {/* <span
//               className='colorPicker'
//               onClick={(e) => {
//                 // setFillColor((prevFillColor) => ({
//                 //   ...prevFillColor,
//                 //   isOpen: !prevFillColor.isOpen,
//                 // }));
//               }}
//             >
//               <em style={{ backgroundColor: fillColor.color }}></em>
//               <img src={icArrDown} alt='' />
//               {fillColor.isOpen && (
//                 <OBTColorPicker
//                   value={fillColor.color}
//                   onChange={(e) => {
//                     setFillColor({
//                       isOpen: false,
//                       color: e.value.hex,
//                     });
//                   }}
//                 />
//               )}
//             </span> */}
//             {/* </button> */}
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
//               className='btn-undo-bold'
//               onClick={handleUndo}>
//               뒤로
//               <img
//                 src={temp_undo}
//                 alt=''
//               />
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
//               className='btn-zoom-in'
//               onClick={() => {
//                 // 현재 캔버스의 크기를 가져옵니다.
//                 const { width, height } = canvas.getBoundingClientRect();
//                 // console.debug('height:', height);
//                 // console.debug('width:', width);

//                 // let width = 1166;
//                 // let height = 934;

//                 // 현재 캔버스의 너비와 높이를 2배로 설정하여 확대 효과 적용
//                 canvas.style.width = `${width * 1.2}px`;
//                 canvas.style.height = `${height * 1.2}px`;
//               }}>
//               확대
//             </button>
//             <button
//               className='btn-zoom-in'
//               onClick={() => {
//                 // 현재 캔버스의 크기를 가져옵니다.
//                 const { width, height } = canvas.getBoundingClientRect();
//                 // let width = 1166;
//                 // let height = 934;

//                 // 현재 캔버스의 너비와 높이를 2배로 설정하여 확대 효과 적용
//                 canvas.style.width = `${width * 0.8}px`;
//                 canvas.style.height = `${height * 0.8}px`;
//               }}>
//               축소
//             </button>
//             <div className='flex-end'>
//               {/* <OBTButton imageUrl={icPrint} width='27px' height='27px' onClick={handlePrint} />
//           <OBTButton imageUrl={icDownload} width='27px' height='27px' onClick={() => saveImage('compare')} /> */}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div
//         className='canvas-container'
//         ref={canvasContainer}>
//         <canvas
//           id='canvas'
//           ref={canvasRef}
//         />
//       </div>
//     </>
//   );
// }

// export default ImageViewer;

// // useWindowEventListener('keydown', (e) => {
// //   if (e.key === 'z' && (e.ctrlKey || e.metaKey)) undo();
// // });
