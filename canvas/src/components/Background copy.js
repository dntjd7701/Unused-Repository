// import React, { useEffect, useLayoutEffect, useRef } from 'react';

// const Background = () => {
//   const img = new Image();
//   const backgroundRef = useRef(null);
//   const scaleRef = useRef(1);
//   const viewPosRef = useRef({ x: 0, y: 0 });

//   const setTransform = () => {
//     const zoomCanvas = backgroundRef.current;
//     const context = zoomCanvas.getContext('2d');
//     console.debug('viewPosRef:', viewPosRef);
//     console.debug('scaleRef:', scaleRef);

//     context.setTransform(scaleRef.current, 0, 0, scaleRef.current, viewPosRef.current.x, viewPosRef.current.y);
//   };

//   const draw = () => {
//     const zoomCanvas = backgroundRef.current;
//     const context = zoomCanvas.getContext('2d');
//     // zoomCanvas.width = zoomCanvas.width;
//     context.reset();
//     setTransform();
//     // context.clearRect(0, 0, zoomCanvas.width, zoomCanvas.height);
//     context.drawImage(img, 0, 0, zoomCanvas.width, zoomCanvas.height);
//   };

//   useEffect(() => {
//     img.src = 'https://anatomykorea.com/web/product/big/202202/79f42c6988ee4c7d1f2371776b11cf24.jpg';
//     // Load image
//     img.onload = function () {
//       draw();
//     };
//   }, []);

//   useLayoutEffect(() => {
//     // const canvas = canvasRef.current;
//     // const ctx = canvas.getContext('2d');
//     // const scaleOffsetX = (canvas.width * scale - canvas.width) / 2;
//     // const scaleOffsetY = (canvas.height * scale - canvas.height) / 2;
//     // setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
//     // ctx.save();
//     // ctx.clearRect(0, 0, canvas.width, canvas.height);
//     // ctx.setTransform(scale, 0, 0, scale, selectOffeset.x * scale - scaleOffsetX, selectOffeset.y * scale - scaleOffsetY);
//     // // ctx.scale(scale, scale);
//     // // ctx.translate(selectOffeset.x * scale - scaleOffsetX, selectOffeset.y * scale - scaleOffsetY);
//     // drawElement(ctx, elements);
//     // if (currentCurve.length > 0) {
//     //   setLineStyle(ctx);
//     //   drawAction.curve(ctx, currentCurve[0], currentCurve);
//     // }
//     // ctx.restore();
//     // }, [elements, currentCurve, selectOffeset, scale]);
//   }, []);

//   const handleWheel = (e) => {
//     const { offsetX, offsetY } = e.nativeEvent;
//     e.preventDefault();
//     const xs = (offsetX - viewPosRef.current.x) / scaleRef.current;
//     const ys = (offsetY - viewPosRef.current.y) / scaleRef.current;
//     const delta = -e.deltaY;
//     const newScale = delta > 0 ? scaleRef.current * 1.2 : scaleRef.current / 1.2;

//     if (newScale >= 0.1 && newScale <= 10) {
//       scaleRef.current = newScale;
//       viewPosRef.current = {
//         x: offsetX - xs * scaleRef.current,
//         y: offsetY - ys * scaleRef.current,
//       };
//     }
//     draw();
//   };

//   /** canvas onMouseMove */
//   // const hanldeMouseMove = (e) => {
//   //   if (!isDrawing) return;
//   //   mouseMoveAction(e);
//   // };

//   // /** canvas onMouseDown */
//   // const handleMouseDown = (e) => {
//   //   setIsDrawing(true);
//   //   mouseDownAction(e);
//   // };

//   // /** canvas onMouseUp */
//   // const handleMouseUp = (e) => {
//   //   setIsDrawing(false);
//   //   setSelectStartPosition({ x: 0, y: 0 });
//   //   mouseUpAction(e);
//   // };

//   return (
//     <>
//       <div
//         className='canvas-container'
//         onWheel={handleWheel}>
//         <canvas
//           className={`canvas_background`}
//           ref={backgroundRef}
//           width={window.innerWidth}
//           height={window.innerHeight}
//           onWheel={handleWheel}
//           // onMouseMove={hanldeMouseMove}
//           // onMouseDown={handleMouseDown}
//           // onMouseUp={handleMouseUp}
//         />
//       </div>
//     </>
//   );
// };

// export default Background;
