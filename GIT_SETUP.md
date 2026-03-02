# Git 설정 가이드

## 1. Git 설치 (아직 설치하지 않았다면)

Windows에서 Git을 설치하는 방법:

### 방법 A: winget (권장)
PowerShell을 관리자 권한으로 열고 실행:
```powershell
winget install --id Git.Git -e --source winget
```

### 방법 B: 공식 사이트에서 다운로드
- https://git-scm.com/download/win
- 설치 후 **컴퓨터를 한 번 재시작**하거나 새 터미널을 여세요.

---

## 2. Git 초기화 (설치 후)

프로젝트 폴더에서 터미널을 열고 아래 명령을 순서대로 실행하세요.

```bash
cd "c:\Users\dale7\OneDrive\바탕 화면\sharky-sticker-book"

git init
git add .
git commit -m "Initial commit: 샤이닝 키즈 스티커북 프로젝트"
```

---

## 3. GitHub에 올리기 (선택)

원격 저장소(GitHub 등)를 사용하려면:

1. GitHub에서 새 저장소(repository) 생성
2. 아래 명령 실행 (저장소 URL은 본인 것으로 변경):

```bash
git remote add origin https://github.com/사용자명/저장소명.git
git branch -M main
git push -u origin main
```

---

## .gitignore 정리

다음 항목은 Git에서 제외됩니다 (이미 설정됨):
- `node_modules`, `build` - 의존성/빌드 결과물
- `android/local.properties`, `android/build` - Android 로컬 설정/빌드
- `.env.local` 등 - 환경 변수 파일

`android` 폴더의 **소스 코드와 설정**은 포함됩니다 (Capacitor 권장).
