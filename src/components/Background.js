import React from 'react';

const Background = ({ backgroundRef }) => {
  return (
    <canvas
      className={`canvas_background`}
      ref={backgroundRef}
      width={window.innerWidth}
      height={window.innerHeight}
      //   onMouseMove={hanldeMouseMove}
      //   onMouseDown={handleMouseDown}
      //   onMouseUp={handleMouseUp}
    />
  );
};

export default Background;
