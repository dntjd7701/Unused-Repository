// import React, { useRef, useEffect } from 'react';

// const img = new Image();
// const INITIAL_POSITION = { x: 0, y: 0 };
// const MIN_SCALE = 0.1;
// const MAX_SCALE = 10;

// function Background() {
//   const zoomCanvasRef = useRef(null);
//   const scaleRef = useRef(1);
//   const panningRef = useRef(false);
//   const viewPosRef = useRef(INITIAL_POSITION);
//   const startPosRef = useRef(INITIAL_POSITION);

//   const setTransform = () => {
//     const zoomCanvas = zoomCanvasRef.current;
//     const context = zoomCanvas.getContext('2d');
//     context.setTransform(scaleRef.current, 0, 0, scaleRef.current, viewPosRef.current.x, viewPosRef.current.y);
//   };

//   const draw = () => {
//     const zoomCanvas = zoomCanvasRef.current;
//     const context = zoomCanvas.getContext('2d');
//     zoomCanvas.width = zoomCanvas.width;
//     setTransform();
//     context.drawImage(img, 0, 0, zoomCanvas.width, zoomCanvas.height);
//   };

//   useEffect(() => {
//     img.src = 'https://anatomykorea.com/web/product/big/202202/79f42c6988ee4c7d1f2371776b11cf24.jpg';

//     // Load image
//     img.onload = function () {
//       draw();
//     };
//   }, []);

//   const handleMouseDown = (e) => {
//     const { offsetX, offsetY } = e.nativeEvent;
//     e.preventDefault();
//     startPosRef.current = {
//       x: offsetX - viewPosRef.current.x,
//       y: offsetY - viewPosRef.current.y,
//     };
//     panningRef.current = true;
//   };

//   const handleMouseUp = (e) => {
//     panningRef.current = false;
//   };

//   const handleMouseMove = (e) => {
//     const { offsetX, offsetY } = e.nativeEvent;
//     e.preventDefault();
//     if (!panningRef.current) {
//       return;
//     }
//     viewPosRef.current = {
//       x: offsetX - startPosRef.current.x,
//       y: offsetY - startPosRef.current.y,
//     };
//     draw();
//   };

//   const handleWheel = (e) => {
//     const { offsetX, offsetY } = e.nativeEvent;
//     e.preventDefault();
//     const xs = (offsetX - viewPosRef.current.x) / scaleRef.current;
//     const ys = (offsetY - viewPosRef.current.y) / scaleRef.current;
//     const delta = -e.deltaY;
//     const newScale = delta > 0 ? scaleRef.current * 1.2 : scaleRef.current / 1.2;

//     if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
//       scaleRef.current = newScale;
//       viewPosRef.current = {
//         x: offsetX - xs * scaleRef.current,
//         y: offsetY - ys * scaleRef.current,
//       };
//     }
//     draw();
//   };

//   return (
//     <canvas
//       ref={zoomCanvasRef}
//       width={window.innerWidth}
//       height={window.innerHeight}
//       style={{ border: ' 1px solid' }}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onWheel={handleWheel}
//     />
//   );
// }
// export default Background;
