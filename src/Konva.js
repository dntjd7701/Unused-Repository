import React, { useEffect } from 'react';

const Konva = () => {
  useEffect(() => {
    // 먼저 스테이지를 생성해야 합니다.
    const stage = new Konva.Stage({
      컨테이너: 'container', // 컨테이너 id <div>
      width: 500,
      height: 500,
    });

    // 레이어를 생성합니다.
    const layer = new Konva.Layer();

    // 모양 만들기
    const circle = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 70,
      fill: 'red',
      스트로크: 'black',
      스트로크폭: 4,
    });

    // 레이어에 모양을 추가합니다.
    layer.add(circle);

    // 스테이지에 레이어를 추가합니다.
    stage.add(layer);

    // 이미지 그리기
    layer.draw();
  }, []);

  return <div>Konva</div>;
};

export default Konva;
