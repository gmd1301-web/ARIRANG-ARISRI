# GitHub Pages 배포 방법

1. GitHub에서 저장소 이름을 반드시 **`사용자명.github.io`**로 만듭니다.
2. 이 프로젝트 폴더의 파일 전체를 해당 저장소에 올립니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
5. `main` 브랜치에 파일을 올리면 `Deploy Arirang Exhibition to GitHub Pages` 작업이 자동 실행됩니다.
6. 완료 후 `https://사용자명.github.io/`에서 전시를 볼 수 있습니다.

음원과 이미지의 절대경로를 안정적으로 유지하기 위해 사용자 사이트 저장소 방식을 사용합니다.

## 로컬 정적 빌드

```powershell
$env:GITHUB_PAGES='true'
pnpm install
pnpm build:github
```

정적 결과물은 `out` 폴더에 생성됩니다.
