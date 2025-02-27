# Unused-Repository


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
