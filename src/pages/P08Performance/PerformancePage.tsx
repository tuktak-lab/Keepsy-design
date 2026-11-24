import { useEffect, useState, type ReactNode } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { PinGate } from '@/components/common/PinGate';
import { CountUp } from '@/components/common/CountUp';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styleText from './PerformancePage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

type Camp = {
  id: string;
  name: string;
  cat: string;
  date: string;
  sent: number;
  reach: number;
  rebook: number;
  visit: number;
  sales: number;
  ctrlN: number;
  ctrlVisit: number;
};

const CAMPS: Camp[] = [
  { id: 'c3', name: '펄 디자인 재방문 캠페인', cat: '젤 네일', date: '11.06', sent: 24, reach: 23, rebook: 6, visit: 5, sales: 310000, ctrlN: 6, ctrlVisit: 1 },
  { id: 'c4', name: '가을 컬러 리마인드', cat: '젤 네일', date: '11.13', sent: 24, reach: 24, rebook: 4, visit: 3, sales: 176000, ctrlN: 6, ctrlVisit: 0 },
];

const CAT_RATE = [
  { cat: '젤 네일', n: 62, rate: 68 },
  { cat: '속눈썹 연장', n: 31, rate: 72 },
  { cat: '네일 케어', n: 24, rate: 61 },
  { cat: '패디큐어', n: 18, rate: 55 },
];

const ACC = [
  { cat: '젤 네일', hit: 81, err: 2.9 },
  { cat: '속눈썹 연장', hit: 79, err: 3.1 },
  { cat: '네일 케어', hit: 74, err: 4.0 },
  { cat: '패디큐어', hit: 70, err: 4.6 },
];

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);
const won = (n: number) => n.toLocaleString() + '원';
const unit = (u: string) => (n: number) => n + u;

// 막대: 처음 진입 시 0 → 값으로 한 번 차오르고, 값이 바뀌면 transition 으로 이동. hover 시 정확한 수치 툴팁.
function Bar(props: { w: number; color: string; tip: ReactNode; grown: boolean; show: boolean }) {
  const w = Math.max(0, Math.min(100, props.w));
  return (
    <span className="pf-barwrap">
      <span className="pf-bar"><i style={{ width: props.grown ? `${w}%` : '0%', background: props.color }} /></span>
      {props.show ? <span className="kp-tip" style={{ left: `${Math.max(6, Math.min(94, w))}%`, top: 0 }}>{props.tip}</span> : null}
    </span>
  );
}

