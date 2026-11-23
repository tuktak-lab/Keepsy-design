import { useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { Avatar } from '@/components/common/Avatar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import logo from '@/assets/images/keepsy-logo-thin.png';
import styleText from './DashboardPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

type Pt = [number, number];

// 점들을 부드러운 곡선(path)으로 연결합니다.
function smooth(pts: Pt[]): string {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function Spark({ values, id }: { values: number[]; id: string }) {
  const W = 200;
  const H = 64;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts: Pt[] = values.map((v, i) => [(i / (values.length - 1)) * W, H - 6 - ((v - min) / (max - min || 1)) * (H - 16)]);
  const line = smooth(pts);
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EBC5C0" stopOpacity=".55" />
          <stop offset="1" stopColor="#EBC5C0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W},${H} L0,${H} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="#CBA3A3" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d}></path>
  </svg>
);

const ICON = {
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6 M17 11a2.5 2.5 0 1 0 0-5 M18 14c2.5.3 4 2.2 4 5',
  userPlus: 'M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M3 10h18 M12 13v5 M9.5 15.5h5',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  gift: 'M4 11h16v9H4z M3 7h18v4H3z M12 7v13 M12 7c-1-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-4-2-5 1',
  chart: 'M5 20v-7 M12 20V5 M19 20v-10',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  trend: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
  bulb: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  done: 'M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M3 10h18 M9 16l2 2 4-4',
  cal: 'M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M3 10h18 M8 2v4 M16 2v4',
};

export default function DashboardPage() {
  useStyleSheet('DashboardPage', styleText);
  const [range, setRange] = useState('최근 6개월');

  const kpis = [
    { label: '전체 고객', value: '248', icon: ICON.users, delta: '+12%', extra: '', series: [3, 4, 3.6, 5, 4.6, 6, 7], href: '/customers' },
    { label: '오늘 예약', value: '9', icon: ICON.cal, delta: '', extra: '확정 7 · 상담 후 진행 2', series: [3, 3.4, 3.2, 4.4, 4, 5, 5.6], href: '/schedule' },
    { label: '마감 안 된 예약', value: '2', icon: ICON.done, delta: '', extra: '지난 예약 · 시술 마감 필요', series: [2, 3, 2.6, 3.6, 2.4, 3, 2], href: '/schedule' },
    { label: '주기 도래 고객', value: '14', icon: ICON.heart, delta: '', extra: '예약 없음 · 우선순위 순', series: [2, 2.6, 2.4, 3.4, 3.8, 3.6, 5], href: '/insights' },
  ];


  const segs = [
    { label: '예정', n: 198, color: '#F0DAD6', rule: '다음 방문 예측 기간 전' },
    { label: '주기 도래', n: 14, color: '#85505A', rule: '예측 기간 안 · 예약 없음' },
    { label: '이탈 신호', n: 22, color: '#CC9A9E', rule: '예측 종료 후 이탈 신호 기간 안' },
    { label: '장기 미방문', n: 14, color: '#C9BDB9', rule: '이탈 신호 기간 이후' },
  ];

  const R = 98;
  const C = 2 * Math.PI * R;
  let cum = 0;
  const arcs = segs.map((s) => {
    const len = (s.n / 248) * C;
    const a = { color: s.color, dash: `${Math.max(len - 3, 0)} ${C - len + 3}`, off: -cum };
    cum += len;
    return a;
  });

  // 방문 흐름 차트 (viewBox 기준 좌표)
  const CW = 1100;
  const CH = 200;
  const X0 = 56;
  const X1 = CW - 24;
  const yOf = (v: number) => CH - 24 - (v / 130) * (CH - 44);
  const toPts = (vs: number[]): Pt[] => vs.map((v, i) => [X0 + (i / (vs.length - 1)) * (X1 - X0), yOf(v)]);
  const visit = toPts([54, 76, 121, 86, 130, 89, 116]);
  const fresh = toPts([30, 37, 64, 33, 76, 43, 22]);
  const returning = toPts([22, 30, 52, 28, 66, 36, 18]);
  const visitLine = smooth(visit);

  const T: Record<string, [string, string]> = {
    '주기 도래': ['#F5EBD3', '#6B4509'],
    '이탈 신호': ['#F4E0DC', '#8F2F2F'],
  };
  const care = [
    { name: '최유진', days: '35일 경과 / 평균 28일', tag: '주기 도래', note: '수신 동의 · 예약 없음', cta: '캠페인 생성', href: '/campaigns' },
    { name: '정하린', days: '70일 경과 / 평균 35일', tag: '이탈 신호', note: '수신 미동의 · 방문 시 동의 요청', cta: '상담 메모', href: '/customers/detail' },
    { name: '오서현', days: '44일 경과 / 평균 35일', tag: '이탈 신호', note: '수신 동의 · 최근 이력 확인', cta: '캠페인 생성', href: '/campaigns' },
  ];

  const acts = [
    { t: '11.20', name: '김민지', what: '젤 네일 · 17:00 · 시술 마감 필요' },
    { t: '11.19', name: '박지은', what: '속눈썹 연장 · 15:30 · 시술 마감 필요' },
  ];


  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1040px' }}>
      <div style={{ flex: '0 0 232px', background: '#F4EBE6' }}>
        <Sidebar active="dashboard" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="Customer Intelligence / Overview" />
        <div className="kp-wrap">
          <div className="kp-hero">
            <div>
              <h1 className="kp-hello">
                안녕하세요,
                <br />
                <img src={logo} alt="Keepsy" className="kp-hello-logo" />
                입니다
                <svg className="kp-spark-star" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"></path>
                </svg>
              </h1>
              <p className="kp-lead">오늘도 고객과 더 가까워지는 하루가 되길 바라요.</p>
            </div>
            <AppLink href="/insights" className="kp-cta">
              <Icon d={ICON.spark} size={18} />
              오늘 관리할 고객 보기
              <Icon d={ICON.arrow} size={18} />
            </AppLink>
          </div>

          <section className="kp-kpis" aria-label="고객 현황 요약">
            {kpis.map((k, i) => (
              <AppLink href={k.href} className="kp-card kp-kpi" key={k.label}>
                <Spark values={k.series} id={`kpspark${i}`} />
                <div className="kp-kpi-head">
                  <span className="kp-ico">
                    <Icon d={k.icon} size={22} />
                  </span>
                  {k.label}
                </div>
                <div className="kp-kpi-val num">{k.value}</div>
                <div className="kp-kpi-note">
                  {k.delta && (
                    <span className="up">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                        <path d="M5 1l4.5 8h-9z"></path>
                      </svg>
                      {k.delta}
                    </span>
                  )}
                  {k.delta && k.extra && <span className="sep" />}
                  {k.extra}
                </div>
              </AppLink>
            ))}
          </section>

          <div className="kp-mid">
            <section className="kp-card kp-rel">
              <div className="kp-card-head">
                <div>
                  <h2 className="kp-card-title">
                    <Icon d={ICON.chart} size={24} />
                    고객 재방문 상태
                  </h2>
                  <p className="kp-card-sub">시술별 방문 주기 예측으로 보는 현재 상태</p>
                </div>
                <div className="kp-seg" role="group" aria-label="기간">
                  {['최근 6개월', '1년', '전체'].map((r) => (
                    <button type="button" key={r} aria-pressed={range === r} onClick={() => setRange(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="kp-rel-body">
                <div className="kp-donut">
                  <svg
                    width="224"
                    height="224"
                    viewBox="0 0 224 224"
                    role="img"
                    aria-label="재방문 상태 분포: 예정 198명, 주기 도래 14명, 이탈 신호 22명, 장기 미방문 14명"
                  >
                    <g transform="rotate(-90 112 112)" fill="none" strokeWidth="30">
                      {arcs.map((a, i) => (
                        <circle cx="112" cy="112" r={R} stroke={a.color} strokeDasharray={a.dash} strokeDashoffset={a.off} key={i}></circle>
                      ))}
                    </g>
                  </svg>
                  <div className="kp-donut-center">
                    <b className="num">248</b>
                    <span>전체 고객</span>
                  </div>
                </div>
                <div className="kp-seglist">
                  {segs.map((s) => (
                    <AppLink href="/customers" className="kp-segrow" key={s.label}>
                      <span className="kp-dot" style={{ background: s.color }}></span>
                      <span className="name">{s.label}</span>
                      <span className="rule">{s.rule}</span>
                      <span className="n num">{s.n}명</span>
                    </AppLink>
                  ))}
                </div>
              </div>
            </section>

            <section className="kp-card kp-insight">
              <div className="kp-card-head" style={{ alignItems: 'center' }}>
                <h2 className="kp-card-title" style={{ fontWeight: 500 }}>
                  <Icon d={ICON.spark} size={24} />
                  최근 캠페인 성과
                </h2>
                <AppLink href="/performance" className="kp-circle-btn" aria-label="성과 분석 보기">
                  <Icon d={ICON.arrow} size={16} />
                </AppLink>
              </div>
              <div className="kp-insight-img">
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="8" y="12" width="46" height="42" rx="6" fill="#F6EEEA"></rect>
                  <path d="M8 26h46 M20 8v10 M42 8v10"></path>
                  <path d="M18 34h4 M28 34h4 M38 34h4 M18 42h4 M28 42h4" strokeWidth="3"></path>
                  <circle cx="52" cy="50" r="13" fill="#F6EEEA"></circle>
                  <path d="M52 43v7l5 3"></path>
                </svg>
              </div>
              <p className="kp-insight-msg">
                11월 재방문 안내,
                <br />
                재예약 전환율 18%로
                <br />
                대조군보다 6%p 높아요!
              </p>
              <div className="kp-insight-foot">
                <Icon d={ICON.bulb} size={20} />
                <span>
                  귀속 기간 14일 · 모의 데이터
                  <br />
                  기준 값이에요.
                </span>
                <AppLink href="/performance" className="kp-more">
                  더보기
                  <Icon d={ICON.arrow} size={14} />
                </AppLink>
              </div>
            </section>
          </div>

          <section className="kp-card kp-flow">
            <div className="kp-card-head">
              <div>
                <h2 className="kp-card-title">
                  <Icon d={ICON.trend} size={24} />
                  고객의 방문 흐름
                </h2>
                <p className="kp-card-sub" style={{ marginLeft: 0, marginTop: '8px' }}>
                  최근 4주 · 주별 신규 / 재방문 고객
                </p>
              </div>
              <div className="kp-legend">
                <span><i style={{ background: '#85505A' }}></i>방문 고객</span>
                <span><i style={{ background: '#EBC5C0' }}></i>신규</span>
                <span><i style={{ background: '#CF8E94' }}></i>재방문</span>
              </div>
            </div>
            <svg className="kp-chart" viewBox={`0 0 ${CW} ${CH}`} role="img" aria-label="최근 4주 주별 방문 고객, 신규, 재방문 추이">
              <defs>
                <linearGradient id="kpflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#CDBDB5" stopOpacity=".45" />
                  <stop offset="1" stopColor="#CDBDB5" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 50, 100].map((g) => (
                <g key={g}>
                  <line x1={X0} x2={X1} y1={yOf(g)} y2={yOf(g)} stroke="#E6D8D1" strokeWidth="1" strokeDasharray={g === 0 ? '' : '3 5'} />
                  <text x={X0 - 14} y={yOf(g) + 4} textAnchor="end" fontSize="13" fill="#7A6D68">{g}</text>
                </g>
              ))}
              {visit.slice(1, -1).map(([x]) => (
                <line key={x} x1={x} x2={x} y1={yOf(0)} y2={yOf(130)} stroke="#EADFD8" strokeWidth="1" />
              ))}
              <path d={`${visitLine} L${X1},${yOf(0)} L${X0},${yOf(0)} Z`} fill="url(#kpflow)" />
              <path d={smooth(returning)} fill="none" stroke="#E3BEBE" strokeWidth="1.6" />
              <path d={smooth(fresh)} fill="none" stroke="#CF8E94" strokeWidth="1.8" />
              <path d={visitLine} fill="none" stroke="#85505A" strokeWidth="1.8" />
              {visit.slice(1).map(([x, y], i) => (
                <circle key={`v${i}`} cx={x} cy={y} r="4.5" fill="#85505A" />
              ))}
              {fresh.slice(1).map(([x, y], i) => (
                <circle key={`f${i}`} cx={x} cy={y} r="4.5" fill="#CF8E94" />
              ))}
            </svg>
          </section>

          <div className="kp-low">
            <section className="kp-card kp-care">
              <h2 className="kp-card-title">오늘 관리할 고객</h2>
              <p className="kp-card-sub" style={{ marginLeft: 0, marginBottom: '8px' }}>
                경과 비율 → 수신 동의 → 최근 6개월 결제 순으로 정렬했어요.
              </p>
              {care.map((c) => (
                <div className="kp-care-row" key={c.name}>
                  <Avatar who={c.name} size="40" />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <AppLink href="/customers/detail" style={{ fontWeight: 600, fontSize: '15px' }}>
                      {c.name}
                    </AppLink>
                    <span style={{ fontSize: '12.5px', color: '#7A6D68' }}>
                      {c.days} · {c.note}
                    </span>
                  </div>
                  <span className="kp-tag" style={{ background: T[c.tag][0], color: T[c.tag][1] }}>
                    {c.tag}
                  </span>
                  <AppLink href={c.href} className="kp-btn p">
                    {c.cta}
                  </AppLink>
                </div>
              ))}
            </section>
            <section className="kp-card kp-act">
              <h2 className="kp-card-title" style={{ marginBottom: '8px' }}>마감 안 된 예약</h2>
              {acts.map((a) => (
                <div className="kp-act-row" key={a.t}>
                  <span className="num" style={{ fontWeight: 600, color: '#8A6F66', fontSize: '13px' }}>{a.t}</span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '14px' }}>{a.name}</strong>
                    <span style={{ fontSize: '13px', color: '#6A5D58' }}>{a.what}</span>
                  </span>
                </div>
              ))}
            </section>
          </div>

          <p className="kp-foot">예시 고객 · 운영 데이터 · 방문 현황 10.22–11.20 / 고객 관계 · 관리 상태 11.21 13:20 기준</p>
        </div>
      </main>
    </div>
  );
}
