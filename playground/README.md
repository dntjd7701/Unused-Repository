# Welcome to my tiny page

# 글은 마크다운 !

요즘 노트로 Obsidian을 애용하고있다. Obsidian은 MarkDown 문법의 md 파일을 사용하기에 Obsidian으로 작성한 글을 그대로 옮겨 놓기 좋을 것 같아 다음과 같은 구조를 갖추었다.

#### react-markdown 설치

```linux
yarn add react-markdown
```

#### next.config.js 설정

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
```

1.  React의 Strict Mode를 활성화

2.  .md 파일을 소스 코드로 처리할 수 있도록 Webpack 사용자 정의 이를 통해 Markdown 파일을 문자열로 쉽게 가져와 사용할 수 있다.

#### global.d.ts 설정

TypeScript에서 마크다운 파일(.md 파일)을 모듈로 인식하게 하여, 이를 코드 내에서 직접 import 할 수 있도록 하기 위해 작성

```ts
declare modults가 제대로 인식할 수 있도록 설정

## 디렉토리 구조

- `app`: app 전반에 대한 기본 view 제공
  - `[...item]/page.tsx`: `/[...item]` route의 page view. `routes`의 `key`에 매칭된 컴포넌트를 렌더링.
  - `layout.tsx`: 기본적인 html 구성
  - `page.tsx`: `/` route의 page view. `/README.md`를 보여줍니다.
  - `global.scss`: app 전반의 style
  - `gnb.tsx`: 좌측 메뉴 컴포넌트
- `components`
  - `vanillaWrapper.ts`: 독립적인 VanillaJS 환경의 wrapper 컴포넌트
- `routes.ts`: route 구성
```
