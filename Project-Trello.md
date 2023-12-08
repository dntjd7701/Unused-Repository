
## Q&A

- NextJs page에 들어오는 params 혹은 layout 파일에서의 children props와 같은 것들은 어디로부터 오는 것인가.
- 

### 2023-12-08 ~ ???

https://www.youtube.com/watch?v=pRybm9lXW2c&t=26s

### 환경설정
```
npx create-next-app@latest
npx shadcn-ui@latest init
```

  > ! 주의
  > shadcn과 nexJs의 경우, 최소 제한  node 버전이 정해져 있습니다.
  > 전  nvm을 통해  node 버전을 관리함으로 v18버전으로 업그레이드 해주었습니다.
### Stacks!!

- [NextJs](https://nextjs.org/)
- [tailwindcss](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/docs/installation/next)

### 프로젝트 구조 

파일 트리 생성기를 이용하여 구조 작성할 것!!!


### NextJs

- app 폴더 안에 있는 페이지의 경우 Server Component이다. 
- Nextjs의 Dynamic routing을 사용할 때, params 는 어디에서 오는가 ?? 이는 Server Component의 특별한 옵션이다. 
