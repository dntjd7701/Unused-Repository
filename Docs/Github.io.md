
1. repository, io 생성
2. Ruby 설치를 위해 rbenv(ruby의 버전을 독립적으로 사용할 수 있도록 도와주는 패키지) 설치

	brew install rbenv
3. rbenv를 이용한 ruby 설치(rbenv를 bash에 추가)
```null
 rbenv install 2.6.5
$ rbenv global 2.5.5
$ rbenv rehash #해시를 재정렬

$ ruby -v #ruby 버전 확인
```

##### global , local 옵션을 이용하여 루비 버전 설정

global : 전역 설정을 변경하는 옵션

local : 현재 디렉토리에 설정 파일을 추가하여 프로젝트 별로 루비 버전을 설정할 때

ruby에서 사용하는 패키지인 Gem의 의존성관리를 위한 의존성 관리 도구인 bundler를 설치

맥에는 기본적으로 루비가 설치되어져 있다

하지만 기본 루비는 시스템 루비로 설치되어져 있는데, 해당 루비로 사용했을때 문제점이 있다.

예를들면

시스템 ruby를 사용중에, fastlane, bundler등 설치 및 설정하려면 sudo 를 통해서 root 권환을 이용해야한다거나,

다양한 프로젝트에 있어서 루비 버전이 달라야 하는데, 해당버전을 모두 관리하려면 삭제, 반복의 연속이다

rbenv를 이용하면 다양한 ruby 버전을 전환해가면서 관리를 할 수 있다.


https://wlqmffl0102.github.io/posts/Making-Git-blogs-for-beginners-3/



### 요약 

1. ruby (mac은 자동 설치, 버전에 맞게 설치 ) (rdenv 사용)
2. gem install bundler / gem install jekyll 
3. jekyll new ./
4. bundle install (bundle)
5. bundle exec jekyll serve(jekyll s)
6. _config.yml 수정 
7. 숨겨진 파일의 .github/workflows/pages-deploy.yml.hook 수정
8. pages-deploy.yml.hook  -> pages-deploy.yml, branches 일치
9. git push _

theme not found error 발생 시 <<
remote_theme: hydecorp/hydejack@v9


https://www.irgroup.org/posts/jekyll-chirpy/