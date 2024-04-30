import React from 'react';

const Three = () => {
  // useEffect(() => {
  //   console.log(img);
  //   let canvas = document.querySelector('#threeCanvas');
  //   console.debug('canvas:', canvas);
  //   let scene = new THREE.Scene();
  //   let renderer = new THREE.WebGLRenderer({
  //     antialias: true,
  //     canvas: canvas,
  //   });
  //   scene.background = new THREE.Color('white');
  //   let light = new THREE.DirectionalLight(0xffff00, 10);
  //   scene.add(light);

  //   let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  //   // 카메라의 위치 설정 (x: 0, y: 0, z: 5)
  //   camera.position.set(0, 0, 5);

  //   let loader = new GLTFLoader();
  //   console.debug('loader:', loader);
  //   loader.load(
  //     './three/hackney_back_cab_agv/scene.gltf',
  //     (gltf) => {
  //       console.debug('gltf:', gltf);
  //     },
  //     undefined,
  //     (error) => {
  //       console.log(error);
  //     }
  //   );

  //   // // 렌더링 함수 정의
  //   // const animate = function () {
  //   //   requestAnimationFrame(animate);
  //   //   renderer.render(scene, camera);
  //   // };

  //   // // 초기 렌더링 수행
  //   // animate();
  // }, []);

  return (
    <>
      <canvas
        id='threeCanvas'
        width={window.innerWidth}
        height={window.innerHeight}></canvas>
    </>
  );
};

export default Three;
