### 시작하기

```linux
npm init
npm i typescript
touch tyconfig.json
mkdir src
cd src
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

lib: 인텔리센스를 통해 사용하려는 라이브러리의 정보를 보여준다.
target:
