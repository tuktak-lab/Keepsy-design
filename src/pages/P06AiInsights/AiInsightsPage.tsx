import { useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { images } from '@/assets/images';
import styleText from './AiInsightsPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';
import { smooth, type Pt } from '@/utils/smooth';
import { CountUp } from '@/components/common/CountUp';

type Kind = 'due' | 'risk' | 'long';
type PhotoKey = 'milky' | 'hero' | 'gloss' | 'french';
interface Row {
  id: string;
  kind: Kind;
  name: string;
  cat: string;
  last: string;
  range: string;
  over: number; // 예측 종료일 이후 경과일(오늘 11.23 기준, 예측 기간 안이면 0)
  risk: number; // 이탈 신호 기간(일) = 고객의 해당 시술 평균 간격
  consent: boolean;
  paid: number; // 최근 6개월 결제 합계
  pref: string; // 취향 요약
  photo: PhotoKey | null; // 대표 시술 사진 (사진 동의 고객만)
  tags: [string, number][]; // 시술 기록 태그별 횟수
  shots: [PhotoKey, string][]; // 최근 시술 사진
}

const TABS: [Kind, string, number][] = [
  ['due', '주기 도래', 14],
  ['risk', '이탈 신호', 22],
  ['long', '장기 미방문', 14],
];
const TOTAL = TABS.reduce((s, t) => s + t[2], 0);
const SENDABLE = 11; // 주기 도래 고객 중 마케팅 수신 동의

const KIND = {
  due: { label: '주기 도래', cls: 'due' },
  risk: { label: '이탈 신호', cls: 'risk' },
  long: { label: '장기 미방문', cls: 'long' },
};

const PHOTO: Record<PhotoKey, string> = {
  milky: images.nailMilky,
  hero: images.nailHero,
  gloss: images.nailGloss,
  french: images.nailFrench,
};

const DATA: Row[] = [
  {
    id: 'a1', kind: 'due', name: '최유진', cat: '네일', last: '10.24', range: '11.20 ~ 11.27', over: 0, risk: 30, consent: true, paid: 358000,
    pref: '미니멀 · 프렌치 선호', photo: 'milky', tags: [['미니멀', 4], ['프렌치', 1], ['포인트', 1]],
    shots: [['french', '클린 프렌치'], ['hero', '젤 포인트'], ['gloss', '쥬얼 글로시']],
  },
  {
    id: 'a2', kind: 'due', name: '한예린', cat: '네일', last: '10.21', range: '11.18 ~ 11.25', over: 0, risk: 30, consent: false, paid: 242000,
    pref: '프렌치 · 펄 선호', photo: 'french', tags: [['프렌치', 3], ['펄', 2]],
    shots: [['french', '클린 프렌치'], ['milky', '밀키 펄']],
  },
  {
    id: 'a3', kind: 'due', name: '김수아', cat: '속눈썹', last: '10.16', range: '11.19 ~ 11.26', over: 0, risk: 30, consent: true, paid: 296000,
    pref: '내추럴 컬 선호', photo: null, tags: [['내추럴', 3], ['C컬', 2]], shots: [],
  },
  {
    id: 'b1', kind: 'risk', name: '강유나', cat: '네일', last: '10.02', range: '10.26 ~ 10.30', over: 24, risk: 30, consent: true, paid: 410000,
    pref: '딥 컬러 · 글로시 선호', photo: 'gloss', tags: [['글로시', 3], ['딥 컬러', 2], ['아트', 1]],
    shots: [['gloss', '딥 플럼 글로시'], ['hero', '시그니처 펄']],
  },
  {
    id: 'b2', kind: 'risk', name: '정하린', cat: '네일', last: '09.12', range: '10.25 ~ 11.01', over: 22, risk: 30, consent: false, paid: 186000,
    pref: '프렌치 · 누드 선호', photo: 'french', tags: [['프렌치', 2], ['누드', 2]],
    shots: [['french', '클린 프렌치'], ['milky', '누드 톤']],
  },
  {
    id: 'b3', kind: 'risk', name: '오서현', cat: '속눈썹', last: '10.08', range: '11.03 ~ 11.10', over: 13, risk: 30, consent: true, paid: 112000,
    pref: '볼륨 선호', photo: null, tags: [['볼륨', 2], ['D컬', 1]], shots: [],
  },
  {
    id: 'c1', kind: 'long', name: '윤다혜', cat: '네일', last: '07.24', range: '08.16 ~ 08.23', over: 92, risk: 30, consent: false, paid: 0,
    pref: '딥 플럼 · 글로시 선호', photo: 'gloss', tags: [['글로시', 2], ['딥 컬러', 2]],
    shots: [['gloss', '딥 플럼 글로시']],
  },
  {
    id: 'c2', kind: 'long', name: '문지후', cat: '왁싱', last: '07.30', range: '09.08 ~ 09.15', over: 69, risk: 45, consent: true, paid: 84000,
    pref: '브라질리언 정기 관리', photo: null, tags: [['브라질리언', 3]], shots: [],
  },
];

const ratio = (r: Row) => r.over / r.risk;

function sorted(rows: Row[]) {
  return [...rows].sort(
    (a, b) => ratio(b) - ratio(a) || Number(b.consent) - Number(a.consent) || b.paid - a.paid,
  );
}

// 방문 흐름 (최근 4주)
const WEEKS: [string, number, number, number][] = [
  ['10.27–11.02', 52, 9, 43],
  ['11.03–11.09', 61, 12, 49],
  ['11.10–11.16', 58, 10, 48],
  ['11.17–11.23', 66, 14, 52],
];
const TREND = [58, 62, 64, 67, 70, 72]; // 최근 6개월 주기 내 재방문율(%)

export default function AiInsightsPage() {
  useStyleSheet('AiInsightsPage', styleText);
  const [tab, setTab] = useState<Kind>('due');
  const [ended, setEnded] = useState<string[]>([]);
  const [pick, setPick] = useState<string | null>(null);
  const [showRule, setShowRule] = useState(false);
  const [tip, setTip] = useState<number | null>(null);

  const rows = sorted(DATA.filter((r) => r.kind === tab));
  const total = TABS.find((t) => t[0] === tab)![2];
  const sel = rows.find((r) => r.id === pick) ?? rows[0];
  const tagMax = Math.max(...sel.tags.map((t) => t[1]));
  const records = sel.tags.reduce((s, t) => s + t[1], 0);

  // 주요 버튼: 수신 동의 고객은 캠페인 생성, 아니면 상담 기록(다음 방문 시 동의 요청)
  function primary(r: Row) {
    if (!r.consent) return <AppLink href="/customers/detail" className="btn">상담 기록</AppLink>;
    if (r.kind === 'long') return null;
    return <AppLink href="/campaigns" className="btn btn-p">캠페인 생성</AppLink>;
  }

  // 차트 좌표
  const CW = 1000, CH = 170, X0 = 40, X1 = CW - 24, MAX = 80;
  const yOf = (v: number) => CH - 28 - (v / MAX) * (CH - 46);
  const xOf = (i: number) => X0 + (i / (WEEKS.length - 1)) * (X1 - X0);
  const line = (k: 1 | 2 | 3): Pt[] => WEEKS.map((w, i) => [xOf(i), yOf(w[k])]);

  return (
    <div className="ai-shell">
      <div style={{ flex: '0 0 232px' }}>
        <Sidebar active="insights" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="Customer Intelligence / 재방문 관리" />
        <div className="wrap">
          <header className="head">
            <div>
              <h1 className="h1">재방문 관리</h1>
              <p className="sub">왜 관리가 필요한지 이해하고, 고객에게 맞는 다음 행동을 결정하세요.</p>
            </div>
            <AppLink href="/campaigns" className="btn">캠페인 관리</AppLink>
          </header>

          <section className="card summary" aria-label="관리 대상 요약">
            <div className="sum-item">
              <span className="meta">관리 대상</span>
              <b className="num">
                <CountUp value={TOTAL} />명
              </b>
            </div>
            {TABS.map(([id, label, n]) => (
              <div className="sum-item" key={id}>
                <span className="meta">{label}</span>
                <b className="num">
                  <CountUp value={n} />명
                </b>
              </div>
            ))}
            <div className="sum-item">
              <span className="meta">주기 내 재방문율 · 30일</span>
              <b className="num">
                <CountUp value={72} format={(n) => n + '%'} />
              </b>
            </div>
            <div className="sum-item end">
              <span className="meta">캠페인 발송 가능</span>
              <b className="num">
                <CountUp value={SENDABLE} />명
              </b>
              <span className="meta">주기 도래 · 수신 동의 고객</span>
            </div>
          </section>

          <div className="main">
            <div className="col" style={{ gap: 12, minWidth: 0 }}>
              <div className="toolbar">
                <div className="tabs" role="tablist" aria-label="관리 대상">
                  {TABS.map(([id, label, n]) => (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={tab === id}
                      onClick={() => {
                        setTab(id);
                        setPick(null);
                      }}
                      key={id}
                    >
                      {label} <span className="num">{n}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="rule-toggle" aria-expanded={showRule} onClick={() => setShowRule(!showRule)}>
                  우선순위 규칙 {showRule ? '닫기' : '보기'}
                </button>
              </div>

              {showRule && (
                <section className="card rules">
                  <ol>
                    <li>경과 비율 높은 순 — (오늘 − 예측 종료일) ÷ 이탈 신호 기간</li>
                    <li>마케팅 수신 동의 고객 먼저</li>
                    <li>최근 6개월 결제 합계 높은 순</li>
                  </ol>
                  <p className="meta">다음 예약이 있는 고객은 이 목록에서 빠져요. 수신 동의가 없는 고객에게는 캠페인을 보낼 수 없어요.</p>
                </section>
              )}

              <section className="card list" aria-label="관리 대상 고객">
                <div className="irow ihead" aria-hidden="true">
                  <span></span>
                  <span>고객 · 관리 상태</span>
                  <span>예상 방문 기간</span>
                  <span>최근 방문 · 평균 주기</span>
                  <span>선호 시술</span>
                  <span></span>
                </div>
                <div className="kp-fade" key={tab}>
                {rows.map((r, i) => {
                  const done = ended.includes(r.id);
                  const on = sel.id === r.id;
                  return (
                    <article
                      className={'irow' + (on ? ' on' : '')}
                      key={r.id}
                      style={{ opacity: done ? 0.5 : 1 }}
                      onClick={() => setPick(r.id)}
                    >
                      <div className="thumb">
                        {r.photo ? <img src={PHOTO[r.photo]} alt="" /> : <span>{r.cat}</span>}
                      </div>
                      <div className="c-name">
                        <span className="nm">
                          <span className="rank num">{i + 1}</span>
                          <strong>{r.name}</strong>
                          <span className={'chip ' + KIND[r.kind].cls}>{KIND[r.kind].label}</span>
                        </span>
                        <span className="meta">
                          {r.consent ? '수신 동의' : '수신 미동의 · 방문 시 동의 요청'}
                          {r.over > 0 ? ` · 경과 ${Math.round(ratio(r) * 100)}%` : ''}
                        </span>
                      </div>
                      <div className="cell">
                        <span className="lbl-m">예상 방문 기간</span>
                        <b className="num">{r.range}</b>
                        <span className="meta num">{r.over === 0 ? '예측 기간 중' : `종료 후 ${r.over}일 경과`}</span>
                      </div>
                      <div className="cell">
                        <span className="lbl-m">최근 방문 · 평균 주기</span>
                        <b className="num">{r.last}</b>
                        <span className="meta num">평균 {r.risk}일 주기</span>
                      </div>
                      <div className="cell">
                        <span className="lbl-m">선호 시술</span>
                        <b>{r.pref.replace(/ 선호$/, '')}</b>
                        <span className="meta">{r.cat}</span>
                      </div>
                      <div className="acts" onClick={(e) => e.stopPropagation()}>
                        <AppLink href="/customers/detail" className="btn">고객 확인</AppLink>
                        {primary(r)}
                        {r.kind === 'long' ? (
                          <button type="button" className="btn" disabled={done} onClick={() => setEnded([...ended, r.id])}>
                            {done ? '관리 종료됨' : '관리 종료'}
                          </button>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
                </div>
                <p className="meta list-foot">
                  {total}명 중 우선순위 상위 {rows.length}명 표시
                  {tab === 'long' ? ' · [관리 종료] 처리하면 이 목록과 캠페인 대상에서 빠져요.' : ''}
                </p>
              </section>
            </div>

            <aside className="col" style={{ gap: 12, minWidth: 0 }}>

              <section className="card pref kp-slide" aria-live="polite" key={sel.id}>
                <h2 className="h2">{sel.name}님 선호 디자인</h2>
                <p className="meta num">시술 기록 {records}건 기준</p>
                <div className="tags">
                  {sel.tags.map(([t, n]) => (
                    <div className="tag-row" key={t}>
                      <span>{t}</span>
                      <span className="tbar"><span style={{ width: (n / tagMax) * 100 + '%' }}></span></span>
                      <span className="num">{n}회</span>
                    </div>
                  ))}
                </div>
                {sel.shots.length ? (
                  <div className="shots">
                    {sel.shots.map(([k, cap]) => (
                      <figure key={cap}>
                        <img src={PHOTO[k]} alt={cap} />
                        <figcaption>{cap}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p className="meta empty">등록된 시술 사진이 없어요. 사진은 사진 동의 고객만 등록할 수 있어요.</p>
                )}
              </section>
            </aside>
          </div>

          <section className="card flow" aria-label="고객의 방문 흐름">
            <div className="card-h">
              <div>
                <h2 className="h2">고객의 방문 흐름</h2>
                <p className="meta">최근 4주 · 주별 방문 / 신규 / 재방문 고객</p>
              </div>
              <div className="legend">
                <span><i style={{ background: '#3B302C' }}></i>방문 고객</span>
                <span><i style={{ background: '#B89A93' }}></i>신규</span>
                <span><i style={{ background: '#7A4450' }}></i>재방문</span>
              </div>
            </div>
            <div className="chart-wrap" onMouseLeave={() => setTip(null)}>
              <svg className="chart" viewBox={`0 0 ${CW} ${CH}`} role="img" aria-label={WEEKS.map((w) => `${w[0]} 방문 ${w[1]}명, 신규 ${w[2]}명, 재방문 ${w[3]}명`).join('; ')}>
                {[0, 40, 80].map((g) => (
                  <g key={g}>
                    <line x1={X0} x2={X1} y1={yOf(g)} y2={yOf(g)} stroke="#E6DDD5" />
                    <text x={X0 - 10} y={yOf(g) + 4} textAnchor="end" fontSize="12.5" fill="#6B605B">{g}</text>
                  </g>
                ))}
                {tip !== null ? <line x1={xOf(tip)} x2={xOf(tip)} y1={yOf(0)} y2={yOf(MAX)} stroke="#B5ABA4" /> : null}
                <path className="kp-draw" pathLength={1} d={smooth(line(2))} fill="none" stroke="#B89A93" strokeWidth="2" />
                <path className="kp-draw" pathLength={1} d={smooth(line(3))} fill="none" stroke="#7A4450" strokeWidth="2" />
                <path className="kp-draw" pathLength={1} d={smooth(line(1))} fill="none" stroke="#3B302C" strokeWidth="2" />
                {WEEKS.map((w, i) => (
                  <g key={w[0]}>
                    <g className="kp-pop">
                      <circle cx={xOf(i)} cy={yOf(w[1])} r={tip === i ? 5 : 3.5} fill="#3B302C" className="pt" />
                      <circle cx={xOf(i)} cy={yOf(w[3])} r={tip === i ? 5 : 3.5} fill="#7A4450" className="pt" />
                      <circle cx={xOf(i)} cy={yOf(w[2])} r={tip === i ? 5 : 3.5} fill="#B89A93" className="pt" />
                    </g>
                    <text x={xOf(i)} y={CH - 6} textAnchor={i === 0 ? 'start' : i === WEEKS.length - 1 ? 'end' : 'middle'} fontSize="12.5" fill={tip === i ? '#221D1B' : '#6B605B'} fontWeight={tip === i ? 600 : 400}>{w[0]}</text>
                    <rect
                      x={xOf(i) - (X1 - X0) / (WEEKS.length - 1) / 2}
                      y={0}
                      width={(X1 - X0) / (WEEKS.length - 1)}
                      height={CH}
                      fill="transparent"
                      onMouseEnter={() => setTip(i)}
                    />
                  </g>
                ))}
              </svg>
              {tip !== null ? (
                <div className="kp-tip" style={{ left: `${(xOf(tip) / CW) * 100}%`, top: `${(yOf(WEEKS[tip][1]) / CH) * 100}%` }}>
                  <span className="num">{WEEKS[tip][0]}</span>
                  <br />
                  <b className="num">방문 {WEEKS[tip][1]}명</b> · 신규 {WEEKS[tip][2]}명 · 재방문 {WEEKS[tip][3]}명
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
