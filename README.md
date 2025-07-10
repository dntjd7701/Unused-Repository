# Unused-Repository

✅ 1. 전체 레포를 새 레포로 이동 (커밋 이력 포함)
1단계. 기존 레포 클론
bash
복사
편집
git clone --bare https://github.com/username/old-repo.git
--bare 옵션은 .git 디렉토리만 복사하는 방식으로, 원격 이전에 적합합니다.

2단계. 새 레포에 푸시
bash
복사
편집
cd old-repo.git
git push --mirror https://github.com/username/new-repo.git
--mirror는 브랜치, 태그, 리모트 정보 등 모든 것을 새 레포로 복사합니다.

3단계. 클론해서 사용
bash
복사
편집
git clone https://github.com/username/new-repo.git
✅ 2. 기존 레포를 다른 레포 하위 폴더로 병합 (예: 모노레포 구성)
기존 레포의 커밋 히스토리를 유지한 채로, 다른 레포의 하위 폴더로 가져오고 싶다면:

1단계. 기존 레포를 서브디렉토리로 변환
bash
복사
편집
git clone https://github.com/username/old-repo.git
cd old-repo
git filter-repo --to-subdirectory-filter my-old-repo
git filter-repo는 filter-branch의 더 빠른 대체 도구이며, 설치 필요:
brew install git-filter-repo 또는 공식 문서

2단계. 새로운 레포에 병합
bash
복사
편집
git remote add newrepo https://github.com/username/new-repo.git
git fetch newrepo
git merge --allow-unrelated-histories newrepo/main
3단계. 푸시
bash
복사
편집
git push origin main
🔁 정리
목적	방법
레포 전체 이동 (이력 포함)	--bare + --mirror
레포를 다른 레포 하위 폴더로 옮기기 (이력 포함)	git filter-repo + 병합




---

```linux
git subtree add --prefix=기존리포지토리명 기존리포지토리주소 기존브랜치명
git push
```
📌  algo_resolve를 서브트리로 추가

```linux
git remote add algo_resolve https://github.com/dntjd7701/algo_resolve.git
git fetch algo_resolve
git subtree add --prefix=algo_resolve algo_resolve/main --squash
git push 
```

algo_resolve를 원격 저장소로 추가
algo_resolve/main 브랜치를 Unused-Repository의 algo_resolve 디렉토리로 병합
--squash 옵션을 사용하면 commit 기록을 하나로 합칠 수 있음 (히스토리 유지하려면 --squash 빼고 실행)


✅ 2. 이후 algo_resolve 변경사항을 업데이트하려면
만약 algo_resolve가 업데이트되었을 때 Unused-Repository에도 반영하고 싶다면, 아래 명령어를 실행하면 돼.

```linux
git subtree pull --prefix=algo_resolve algo_resolve main --squash
```

이렇게 하면 algo_resolve 저장소의 main 브랜치 변경 사항이 Unused-Repository의 algo_resolve 디렉토리에 반영돼.

✅ 만약 algo_resolve 전체를 Unused-Repository로 옮기고 싶다면
만약 algo_resolve 자체를 통째로 옮기고, algo_resolve 저장소를 폐기할 계획이라면 아래 방법을 사용할 수도 있어.

📌 (1) algo_resolve를 Unused-Repository에 push

```linux
git clone --bare https://github.com/dntjd7701/algo_resolve.git
cd algo_resolve.git
git push --mirror https://github.com/dntjd7701/Unused-Repository.git
```

--bare 옵션을 사용하면 모든 브랜치와 태그를 포함한 Git 저장소만 복제
--mirror 옵션을 사용하면 원격 저장소를 완전히 덮어씌움
이 방식은 Unused-Repository의 기존 내용이 사라질 위험이 있으니 주의!
