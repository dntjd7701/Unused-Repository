### 시작하기

```linux
npm init
npm i typescript
touch tyconfig.json
mkdir src
cd src
    "test": "echo \"Error: no test specified\" && exit 1"
touch index.ts
```

### tsconfig 설정하기

```json
{
   "include": ["src"], // ts파일을 컴파일할 위치  (src 폴더 하위 모든 파일)
   "compilerOptions": {
      // 컴파일 옵션
      "outDir": "build", // 컴파일된 자바스크립트 파일이 위치할 곳
      "target": "ES6", // 자바스크립트로 컴파일 시, 적용할 버전
      "lib": ["ES6", "DOM"] // 어떤 API를 사용할지, 어떤 환경에서 사용할지 선언함으로서 자동완성 기능 지원
   }
}
```

### 편한 개발 환경을 위한 ts-node 설치

```linux
npm i -D ts-node
```

```json
...
"scripts": {
  "build": "tsc",
  "dev": "ts-node src/index.ts",
  "start": "node build/index.js"
},
...
```

매번 빌드 후 실행하는 번거로움을 해소하기 위해 설치

### 소스 수정 시 바로 반영 nodemon

```linux
npm i nodemon
```

소스의 수정 후, 서버를 재시작할 필요 없이 바로 반영할 수 있도록 하기 위해 사용

```json
...
"scripts": {
  "build": "tsc",
  "dev": "nodemon --exec ts-node src/index.ts",
  "start": "node build/index.js"
},
...
```

---

hash값 생성을 위해
crypto 사용

---

### Ref

https://nomadcoders.co/typescript-for-beginners/lectures/3686
