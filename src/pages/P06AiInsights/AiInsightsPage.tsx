import { useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { Avatar } from '@/components/common/Avatar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styleText from './AiInsightsPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

type Kind = 'due' | 'risk' | 'long';
interface Row {
  id: string;
  kind: Kind;
  name: string;
  cat: string;
  last: string;
  range: string;
  over: number; // 예측 종료일 이후 경과일(오늘 11.23 기준, 예측 기간 안이면 0)
  risk: number; // 이탈 신호 기간(일)
  consent: boolean;
  paid: number; // 최근 6개월 결제 합계
}

const TABS: [Kind, string, number][] = [
  ['due', '주기 도래', 14],
  ['risk', '이탈 신호', 22],
  ['long', '장기 미방문', 14],
];

const KIND = {
  due: { label: '주기 도래', bg: '#F9EBE8', fg: '#85505A' },
  risk: { label: '이탈 신호', bg: '#F6DFDF', fg: '#8F2F2F' },
  long: { label: '장기 미방문', bg: '#ECE5E1', fg: '#5B5552' },
};

const DATA: Row[] = [
  { id: 'a1', kind: 'due', name: '최유진', cat: '네일', last: '10.24', range: '11.20 ~ 11.27', over: 0, risk: 30, consent: true, paid: 358000 },
  { id: 'a2', kind: 'due', name: '한예린', cat: '네일', last: '10.21', range: '11.18 ~ 11.25', over: 0, risk: 30, consent: false, paid: 242000 },
  { id: 'a3', kind: 'due', name: '김수아', cat: '속눈썹', last: '10.16', range: '11.19 ~ 11.26', over: 0, risk: 30, consent: true, paid: 296000 },
  { id: 'b1', kind: 'risk', name: '강유나', cat: '네일', last: '10.02', range: '10.26 ~ 10.30', over: 24, risk: 30, consent: true, paid: 410000 },
  { id: 'b2', kind: 'risk', name: '정하린', cat: '네일', last: '09.12', range: '10.25 ~ 11.01', over: 22, risk: 30, consent: false, paid: 186000 },
  { id: 'b3', kind: 'risk', name: '오서현', cat: '속눈썹', last: '10.08', range: '11.03 ~ 11.10', over: 13, risk: 30, consent: true, paid: 112000 },
  { id: 'c1', kind: 'long', name: '윤다혜', cat: '네일', last: '07.24', range: '08.16 ~ 08.23', over: 92, risk: 30, consent: false, paid: 0 },
  { id: 'c2', kind: 'long', name: '문지후', cat: '왁싱', last: '07.30', range: '09.08 ~ 09.15', over: 69, risk: 45, consent: true, paid: 84000 },
];

const won = (n: number) => n.toLocaleString('ko-KR') + '원';
const ratio = (r: Row) => r.over / r.risk;

function sorted(rows: Row[]) {
  return [...rows].sort(
    (a, b) => ratio(b) - ratio(a) || Number(b.consent) - Number(a.consent) || b.paid - a.paid,
  );
}

export default function AiInsightsPage() {
  useStyleSheet('AiInsightsPage', styleText);
  const [tab, setTab] = useState<Kind>('due');
  const [ended, setEnded] = useState<string[]>([]);

  const rows = sorted(DATA.filter((r) => r.kind === tab));
  const total = TABS.find((t) => t[0] === tab)![2];

  function action(r: Row, i: number) {
    if (!r.consent) return <span className="meta" style={{ maxWidth: 190 }}>다음 방문 시 수신 동의 요청</span>;
    if (r.kind === 'due') return <AppLink href="/campaigns" className="btn btn-p">재방문 안내 캠페인</AppLink>;
    if (r.kind === 'risk') return <AppLink href="/campaigns" className="btn btn-p">안부 메시지 보내기</AppLink>;
    return null;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1100px' }}>
      <div style={{ flex: '0 0 232px', background: '#F4EBE6' }}>
        <Sidebar active="insights" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="Customer Intelligence / 재방문 관리" />
        <div className="wrap">
          <div className="row between" style={{ alignItems: 'flex-end' }}>
            <div className="col" style={{ gap: 6 }}>
              <h1 className="h1">재방문 관리</h1>
              <p className="sub">시술별 방문 주기를 기준으로, 먼저 연락할 고객을 우선순위 순으로 보여드려요.</p>
            </div>
            <AppLink href="/campaigns" className="btn">캠페인 관리</AppLink>
          </div>

          <section className="card col" style={{ gap: 8 }}>
            <h2 className="h2">우선순위 규칙</h2>
            <ol className="sub" style={{ margin: 0, paddingLeft: 20 }}>
              <li>경과 비율 높은 순 — (오늘 − 예측 종료일) ÷ 이탈 신호 기간</li>
              <li>마케팅 수신 동의 고객 먼저</li>
              <li>최근 6개월 결제 합계 높은 순</li>
            </ol>
            <p className="meta">다음 예약이 있는 고객은 이 목록에서 빠져요. 수신 동의가 없는 고객에게는 캠페인을 보낼 수 없어요.</p>
          </section>

          <div className="tabs" role="tablist" aria-label="관리 대상">
            {TABS.map(([id, label, n]) => (
              <button type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} key={id}>
                {label} {n}
              </button>
            ))}
          </div>

          <section className="card" style={{ padding: '8px 26px 14px' }}>
            {rows.map((r, i) => {
              const done = ended.includes(r.id);
              const pct = Math.min(ratio(r), 1) * 100;
              return (
                <article className="irow" key={r.id} style={{ opacity: done ? 0.55 : 1, borderTop: i === 0 ? 0 : undefined }}>
                  <span className="rank">{i + 1}</span>
                  <div className="row" style={{ gap: 12, flexWrap: 'nowrap' }}>
                    <Avatar who={r.name} size="40" />
                    <div className="col">
                      <strong>{r.name} <span className="meta" style={{ fontWeight: 400 }}>· {r.cat}</span></strong>
                      <span className="meta num">최근 {r.last} · 예측 {r.range}</span>
                      <span className="row" style={{ gap: 6 }}>
                        <span className="chip" style={{ background: KIND[r.kind].bg, color: KIND[r.kind].fg }}><i></i>{KIND[r.kind].label}</span>
                        <span className="chip" style={{ background: r.consent ? '#F9EBE8' : '#F3EEEE', color: r.consent ? '#85505A' : '#5B5552' }}>
                          수신 {r.consent ? '동의' : '미동의'}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="col" style={{ gap: 4 }}>
                    <span className="sub num">
                      경과 비율 <strong>{r.over === 0 ? '예측 기간 중' : Math.round(ratio(r) * 100) + '%'}</strong>
                      {r.over > 0 ? ` (${r.over}일 ÷ ${r.risk}일)` : ''}
                    </span>
                    <div className="bar"><div style={{ width: pct + '%' }}></div></div>
                    <span className="meta num">6개월 결제 {won(r.paid)}</span>
                  </div>
                  <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
                    {action(r, i)}
                    {r.kind === 'long' ? (
                      <button type="button" className="btn" disabled={done} onClick={() => setEnded([...ended, r.id])}>
                        {done ? '관리 종료됨' : '관리 종료'}
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
            <p className="meta" style={{ paddingTop: 12, borderTop: '1px solid #F1E4E0' }}>
              {total}명 중 우선순위 상위 {rows.length}명 표시
              {tab === 'long' ? ' · 장기 미방문 고객은 [관리 종료] 처리하면 이 목록과 캠페인 대상에서 빠져요.' : ''}
            </p>
          </section>
          <p className="meta">시연용 데이터예요. 예측 기간 안은 주기 도래, 예측 종료 후 이탈 신호 기간은 이탈 신호, 그 이후는 장기 미방문으로 분류해요.</p>
        </div>
      </main>
    </div>
  );
}
