# TERELJI SEVEN STAR

원본 단일 HTML을 Next.js App Router 프로젝트로 변환한 리조트 랜딩 페이지입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## Vercel 배포

이 저장소를 Vercel 프로젝트에 연결하면 프레임워크가 Next.js로 자동 인식됩니다.
별도의 빌드 설정이나 환경 변수는 필요하지 않습니다.

- Build command: `npm run build`
- Output: Next.js 기본값
- Node.js: Vercel 기본 지원 버전

## 원본에서 다시 생성

원본 HTML의 콘텐츠나 이미지가 변경된 경우 다음 명령으로 정적 콘텐츠와 이미지
자산을 다시 추출할 수 있습니다.

```bash
node scripts/convert-to-next.mjs
```

페이지 동작은 `app/page.tsx`, 레이아웃과 메타데이터는 `app/layout.tsx`에서
관리합니다.