function Body() {
  const [sel, setSel] = useState('all');
  const [grown, setGrown] = useState(false);
  const [hover, setHover] = useState('');
  useEffect(() => {
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setGrown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  const list = sel === 'all' ? CAMPS : CAMPS.filter((x) => x.id === sel);
  const sum = (k: keyof Camp) => list.reduce((a, x) => a + (x[k] as number), 0);
  const sent = sum('sent');
  const reach = sum('reach');
  const rebook = sum('rebook');
  const visit = sum('visit');
  const sales = sum('sales');
  const ctrlN = sum('ctrlN');
  const ctrlVisit = sum('ctrlVisit');

  const funnel = [
    { label: '발송', n: sent, c: '#D9AFA6' },
    { label: '도달', n: reach, c: '#CC9A9E' },
    { label: '재예약', n: rebook, c: '#A9707A' },
    { label: '재방문', n: visit, c: '#7A4450' },
  ];
  const sendRate = pct(visit, sent);
  const ctrlRate = pct(ctrlVisit, ctrlN);
  const diff = Math.round((sendRate - ctrlRate) * 10) / 10;
  const totalAcc = Math.round(ACC.reduce((a, x) => a + x.hit * 1, 0) / ACC.length);
  const avgErr = Math.round((ACC.reduce((a, x) => a + x.err, 0) / ACC.length) * 10) / 10;

  return (
    <div className="pf-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 className="pf-h1">성과 분석</h1>
          <p className="pf-sub">발송 이후의 재예약과 재방문, 대조군과의 차이까지 캠페인 결과를 확인하세요.</p>
        </div>
        <div className="pf-seg" role="group" aria-label="캠페인 선택">
          <button type="button" aria-pressed={sel === 'all'} onClick={() => setSel('all')}>전체</button>
          {CAMPS.map((x) => (
            <button type="button" key={x.id} aria-pressed={sel === x.id} onClick={() => setSel(x.id)}>{x.name}</button>
          ))}
        </div>
      </div>

      <section className="pf-kpis pf-card" aria-label="성과 요약">
        <div className="pf-kpi"><span>발송</span><b className="num"><CountUp value={sent} format={unit('건')} /></b><em>가상 발송 기준 · 캠페인 {list.length}개</em></div>
        <div className="pf-kpi"><span>재예약</span><b className="num" style={{ color: '#7A4450' }}><CountUp value={rebook} format={unit('건')} /></b><em className="num">발송 대비 {pct(rebook, sent)}%</em></div>
        <div className="pf-kpi"><span>재방문</span><b className="num"><CountUp value={visit} format={unit('건')} /></b><em className="num">발송 대비 {sendRate}%</em></div>
        <div className="pf-kpi"><span>연결 매출</span><b className="num"><CountUp value={sales} format={won} /></b><em>귀속된 재방문 결제 합계</em></div>
      </section>

      <div className="pf-two">
        <section className="pf-card" aria-label="전환 퍼널">
          <div>
            <h2>발송에서 재방문까지</h2>
            <span className="pf-note">발송 → 도달 → 재예약 → 재방문 · 고객은 캠페인별 1회 집계</span>
          </div>
          <div>
            {funnel.map((f) => (
              <div className="pf-frow" key={f.label} onMouseEnter={() => setHover('f' + f.label)} onMouseLeave={() => setHover('')}>
                <span style={{ fontSize: 13, color: '#4A3F3B' }}>{f.label}</span>
                <Bar w={pct(f.n, sent)} color={f.c} grown={grown} show={hover === 'f' + f.label} tip={<>{f.label} <b>{f.n}건</b> · 발송 대비 {pct(f.n, sent)}%</>} />
                <b className="num" style={{ textAlign: 'right' }}><CountUp value={f.n} format={unit('건')} /></b>
                <span className="num pf-note" style={{ textAlign: 'right' }}>{pct(f.n, sent)}%</span>
              </div>
            ))}
          </div>
          <span className="pf-note">전환율은 발송 건수 기준이에요.</span>
        </section>

        <section className="pf-card" aria-label="귀속 규칙">
          <h2>귀속 규칙</h2>
          <div className="pf-box">
            캠페인 성과로 인정하는 기준이에요.
            <ul>
              <li>귀속 기간: 발송 후 기본 14일</li>
              <li>같은 시술 카테고리의 예약만 인정</li>
              <li>기간 안 고객의 첫 예약만 집계</li>
              <li>여러 캠페인을 받았다면 가장 최근 발송에 연결</li>
            </ul>
          </div>
          <span className="pf-note">연결 매출은 위 규칙으로 귀속된 재방문의 결제 금액이에요.</span>
        </section>
      </div>

      <div className="pf-two">
        <section className="pf-card" aria-label="대조군 비교">
          <div>
            <h2>대조군 비교</h2>
            <span className="pf-note">발송군과 발송하지 않은 대조군의 주기 내 재방문율 비교</span>
          </div>
          <div className="pf-cmp">
            <div><span>발송군</span><b className="num"><CountUp value={sendRate} decimals={1} format={unit('%')} /></b><span className="num">{visit}/{sent}명</span></div>
            <div><span>대조군</span><b className="num"><CountUp value={ctrlRate} decimals={1} format={unit('%')} /></b><span className="num">{ctrlVisit}/{ctrlN}명</span></div>
            <div><span>차이</span><b className="num" style={{ color: diff >= 0 ? '#7A4450' : '#8F2F2F' }}><CountUp value={diff} decimals={1} format={(n) => (n >= 0 ? '+' : '') + n + '%p'} /></b><span>발송군 − 대조군</span></div>
          </div>
          <span className="pf-note">대조군은 대상 중 무작위로 발송하지 않은 고객이에요. 인원이 적어 차이를 단정하기는 어려워요.</span>
        </section>

        <section className="pf-card" aria-label="예측 정확도">
          <h2>예측 정확도</h2>
          <div className="pf-cmp" style={{ gridTemplateColumns: 'repeat(2,minmax(0,1fr))' }}>
            <div><span>기간 적중률</span><b className="num">{totalAcc}%</b><span>예측 기간 안에 실제 방문</span></div>
            <div><span>평균 오차</span><b className="num">{avgErr}일</b><span>예측일과 실제 방문일 차이</span></div>
          </div>
          <table className="pf-tbl">
            <thead><tr><th>시술 카테고리</th><th>적중률</th><th>평균 오차</th></tr></thead>
            <tbody>
              {ACC.map((a) => (
                <tr key={a.cat}><td>{a.cat}</td><td className="num">{a.hit}%</td><td className="num">{a.err}일</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className="pf-card" aria-label="주기 내 재방문율">
        <div>
          <h2>주기 내 재방문율 (시술 카테고리별)</h2>
          <span className="pf-note">예측 방문 주기 안에 다시 방문한 고객 비율</span>
        </div>
        <div>
          {CAT_RATE.map((r) => (
            <div className="pf-frow" key={r.cat} style={{ gridTemplateColumns: '110px 1fr 60px 64px' }} onMouseEnter={() => setHover('r' + r.cat)} onMouseLeave={() => setHover('')}>
              <span style={{ fontSize: 13, color: '#4A3F3B' }}>{r.cat}</span>
              <Bar w={r.rate} color="#7A4450" grown={grown} show={hover === 'r' + r.cat} tip={<>{r.cat} <b>{r.rate}%</b> · {r.n}명 기준</>} />
              <b className="num" style={{ textAlign: 'right' }}>{r.rate}%</b>
              <span className="num pf-note" style={{ textAlign: 'right' }}>{r.n}명</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pf-card" aria-label="캠페인별 성과">
        <h2>캠페인별 성과</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="pf-tbl">
            <thead>
              <tr><th>캠페인</th><th>발송</th><th>도달</th><th>재예약</th><th>재방문</th><th>연결 매출</th></tr>
            </thead>
            <tbody>
              {CAMPS.map((x) => (
                <tr key={x.id}>
                  <td><AppLink href="/campaigns" style={{ color: '#221D1B', fontWeight: 600 }}>{x.name}</AppLink><div className="pf-note">{x.date} 발송 · {x.cat}</div></td>
                  <td className="num">{x.sent}</td>
                  <td className="num">{x.reach}</td>
                  <td className="num" style={{ color: '#7A4450', fontWeight: 600 }}>{x.rebook} ({pct(x.rebook, x.sent)}%)</td>
                  <td className="num">{x.visit}</td>
                  <td className="num">{won(x.sales)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AppLink href="/campaigns" className="pf-btn" style={{ color: '#fff' }}>유사 캠페인 만들기</AppLink>
      </section>

      <p className="pf-foot">모의 데이터로 생성한 값입니다. 발송 후 14일이 지나지 않은 캠페인은 진행 중 성과예요.</p>
    </div>
  );
}

export default function PerformancePage() {
  useStyleSheet('PerformancePage', styleText);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1300px' }}>
      <div style={{ flex: '0 0 232px' }}>
        <Sidebar active="performance" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="파트너 센터 / 성과 분석" />
        <PinGate id="performance" title="성과 분석">
          <Body />
        </PinGate>
      </main>
    </div>
  );
}
