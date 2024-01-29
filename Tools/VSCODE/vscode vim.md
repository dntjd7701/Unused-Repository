[본문 바로가기](https://dududweb.tistory.com/59#content)
===
마우스버리기

# [마우스버리기] VS Code IDE 에서 Vim 사용하기

by dududlink 2022. 1. 23.

![](https://blog.kakaocdn.net/dn/dH2Afw/btrroGio1PK/0SjfTAOsyn98JoMm0o18t0/img.png)

키보드로만으로도 생산성을 높이기 위해 Vscode 내에서 VIm 플러그인을 설치하여 vscode, vim을 상호보완적으로 사용하려한다.

vscode extension에서 vim플러그인 설치가 가능하다.

![](https://blog.kakaocdn.net/dn/blpE31/btrrqna3CUV/gyYJFvKP42Ng6wUZnB63kK/img.png)

## 명령어

## 일반

- :h[elp] keyword - 도움말 열기
- :sav[eas] file - 다른 이름으로 저장
- :clo[se] - 현재 창 닫기
- :ter[minal] - 터미널 열기
- K - 커서가 가리키는 단어의 설명글 열기

**Tip** 터미널에서 vimtutor를 실행시켜 Vim의 명령어를 학습해봅시다.

## 커서이동

- h - 왼쪽으로 한 칸 이동
- j - 아래로 한 칸 이동
- k - 위로 한 칸 이동
- l - 오른쪽으로 한 칸 이동
- H - 현재화면 상단으로 점프
- M - 현재화면 중단으로 점프
- L - 현재화면 하단으로 점프
- w - 다음 단어 시작으로 점프
- W - 다음 단어 시작으로 점프 (특수문자 포함)
- e - 다음 단어 끝으로 점프
- E - 다음 단어 끝으로 점프 (특수문자 포함)
- b - 이전 단어 시작으로 점프
- B - 이전 단어 시작으로 점프 (특수문자 포함)
- ge - 이전 단어 끝으로 점프
- gE - 이전 단어 끝으로 점프 (특수문자 포함)
- % - 현재 괄호의 짝으로 점프 (:h matchpairs를 통해 더 많은 정보를 얻을 수 있습니다.)
- 0 - 현재 행 시작으로 점프 (공백 포함)
- ^ - 현재 행 시작으로 점프
- $ - 현재 행 끝으로 점프 (공백 포함)
- g_ - 현재 행 끝으로 점프
- gg - 문서 첫 줄 시작으로 점프
- G - 문서 끝 줄 시작으로 점프
- 5gg or 5G - 5번째 행 시작으로 점프
- gd - 지역변수 선언위치로 점프
- gD - 전역변수 선언위치로 점프
- fx - 다음 검색 문자 x로 점프
- tx - 다음 검색 문자 x 앞에 점프
- Fx - 이전 검색 문자 x로 점프
- Tx - 이전 검색 문자 x 뒤에 점프
- ; - 최근 f/t/F/T 명령어 실행
- , - 최근 F/T/f/t 명령어 실행
- } - 다음 단락으로 점프
- { - 이전 단락으로 점프
- zz - 화면 위치 중간으로 조정
- Ctrl + e - 한 줄 아래로 화면 조정
- Ctrl + y - 한 줄 위로 화면 조정
- Ctrl + b - 한 화면 위로 조정
- Ctrl + f - 한 화면 아래로 조정
- Ctrl + d - 반 화면 아래로 조정
- Ctrl + u - 반 화면 위로 조정

**Tip** 이동 명령 앞에 숫자를 붙이면 그 수만큼 반복합니다. 예를 들면, 4j는 4행 아래로 이동합니다.

## 삽입 모드

- i - 현재 커서 앞에 삽입
- I - 현재 커서 행 시작에 삽입
- a - 현재 커서 뒤에 삽입
- A - 현재 커서 행 끝에 삽입
- o - 현재 커서 행 아래에 새 행을 삽입
- O - 현재 커서 행 위에 새 행을 삽입
- ea - 단어 끝 뒤에 삽입
- Ctrl + h - 이전 문자 제거
- Ctrl + w - 이전 단어 제거
- Ctrl + j - 한 줄 바꿈
- Ctrl + t - 한 탭 들여쓰기
- Ctrl + d - 한 탭 내어쓰기
- Ctrl + n - 다음 단어 탐색 (자동완성)
- Ctrl + p - 이전 단어 탐색 (자동완성)
- Ctrl + rx - 레지스터 x의 내용 삽입
- Ctrl + ox - Temporarily enter normal mode to issue one normal-mode command x.
- Esc - 삽입모드 종료

## 편집 모드

- r - 한 글자 바꾸기
- R - 한 글자 이상 바꾸기(ESC 누르면 종료)
- J - 현재 행과 다음 행 연결
- gJ - 현재 행과 다음 행 연결 (공백무시)
- gwip - 단락 리플로우
- g~ - 커서 이동으로 대·소문자 전환
- gu - 커서 이동으로 소문자 전환
- gU - 커서 이동으로 대문자 전환
- cc - 한 행 전체 새로 쓰기
- C - 한 행 끝까지 새로 쓰기
- c$ - 한 행 끝까지 새로 쓰기
- ciw - 한 단어 전체 새로 쓰기
- cw or ce - 한 단어 끝까지 새로 쓰기
- s - 한 문자 새로 쓰기
- S - 한 행 전체 새로 쓰기 (cc와 동일)
- xp - 잘라내고 붙여넣기
- u - 실행취소
- U - 최근 수정한 줄 복원(실행취소)
- Ctrl + r - 다시실행
- . - 최근 명령어 반복

## 선택 모드 (비주얼 모드)

- v - 비주얼 모드
- V - 비주얼 라인
- o - 선택 영역 반대쪽 끝으로 점프
- Ctrl + v - 비주얼 블록
- O - 블록의 반대쪽 모서리로 이동
- aw - 단어 선택
- ab - 소괄호() 구간 선택
- aB - 중괄호{} 구간 선택
- at - 태그<> 구간 선택
- ib - 소괄호() 내부 선택
- iB - 중괄호{} 내부 선택
- it - 태그<> 내부 선택
- Esc - 선택 모드 종료

**Tip** b 또는 B 대신에 ( 또는 { 사용가능.

## 선택 모드 명령

- > - 선택 행 들여쓰기
- < - 선택 행 내어쓰기
- y - 선택 구간 복사
- d - 선택 구간 삭제
- ~ - 대소문자 반전
- u - 선택 구간 소문자 전환
- U - 선택 구간 대문자 전환

## 레지스터

- :reg[isters] - 레지스터 내용 확인
- "xy - 레지스터 x 복사
- "xp - 레지스터 x 붙여넣기
- "+y - 클립보드 복사
- "+p - 클립보드 붙여넣기

**Tip** 레지스터는 ./viminfo에 저장되고, 다음 Vim 재시작 때 다시 읽어들입니다.

**Tip** 특수 레지스터:

 0 - 최근 복사 레지스터  
 " - 최근 사용 레지스터  
 % - 현재 파일명  
 # - 대체 파일명  
 * - 클립보드 (X11 primary)  
 + - 클립보드 (X11 clipboard)  
 / - 최근 검색 패턴  
 : - 최근 Vim 명령줄  
 . - 최근 삽입 텍스트  
 - - 최근 제거 문자  
 = - 표현식 레지스터  
 _ - 블랙홀 레지스터

## 마킹

- :marks - 마킹 항목 표시
- ma - 현재 위치를 a로 마킹
- `a - 마크 a로 점프
- y`a - 마크 a까지 복사
- `0 - 종료 전 커서위치로 점프
- `" - 최근 편집한 커서 위치로 점프
- `. - 최근 변경한 커서 위치로 점프
- `` - 최근 점프 전 위치로 점프
- :ju[mps] - 점프목록
- Ctrl + i - 이전 점프목록 위치로 점프
- Ctrl + o - 다음 점프목록 위치로 점프
- :changes - 변경목록
- g, - 이전 변경목록 위치로 점프
- g; - 다음 변경목록 위치로 점프
- Ctrl + ] - 커서가 가리키는 태그로 점프

**Tip** 마킹한 곳으로 점프 시 그레이브 액센트 (`) 또는 아포스트로피 (') 모두 사용가능합니다. 아포스트로피 사용 시, 마킹한 곳의 줄 머리로 이동합니다. (공백 미포함)

## 매크로

- qa - 매크로 a 기록 시작
- q - 매크로 기록 중지
- @a - 매크로 a 실행
- @@ - 최근 매크로 재실행

## 잘라내기와 붙여넣기

- yy - 한 행 복사하기
- 2yy - 2줄 복사하기
- yw - 다음 단어까지 복사하기
- yiw - 한 단어 복사하기
- yaw - 한 단어 복사하기 (공백포함)
- y$ - 한 행 끝까지 복사하기
- p - 커서 뒤에 붙여넣기
- P - 커서 앞에 붙여넣기
- gp - 커서 뒤에 붙여넣고 붙여넣은 행 다음으로 커서 옮기기
- gP - 커서 앞에 붙여넣고 붙여넣은 행 다음으로 커서 옮기기
- dd - 한 행 잘라내기
- 2dd - 2줄 잘라내기
- dw - 다음 단어까지 잘라내기
- diw - 한 단어 잘라내기
- daw - 한 단어 잘라내기 (공백포함)
- D - 한 행 끝까지 잘라내기
- d$ - 한 행 끝까지 잘라내기
- x - 한 문자 잘라내기

## 문단모양

- >> - 한 탭 들여쓰기
- << - 한 탭 내어쓰기
- >% - 중·소괄호 구간 들여쓰기
- >ib - 소괄호 내부 들여쓰기
- >at - 태그 구간 들여쓰기
- 3== - 3줄 자동정렬
- =% - 중·소괄호 구간 자동정렬
- =iB - 중괄호 내부 자동정렬
- gg=G - 전체 버퍼 자동정렬
- ]p - 붙여쓰고 현재 행 들여쓰기 조

## 나가기

- :w - 저장하기
- :w !sudo tee % - 관리자로 저장하기
- :wq or :x or ZZ - 저장하고 나가기
- :q - 나가기 (변경확인)
- :q! or ZQ - 나가기 (변경무시)
- :wqa - 모든 탭 저장하고 나가기

## 검색과 바꾸기

- /pattern - 패턴 검색 (순방향)
- ?pattern - 패턴 검색 (역방향)
- \vpattern - 특수 매직 패턴
- n - 다음 검색항목으로 점프
- N - 이전 검색항목으로 점프
- :%s/old/new/g - 모든 old를 new로 바꾸기
- :%s/old/new/gc - 모든 old를 new로 확인하며 바꾸기
- :noh[lsearch] - 검색 하이라이트 제거

## 여러 파일 검색

- :vim[grep] /pattern/ {`{file}`} - 여러 파일에서 패턴 검색

e.g. :vim[grep] /foo/ **/*

- :cn[ext] - 다음 검색항목으로 점프
- :cp[revious] - 이전 검색항목으로 점프
- :cope[n] - 일치 목록을 새 창으로 열기
- :ccl[ose] - 일치 목록 창 닫기

## 탭

- :tabnew or :tabnew {page.words.file} - 새 탭에서 파일 열기
- Ctrl + wT - 현재 분할 창을 새로운 탭으로 이동
- gt or :tabn[ext] - 다음 탭으로 이동
- gT or :tabp[revious] - 이전 탭으로 이동
- #gt - #번째 탭으로 이동
- :tabm[ove] # - 현재 탭을 #번째로 이동
- :tabc[lose] - 현재 탭과 그 안의 창들 닫기
- :tabo[nly] - 현재 탭 이외의 모든 탭 닫기
- :tabdo command - 모든 탭에서 command 실행하기 (예를 들어, :tabdo q - 열린 모든 탭 닫기)

## 여러 파일 작업

- :e[dit] file - 새 버퍼에서 파일 편집
- :bn[ext] - 다음 버퍼로 이동
- :bp[revious] - 이전 버퍼로 이동
- :bd[elete] - 버퍼 삭제 (파일 닫기)
- :b[uffer]# - #번째 버퍼로 이동
- :b[uffer] file - 파일명 버퍼로 이동
- :ls or :buffers - 열린 버퍼 모두 나열
- :sp[lit] file - 새 버퍼에 파일 열고 상하로 창 분할
- :vs[plit] file - 새 버퍼에 파일 열고 좌우로 창 분할
- :vert[ical] ba[ll] - 모든 버퍼 열고 좌우로 창 분할
- :tab ba[ll] - 모든 버퍼 열고 탭으로 창 분할
- Ctrl + ws - 상하로 창 분할
- Ctrl + wv - 좌우로 창 분할
- Ctrl + ww - 창 전환
- Ctrl + wq - 창 닫기
- Ctrl + wx - 창 바꾸기
- Ctrl + w= - 모든 창 크기 조정
- Ctrl + wh - 왼쪽 창으로 이동
- Ctrl + wl - 오른쪽 창으로 이동
- Ctrl + wj - 아래 창으로 이동
- Ctrl + wk - 위 창으로 이동
- Ctrl + wH - 현재 창을 최대 높이인 상태로 왼쪽 이동(가장 왼쪽)
- Ctrl + wL - 현재 창을 최대 높이인 상태로 오른쪽 이동(가장 오른쪽)
- Ctrl + wJ - 현재 창을 최대 너비인 상태로 아래로 이동(가장 아래쪽
- Ctrl + wK - 현재 창을 최대 너비인 상태로 위로 이동(가장 위쪽)

좋아요2

공유하기

게시글 관리

_구독하기_

#### '[마우스버리기](https://dududweb.tistory.com/category/%EB%A7%88%EC%9A%B0%EC%8A%A4%EB%B2%84%EB%A6%AC%EA%B8%B0)' 카테고리의 다른 글

|   |   |
|---|---|
|[[마우스버리기] VS Code editor 에서 단축키로 terminal로 커서 이동하기](https://dududweb.tistory.com/61)  (2)|2022.01.23|

## 관련글

- [
    
    ![](https://i1.daumcdn.net/thumb/C176x120/?fname=https://img1.daumcdn.net/thumb/R750x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcPD8PL%2FbtrrAdzE1yG%2F1B4ezRrXkvDckeqmFlav1k%2Fimg.png)
    
    [마우스버리기] VS Code editor 에서 단축키로 terminal로 커서 이동하기](https://dududweb.tistory.com/61?category=1034702)

[dududlink](https://dududweb.tistory.com/)[dududlink 님의 블로그입니다.](https://dududweb.tistory.com/)구독하기

[](https://dududweb.tistory.com/)

댓글0

비밀글등록

- [분류 전체보기](https://dududweb.tistory.com/category)
    - [Memo](https://dududweb.tistory.com/category/Memo)
    - [Library](https://dududweb.tistory.com/category/Library)
    - [Coding](https://dududweb.tistory.com/category/Coding)
        - [React](https://dududweb.tistory.com/category/Coding/React)
        - [JS](https://dududweb.tistory.com/category/Coding/JS)
        - [CSS](https://dududweb.tistory.com/category/Coding/CSS)
        - [알고리즘](https://dududweb.tistory.com/category/Coding/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)
        - [Error](https://dududweb.tistory.com/category/Coding/Error)
        - [TypeScript](https://dududweb.tistory.com/category/Coding/TypeScript)
        - [WEB](https://dududweb.tistory.com/category/Coding/WEB)
        - [Network](https://dududweb.tistory.com/category/Coding/Network)
    - [Git](https://dududweb.tistory.com/category/Git)
    - [Code](https://dududweb.tistory.com/category/Code)
    - [마우스버리기](https://dududweb.tistory.com/category/%EB%A7%88%EC%9A%B0%EC%8A%A4%EB%B2%84%EB%A6%AC%EA%B8%B0)
    - [Project](https://dududweb.tistory.com/category/Project)
        - [Weasly(화장품결제구독서비스)](https://dududweb.tistory.com/category/Project/Weasly%28%ED%99%94%EC%9E%A5%ED%92%88%EA%B2%B0%EC%A0%9C%EA%B5%AC%EB%8F%85%EC%84%9C%EB%B9%84%EC%8A%A4%29)
        - [Hines(리빙쇼핑몰)](https://dududweb.tistory.com/category/Project/Hines%28%EB%A6%AC%EB%B9%99%EC%87%BC%ED%95%91%EB%AA%B0%29)
        - [기업협업](https://dududweb.tistory.com/category/Project/%EA%B8%B0%EC%97%85%ED%98%91%EC%97%85)
    - [book](https://dududweb.tistory.com/category/book)

## 공지사항

## [최근글](https://dududweb.tistory.com/59#recent)[인기글](https://dududweb.tistory.com/59#popular)

- [![](https://i1.daumcdn.net/thumb/C58x58/?fname=https://img1.daumcdn.net/thumb/R750x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fw6tW2%2Fbtsv9O2ATaM%2FEdpaSk94M2FH0HsKhOIwU0%2Fimg.png)카페24 쇼핑몰 4 FTP서버 이미지 업로드 하고⋯2023.10.01](https://dududweb.tistory.com/187)
- [크리에이터를 위한 석가모니 명언2023.08.09](https://dududweb.tistory.com/186)
- [![](https://i1.daumcdn.net/thumb/C58x58/?fname=https://img1.daumcdn.net/thumb/R750x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FHXhHo%2Fbtsp2i3R4zK%2F3zBilYNoVBLNKTPKHuXuf1%2Fimg.webp)크리에이터를 위한 사무엘 베케트의 명언2023.08.06](https://dududweb.tistory.com/185)
- [![](https://i1.daumcdn.net/thumb/C58x58/?fname=https://img1.daumcdn.net/thumb/R750x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmgmPy%2FbtsohnYF8US%2F64a6sv2pSEDEnkzXkIStkk%2Fimg.jpg)사람들이 잘모르는 달리기의 장점 7가지2023.07.20](https://dududweb.tistory.com/184)
- [영문 철자변경 대문자 소문자 첫글자만 변경/ 전체⋯2023.07.10](https://dududweb.tistory.com/183)

## 최근댓글

- [좋은 글 잘 보고 가요! 감사합니다 :)](https://dududweb.tistory.com/187#comment18712939)
- [너무 감사해요ㅠㅠ 덕분에 출석합니다 당신은 나의 은인이⋯](https://dududweb.tistory.com/111#comment17835356)
- [와 진짜 감사합니ㅜㅜㅜ 너무열받아서 미칠 지경이었는데 ⋯](https://dududweb.tistory.com/111#comment17792700)
- [QuickTime Player가 켜져도 같은 현상이 발⋯](https://dududweb.tistory.com/111#comment17778496)

## 태그

[리액트](https://dududweb.tistory.com/tag/%EB%A6%AC%EC%95%A1%ED%8A%B8) [창작자의운동](https://dududweb.tistory.com/tag/%EC%B0%BD%EC%9E%91%EC%9E%90%EC%9D%98%EC%9A%B4%EB%8F%99) [달리기](https://dududweb.tistory.com/tag/%EB%8B%AC%EB%A6%AC%EA%B8%B0) [페이스2코로스](https://dududweb.tistory.com/tag/%ED%8E%98%EC%9D%B4%EC%8A%A42%EC%BD%94%EB%A1%9C%EC%8A%A4) [타입스크립트](https://dududweb.tistory.com/tag/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8) [모자브랜드](https://dududweb.tistory.com/tag/%EB%AA%A8%EC%9E%90%EB%B8%8C%EB%9E%9C%EB%93%9C) [자기계발](https://dududweb.tistory.com/tag/%EC%9E%90%EA%B8%B0%EA%B3%84%EB%B0%9C) [운동중요성](https://dududweb.tistory.com/tag/%EC%9A%B4%EB%8F%99%EC%A4%91%EC%9A%94%EC%84%B1) [카페24ftp](https://dududweb.tistory.com/tag/%EC%B9%B4%ED%8E%9824ftp) [뇌과학운동](https://dududweb.tistory.com/tag/%EB%87%8C%EA%B3%BC%ED%95%99%EC%9A%B4%EB%8F%99) [크리에이터건강](https://dududweb.tistory.com/tag/%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%EA%B1%B4%EA%B0%95) [일기](https://dududweb.tistory.com/tag/%EC%9D%BC%EA%B8%B0) [카페24쇼핑몰제작](https://dududweb.tistory.com/tag/%EC%B9%B4%ED%8E%9824%EC%87%BC%ED%95%91%EB%AA%B0%EC%A0%9C%EC%9E%91) [창작자명언](https://dududweb.tistory.com/tag/%EC%B0%BD%EC%9E%91%EC%9E%90%EB%AA%85%EC%96%B8) [map](https://dududweb.tistory.com/tag/map) [andwander](https://dududweb.tistory.com/tag/andwander) [석가모니 명언](https://dududweb.tistory.com/tag/%EC%84%9D%EA%B0%80%EB%AA%A8%EB%8B%88%20%EB%AA%85%EC%96%B8) [JavaScript](https://dududweb.tistory.com/tag/JavaScript) [러닝중요성](https://dududweb.tistory.com/tag/%EB%9F%AC%EB%8B%9D%EC%A4%91%EC%9A%94%EC%84%B1) [react](https://dududweb.tistory.com/tag/react) [러닝브랜드](https://dududweb.tistory.com/tag/%EB%9F%AC%EB%8B%9D%EB%B8%8C%EB%9E%9C%EB%93%9C) [서평](https://dududweb.tistory.com/tag/%EC%84%9C%ED%8F%89) [킬리안조넷](https://dududweb.tistory.com/tag/%ED%82%AC%EB%A6%AC%EC%95%88%EC%A1%B0%EB%84%B7) [러너스하이](https://dududweb.tistory.com/tag/%EB%9F%AC%EB%84%88%EC%8A%A4%ED%95%98%EC%9D%B4) [스투시에어페니](https://dududweb.tistory.com/tag/%EC%8A%A4%ED%88%AC%EC%8B%9C%EC%97%90%EC%96%B4%ED%8E%98%EB%8B%88) [아디다스블론디가젤](https://dududweb.tistory.com/tag/%EC%95%84%EB%94%94%EB%8B%A4%EC%8A%A4%EB%B8%94%EB%A1%A0%EB%94%94%EA%B0%80%EC%A0%A4) [자바스크립트](https://dududweb.tistory.com/tag/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8) [사무엘베케트명언](https://dududweb.tistory.com/tag/%EC%82%AC%EB%AC%B4%EC%97%98%EB%B2%A0%EC%BC%80%ED%8A%B8%EB%AA%85%EC%96%B8) [크리에이터명언](https://dududweb.tistory.com/tag/%ED%81%AC%EB%A6%AC%EC%97%90%EC%9D%B4%ED%84%B0%EB%AA%85%EC%96%B8) [카페24이미지표시](https://dududweb.tistory.com/tag/%EC%B9%B4%ED%8E%9824%EC%9D%B4%EB%AF%B8%EC%A7%80%ED%91%9C%EC%8B%9C)

## 전체 방문자

60,020

Today : 22

Yesterday : 35

[TOP](https://dududweb.tistory.com/59#)

Designed by 티스토리

© Kakao Corp.

관리메뉴열기

**dududlink**_구독하기_