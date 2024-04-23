// import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import './ImageViewer/ImageViewer.scss';
// import ImageEditor from './components/ImageEditor';
// import './woosung.scss';

// const CTA0010 = () => {
//   let painting = false;
//   let startX,
//     startY = 0;

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

//   /** state */
//   const [ctx, setCtx] = useState(null);
//   const [canvasSize, setCanvasSize] = useState({
//     width: 0,
//     height: 0,
//   });
//   const [editMode, setEditMode] = useState(EditMode.FREE_DRAW);

//   /** ref */
//   const canvasRef = useRef(null);
//   const canvasContainerCallbackRef = useCallback((container) => {
//     if (!!container) {
//       setCanvasSize({
//         width: container.offsetWidth,
//         height: container.offsetHeight,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;

//     if (canvas) {
//       const ctx = canvas.getContext('2d');
//       setCtx(ctx);
//       canvas.addEventListener('mousemove', handleMouseMove);
//       canvas.addEventListener('mousedown', handleMouseDown);
//       canvas.addEventListener('mouseup', handleMouseUp);
//     }

//     return () => {
//       canvas.removeEventListener('mousemove', handleMouseMove);
//       canvas.removeEventListener('mousedown', handleMouseDown);
//       canvas.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [ctx, editMode]);

//   const handleMouseMove = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];

//     if (ctx) {
//       if (!painting) {
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//       } else {
//         if (editMode === EditMode.STRAIGHT_LINE) {
//           drawStraight(x, y);
//         } else if (editMode === EditMode.FREE_DRAW) {
//           ctx.lineTo(x, y);
//           ctx.stroke();
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
//     painting = false;
//   };

//   const handleChangeMode = (mode) => {
//     setEditMode(mode);
//   };

//   const drawStraight = (endX, endY) => {
//     const canvas = canvasRef.current;
//     ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전에 그린 그림 지우기
//     ctx.beginPath();
//     ctx.moveTo(startX, startY);
//     ctx.lineTo(endX, endY);
//     ctx.stroke();
//   };

//   return (
//     <>
//       <ImageEditor
//         ctx={ctx}
//         onChangeMode={handleChangeMode}
//       />
//       <div
//         className='canvas-container'
//         ref={canvasContainerCallbackRef}>
//         <canvas
//           id='canvas'
//           ref={canvasRef}
//           width={canvasSize.width}
//           height={canvasSize.height}
//         />
//       </div>
//     </>
//   );
// };

// export default CTA0010;
