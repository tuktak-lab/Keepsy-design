import { useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { Avatar } from '@/components/common/Avatar';
import { Photo } from '@/components/common/Photo';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styleText from './HistoryPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

const TL = [
  { date: '2026.10.24', cat: '네일', treat: '클린 프렌치', k: 'french', bg: '#E9E4DD', staff: '서연', note: '얇은 프렌치 라인 · 짧은 길이. 케어는 자극을 최소화했어요.' },
  { date: '2026.09.30', cat: '네일', treat: '딥 플럼 글로시', k: 'gloss', bg: '#D9C9CD', staff: '서연', note: '젤 제거 후 시술. 짙은 컬러는 처음이었고 만족도가 높았어요.' },
  { date: '2026.09.28', cat: '속눈썹', treat: '속눈썹 연장 C컬', k: 'milky', bg: '#EBDDDA', staff: '지아', note: '자연스러운 길이로 시술했어요.' },
  { date: '2026.09.06', cat: '네일', treat: '밀키 핑크 아트', k: 'milky', bg: '#EBDDDA', staff: '서연', note: '작은 진주 포인트. 다음에도 포인트는 작게 원해요.' },
  { date: '2026.08.13', cat: '네일', treat: '펄 포인트', k: 'pearl', bg: '#ECE5E1', staff: '서연', note: '무난한 펄 포인트. 반응이 좋아 시그니처 메뉴로 이어졌어요.' },
];

export default function HistoryPage() {
  useStyleSheet('HistoryPage', styleText);
  const [consent, setConsent] = useState(true);
  const [filter, setFilter] = useState('전체');
  const [uploaded, setUploaded] = useState(false);

  const list = TL.filter((t) => filter === '전체' || t.cat === filter);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1000px' }}>
      <div style={{ flex: '0 0 232px', background: '#F4EBE6' }}>
        <Sidebar active="customers" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="파트너 센터 / 시술 히스토리북" />
        <div className="wrap">
          <div className="row between" style={{ alignItems: 'flex-end' }}>
            <div className="col" style={{ gap: 6 }}>
              <h1 className="h1">시술 히스토리북</h1>
              <p className="sub">한 고객의 시술 사진을 날짜순으로 모아 보고, 다음 상담에 활용하세요.</p>
            </div>
            <AppLink href="/customers" className="btn">고객 변경</AppLink>
          </div>

          <section className="card row between">
            <div className="row" style={{ gap: 14 }}>
              <Avatar who="김민지" size="56" />
              <div className="col">
                <strong style={{ fontSize: 18 }}>김민지</strong>
                <span className="sub num">010-****-4821 · 방문 8회 · 시술 11건</span>
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <select className="sel" aria-label="시술 카테고리" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option>전체</option>
                <option>네일</option>
                <option>속눈썹</option>
              </select>
              <AppLink href="/customers/detail" className="btn">고객 상세</AppLink>
            </div>
          </section>

          <section className="card col" style={{ gap: 12 }}>
            <div className="row between">
              <h2 className="h2">사진 업로드</h2>
              <span className="chip" style={{ background: consent ? '#F9EBE8' : '#ECE5E1', color: consent ? '#85505A' : '#5B5552' }}>
                <i></i>사진 동의 {consent ? '있음 (2026.06.26)' : '철회됨'}
              </span>
            </div>
            {consent ? (
              <>
                <div className="row" style={{ gap: 8 }}>
                  <button type="button" className="btn btn-p" onClick={() => setUploaded(true)}>+ 시술 사진 올리기</button>
                  <button type="button" className="btn" onClick={() => { setConsent(false); setUploaded(false); }}>사진 동의 철회 (시연)</button>
                </div>
                {uploaded ? <p className="note">시술 사진 1장이 비공개로 저장됐어요. (시연)</p> : null}
              </>
            ) : (
              <>
                <p className="note">사진 동의가 철회되어 저장된 사진이 즉시 삭제됐고, 새 사진은 올릴 수 없어요. 동의를 다시 받으면 업로드할 수 있어요.</p>
                <div><button type="button" className="btn" onClick={() => setConsent(true)}>사진 동의 다시 받기 (시연)</button></div>
              </>
            )}
            <p className="meta">사진은 고객 동의를 받은 경우에만 업로드할 수 있어요. 동의를 철회하면 사진이 즉시 삭제돼요. 사진은 외부에 공개되지 않고 비공개로 저장돼요.</p>
          </section>

          <section className="card col" style={{ gap: 16 }}>
            <h2 className="h2">사진 타임라인</h2>
            {consent ? (
              <div className="tl">
                {list.map((t) => (
                  <div className="tl-item" key={t.date + t.treat}>
                    <div style={{ height: 150, overflow: 'hidden', borderRadius: 16 }}>
                      <Photo kind={t.k} h="150" bg={t.bg} />
                    </div>
                    <div className="col" style={{ gap: 3 }}>
                      <strong className="num">{t.date}</strong>
                      <span style={{ fontWeight: 500 }}>{t.treat} <span className="meta">· {t.cat} · {t.staff}</span></span>
                      <span className="sub">{t.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sub">표시할 사진이 없어요. 시술 기록 텍스트는 고객 상세에서 확인할 수 있어요.</p>
            )}
          </section>
          <p className="meta">시연용 데이터예요. 시술 기록은 매장 CRM과 시술별 재방문 예측에 반영돼요.</p>
        </div>
      </main>
    </div>
  );
}
