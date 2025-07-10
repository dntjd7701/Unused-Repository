# Unused-Repository
물론이죠, 아래는 **기존 레포를 커밋 이력을 유지하면서 다른 레포로 옮기는 방법**을 Markdown 형식으로 정리한 내용입니다:

---

# 📦 기존 Git 레포를 커밋 이력 포함하여 새 레포로 옮기는 방법

## ✅ 1. 전체 레포를 새 레포로 이동 (커밋 이력 포함)

### 1단계: 기존 레포 클론 (bare 형식)

```bash
git clone --bare https://github.com/username/old-repo.git
```

> `--bare` 옵션은 Git 메타데이터만 복사하여 푸시에 적합한 형태로 만듭니다.

---

### 2단계: 새 레포에 mirror 푸시

```bash
cd old-repo.git
git push --mirror https://github.com/username/new-repo.git
```

> `--mirror`는 브랜치, 태그, 모든 Git 객체를 그대로 복사합니다.

---

### 3단계: 새 레포 클론

```bash
git clone https://github.com/username/new-repo.git
```

---

## ✅ 2. 기존 레포를 다른 레포의 하위 디렉토리로 병합 (이력 유지)

### 1단계: 기존 레포를 클론한 뒤 서브디렉토리로 구조 변경

```bash
git clone https://github.com/username/old-repo.git
cd old-repo
git filter-repo --to-subdirectory-filter my-old-repo
```

> `git filter-repo`는 커밋 히스토리를 유지하면서 전체 파일을 `my-old-repo/` 하위로 이동시킵니다.
> 설치 필요:

```bash
brew install git-filter-repo
# 또는
pip install git-filter-repo
```

---

### 2단계: 대상 레포에 병합

```bash
git remote add newrepo https://github.com/username/new-repo.git
git fetch newrepo
git merge --allow-unrelated-histories newrepo/main
```

---

### 3단계: 푸시

```bash
git push origin main
```

---

## 🔁 요약

| 목적                  | 추천 방법                                           |
| ------------------- | ----------------------------------------------- |
| 레포 전체를 새 레포로 이전     | `git clone --bare` + `git push --mirror`        |
| 레포를 다른 레포 하위 폴더로 이전 | `git filter-repo --to-subdirectory-filter` + 병합 |

---

필요한 목적에 따라 방법을 선택하면 돼요. 구체적인 상황을 말해주면 맞춤형으로 도와줄게요! 😊


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
