# Keepsy

> 네일·속눈썹·왁싱·반영구 시술을 제공하는 2인 이상 뷰티샵을 위한 고객관리(CRM) 웹 플랫폼입니다.

고객의 방문 이력, 시술 사진, 취향, 상담 메모를 한곳에 기록하고, 고객별 방문 주기를 분석해 다음 방문 시점을 예측합니다. 이를 바탕으로 재방문이 필요한 고객을 파악하고, 검토된 메시지 캠페인부터 재예약·재방문 성과 확인까지 연결합니다.

Claude Design 캔버스를 React + TypeScript + Vite 프로젝트로 옮긴 것입니다. **화면만** 구현했고 API 연동은 없습니다(목업 데이터·동작은 디자인 그대로).

## 실행

```bash
npm install
npm run dev
npm run build
```

## 주소

| 화면 | 주소 |
|---|---|
| 01 CRM 대시보드 | / |
| 02 예약 관리 | /schedule |
| 03 고객 목록 | /customers |
| 04 고객 상세 | /customers/detail |
| 05 시술 히스토리북 | /history |
| 06 재방문 관리(인사이트) | /insights |
| 07 캠페인 관리 | /campaigns |
| 08 성과 분석 | /performance |
| 09 매장 설정 | /settings |
| 00 디자인 시스템 | /design-system |

## 폴더

```
src/
  assets/images/   고객 사진·시술 사진 + index.ts
  components/common/  Avatar, Photo, AppLink
  components/layout/  Sidebar, Topbar
  hooks/           useStyleSheet (화면별 CSS 적용/해제)
  pages/           화면마다 폴더 하나(TSX + CSS)
  routes/          주소 표·라우터
```

- 화면별 CSS는 그 화면이 떠 있는 동안에만 적용됩니다(원본은 화면마다 따로 열렸기 때문).
- 글꼴 Noto Sans KR은 Google Fonts에서 불러옵니다.
- 상태 타입은 우선 any로 느슨하게 두었습니다(strict: false).
