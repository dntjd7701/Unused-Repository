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

javascript로 작성된 패키지를 import해서 사용할 때, TypeScript의 타입 정의를 받고 싶을 땐,
Definitely Type 레포를 이용할 수 있다.

Definitely Type 여러 명의 자원봉사자와 같은 개발자들이 각 JS로 개발된 패키지를 분석하여 정의해놓은 레파지토리이다.

.d.ts 파일을 정의함으로서 TypeScript의 보호와 정의를 받을 수 있는데 위의 레파지토리를 이용하여 .d.ts 파일을 정의할 수 있다.

위의 레파지토리를 통해 파일을 복사하여 붙여넣어도 되겠지만, 콘솔을 통해 다운받을 수 있는 좋은 방법이 있다.

```linux
npm i -D @types/express
```

위와 같은 명령어를 통해 원하는 패키지의 이미 정의된 타입을 받을 수 있다.

---

### Ref

https://nomadcoders.co/typescript-for-beginners/lectures/3686
