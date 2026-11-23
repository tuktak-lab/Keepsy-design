import { useEffect, useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styleText from './SchedulePage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

type Status = 'done' | 'booked' | 'progress';
type Appt = {
  id: string;
  day: number;
  st: number;
  dur: number;
  name: string | null; // null = 고객 없는 예약
  treat: string;
  status: Status;
  staff: string;
  route: string;
  consult: boolean;
};
type Line = { name: string; price: number; exclude: boolean; scope: 'once' | 'all' };

const HH = 56;
const START = 9;
const NOW_DAY = 5;
const NOW = 13 + 20 / 60;
const dow = ['월', '화', '수', '목', '금', '토', '일'];
const dates = [16, 17, 18, 19, 20, 21, 22];
const colW = 100 / 7;
const STAFF = ['서연', '하나'];
const ROUTES = ['매장 직접', '전화', '네이버 예약', '인스타그램', '카카오톡'];
const MENUS: Record<string, number> = {
  '컬러 젤 네일': 58000,
  '시그니처 펄 네일': 65000,
  '프렌치 네일': 55000,
  '젤 아트': 60000,
  '클린 프렌치': 55000,
  '젤 제거': 10000,
  '딥 플럼 상담': 0,
};
const PAYS = ['카드', '현금', '계좌이체', '네이버페이'];
const CUSTOMERS = ['김민지', '서지아', '이지우', '정하린', '최유진', '오서현'];
const PHOTO_OK = ['김민지', '서지아', '정하린'];

const fmt = (t: number) => {
  const h = Math.floor(t),
    m = Math.round((t - h) * 60);
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
};
const won = (n: number) => n.toLocaleString('ko-KR') + '원';
const isPast = (a: Appt) => a.day < NOW_DAY || (a.day === NOW_DAY && a.st + a.dur <= NOW);
const isUnclosed = (a: Appt) => a.status !== 'done' && isPast(a);

function seed(): Appt[] {
  const week: [number, [string, string, number, number][]][] = [
    [0, [['김수아', '컬러 젤 네일', 10, 1.5], ['정하린', '시그니처 펄 네일', 13, 1.5], ['최유진', '프렌치 네일', 16, 1], ['오서현', '젤 아트', 18, 1.25]]],
    [1, [['정하린', '컬러 젤 네일', 11, 1.5], ['최유진', '시그니처 펄 네일', 13.5, 1.5], ['오서현', '프렌치 네일', 16, 1], ['한예린', '젤 아트', 18, 1.25]]],
    [2, [['최유진', '컬러 젤 네일', 10, 1.5], ['오서현', '시그니처 펄 네일', 13, 1.5], ['한예린', '프렌치 네일', 16, 1], ['송나은', '젤 아트', 18, 1.25]]],
    [3, [['오서현', '컬러 젤 네일', 11, 1.5], ['한예린', '시그니처 펄 네일', 13.5, 1.5], ['송나은', '프렌치 네일', 16, 1], ['김수아', '젤 아트', 18, 1.25]]],
    [4, [['한예린', '컬러 젤 네일', 10, 1.5], ['송나은', '시그니처 펄 네일', 13, 1.5], ['김수아', '프렌치 네일', 16, 1], ['정하린', '젤 아트', 18, 1.25]]],
    [6, [['김수아', '컬러 젤 네일', 10, 1.5], ['정하린', '시그니처 펄 네일', 13, 1.5], ['최유진', '프렌치 네일', 16, 1], ['오서현', '젤 아트', 18, 1.25]]],
  ];
  const out: Appt[] = [];
  week.forEach(([day, list]) =>
    list.forEach(([name, treat, st, dur], i) => {
      const future = day === 6;
      // 수요일 두 번째, 금요일 첫 번째 예약은 마감하지 않은 채 지나간 예약
      const forgot = (day === 2 && i === 1) || (day === 4 && i === 0);
      out.push({
        id: day + '-' + i,
        day,
        st,
        dur,
        name,
        treat,
        status: future || forgot ? 'booked' : 'done',
        staff: STAFF[i % 2],
        route: ROUTES[(day + i) % 3 === 0 ? 2 : 0],
        consult: false,
      });
    })
  );
  const sat: [string, string, number, number, Status][] = [
    ['서지아', '컬러 젤 네일', 9, 0.6, 'done'],
    ['이지우', '프렌치 네일', 9.6, 0.6, 'done'],
    ['남다은', '젤 아트', 10.2, 0.6, 'done'],
    ['유채원', '컬러 젤 네일', 10.8, 0.6, 'done'],
    ['문소희', '프렌치 네일', 11.4, 0.6, 'done'],
    ['박지은', '클린 프렌치', 13, 1, 'progress'],
    ['김민지', '시그니처 펄 네일', 14, 1.5, 'booked'],
    ['이윤서', '딥 플럼 상담', 16.5, 1.5, 'booked'],
  ];
  sat.forEach(([name, treat, st, dur, status], i) =>
    out.push({
      id: name === '김민지' ? 'sat-kim' : 'sat-' + i,
      day: 5,
      st,
      dur,
      name,
      treat,
      status,
      staff: i % 2 === 0 ? '서연' : '하나',
      route: i === 6 ? '네이버 예약' : '매장 직접',
      consult: name === '이윤서',
    })
  );
  // 고객 정보 없이 시간만 막은 예약 (다른 앱으로 받은 예약)
  out.push({ id: 'nc-1', day: 5, st: 15.5, dur: 1, name: null, treat: '프렌치 네일', status: 'booked', staff: '하나', route: '네이버 예약', consult: false });
  out.push({ id: 'nc-2', day: 3, st: 14.5, dur: 1, name: null, treat: '컬러 젤 네일', status: 'done', staff: '서연', route: '인스타그램', consult: false });
  return out;
}

const statusLook = (a: Appt): [string, string, string] => {
  if (isUnclosed(a)) return ['마감 안 됨', '#FBEAEA', '#A33B3B'];
  if (a.status === 'done') return ['시술 마감', '#EFE7E4', '#6A5D58'];
  if (a.status === 'progress') return ['진행 중', '#2F2826', '#FFFFFF'];
  return ['예약 확정', '#F8E4E1', '#85505A'];
};

export default function SchedulePage() {
  useStyleSheet('SchedulePage', styleText);

  const [items, setItems] = useState<Appt[]>(seed);
  const [sel, setSel] = useState('sat-kim');
  const [staffF, setStaffF] = useState('전체');
  const [toast, setToast] = useState('');
  const [reg, setReg] = useState<any>(null);
  const [fin, setFin] = useState<any>(null);
  const [linking, setLinking] = useState(false);
  const [linkPick, setLinkPick] = useState(CUSTOMERS[0]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const patch = (id: string, p: Partial<Appt>) => setItems((l) => l.map((a) => (a.id === id ? { ...a, ...p } : a)));

  const shown = items.filter((a) => staffF === '전체' || a.staff === staffF);

  // 같은 날 시간이 겹치는 예약끼리만 가로로 나눠 배치합니다(스탭 수만큼 쪼개면 칸이 너무 좁아짐).
  const pos: Record<string, { lane: number; n: number }> = {};
  for (let d = 0; d < 7; d++) {
    const arr = shown.filter((a) => a.day === d).sort((a, b) => a.st - b.st);
    let cluster: any[] = [];
    let laneEnds: number[] = [];
    let clusterEnd = -1;
    const flush = () => {
      cluster.forEach((a) => (pos[a.id].n = Math.max(laneEnds.length, 1)));
      cluster = [];
      laneEnds = [];
    };
    for (const a of arr) {
      if (a.st >= clusterEnd) flush();
      let lane = laneEnds.findIndex((e) => e <= a.st);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = a.st + a.dur;
      clusterEnd = Math.max(clusterEnd, a.st + a.dur);
      pos[a.id] = { lane, n: 1 };
      cluster.push(a);
    }
    flush();
  }
  const unclosed = items.filter(isUnclosed);
  const x = items.find((a) => a.id === sel) || items[0];
  const look = statusLook(x);
  const kim = x.id === 'sat-kim';

  const hours: { label: string; top: number }[] = [];
  for (let h = 9; h <= 19; h++) hours.push({ label: (h < 10 ? '0' : '') + h + ':00', top: (h - START) * HH });

  const openClose = (a: Appt) => {
    const names = a.treat.split(' + ');
    setFin({
      id: a.id,
      lines: names.map((n) => ({ name: n, price: MENUS[n] ?? 0, exclude: false, scope: 'once' })) as Line[],
      pay: '카드',
      memo: '',
      photo: false,
      marketing: false,
      night: false,
      photoC: false,
      health: false,
      link: a.name || '',
    });
  };
  const finLinked = fin ? fin.link : '';
  const photoAllowed = fin && PHOTO_OK.includes(finLinked);
  const finTotal = fin ? (fin.lines as Line[]).reduce((s, l) => s + (Number(l.price) || 0), 0) : 0;

  const saveClose = () => {
    const a = items.find((i) => i.id === fin.id)!;
    patch(a.id, {
      status: 'done',
      name: fin.link || a.name,
      treat: (fin.lines as Line[]).map((l) => l.name).join(' + '),
    });
    setFin(null);
    setToast('저장했어요. 결제·방문 기록이 생성되고, 다음 방문 예측이 갱신됩니다.');
  };
  const setLine = (i: number, p: Partial<Line>) =>
    setFin((f: any) => ({ ...f, lines: f.lines.map((l: Line, k: number) => (k === i ? { ...l, ...p } : l)) }));

  const openReg = () =>
    setReg({ route: '매장 직접', noCust: false, name: '', day: 5, st: 15, staff: '서연', treats: [] as string[], consult: false, err: '' });
  const submitReg = () => {
    if (reg.treats.length === 0) return setReg({ ...reg, err: '예정 시술을 1개 이상 선택해 주세요.' });
    if (!reg.noCust && !reg.name.trim()) return setReg({ ...reg, err: '고객 이름을 입력하거나 "고객 없이 시간만 막기"를 선택해 주세요.' });
    const id = 'new-' + Date.now();
    setItems((l) => [
      ...l,
      {
        id,
        day: reg.day,
        st: reg.st,
        dur: 1,
        name: reg.noCust ? null : reg.name.trim(),
        treat: reg.treats.join(' + '),
        status: 'booked',
        staff: reg.staff,
        route: reg.route,
        consult: reg.consult,
      },
    ]);
    setSel(id);
    setReg(null);
    setToast(reg.noCust ? '고객 없는 예약으로 시간을 막았어요. 상세에서 고객을 연결할 수 있어요.' : '예약을 등록했어요.');
  };
  const times: number[] = [];
  for (let t = 9; t <= 19; t += 0.5) times.push(t);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1000px' }}>
      <div style={{ flex: '0 0 232px', background: '#F4EBE6' }}>
        <div>
          <Sidebar active="schedule" />
        </div>
      </div>
      <main style={{ flex: '999 1 640px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
        <div>
          <Topbar crumb="파트너 센터 / 예약 · 일정" />
        </div>
        <div
          style={{
            padding: '28px 32px 40px',
            maxWidth: '1280px',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h1 className="h1">예약 · 일정 관리</h1>
              <p className="sub">스탭별 주간 일정을 확인하고, 시술이 끝난 예약은 바로 마감하세요.</p>
            </div>
            <button type="button" className="btn btn-p" onClick={openReg}>
              + 예약 등록
            </button>
          </div>

          {unclosed.length > 0 ? (
            <div className="alert" role="alert">
              <span className="warn">마감 안 된 지난 예약 {unclosed.length}건</span>
              <span>시술 기록과 결제가 남아 있지 않아 다음 방문 예측에 반영되지 않아요.</span>
              <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                {unclosed.map((u) => (
                  <button key={u.id} type="button" className="btn btn-sm" onClick={() => setSel(u.id)}>
                    {dow[u.day]} {fmt(u.st)} {u.name || '고객 없음'}
                  </button>
                ))}
              </span>
            </div>
          ) : null}

          <div className="card" style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px' }}>
              <span className="num" style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.025em' }}>
                2026년 11월 16일 – 22일
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="button" className="btn" aria-label="이전 주" style={{ padding: '0 14px' }}>
                  ‹
                </button>
                <button type="button" className="btn">
                  오늘
                </button>
                <button type="button" className="btn" aria-label="다음 주" style={{ padding: '0 14px' }}>
                  ›
                </button>
              </div>
              <div className="seg" role="group" aria-label="보기 단위">
                <button type="button">일</button>
                <button type="button" aria-pressed="true">
                  주
                </button>
                <button type="button">월</button>
              </div>
              <select className="sel" aria-label="스탭" value={staffF} onChange={(e) => setStaffF(e.target.value)}>
                <option>전체</option>
                {STAFF.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', marginLeft: 'auto', fontSize: '12px', color: '#5A4F4B' }}>
                {[
                  ['#F8E4E1', '예약 확정'],
                  ['#2F2826', '진행 중'],
                  ['#EFE7E4', '시술 마감'],
                ].map(([c, t]) => (
                  <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }}></span>
                    {t}
                  </span>
                ))}
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '1.5px dashed #B24A4A' }}></span>마감 안 됨
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'repeating-linear-gradient(135deg,#D9AFA6 0 3px,#fff 3px 6px)' }}></span>고객 없는 예약
                </span>
                <AppLink href="#" style={{ fontWeight: 600 }}>
                  예약 변경 요청 1건 →
                </AppLink>
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <section aria-label="주간 일정" style={{ flex: '1 1 640px', minWidth: '0', overflowX: 'auto' }}>
                <div style={{ minWidth: '860px' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid #F1E4E0' }}>
                    <div style={{ flex: 'none', width: '52px' }}></div>
                    <div style={{ flex: 1, display: 'flex' }}>
                      {dow.map((d, i) => (
                        <div
                          key={d}
                          style={{
                            flex: 1,
                            padding: '9px 0 8px',
                            textAlign: 'center',
                            background: i === NOW_DAY ? '#F8EDEA' : 'transparent',
                            borderLeft: '1px solid #F4EAE6',
                          }}
                        >
                          <div className="meta" style={{ color: i === NOW_DAY ? '#85505A' : undefined }}>
                            {d}
                          </div>
                          <div className="num" style={{ fontSize: '16px', fontWeight: 600, color: i === NOW_DAY ? '#85505A' : '#2F2826' }}>
                            {dates[i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: 'none', width: '52px', position: 'relative', height: '616px' }}>
                      {hours.map((h) => (
                        <span key={h.label} className="meta num" style={{ position: 'absolute', right: '8px', top: `${h.top}px`, transform: 'translateY(-50%)' }}>
                          {h.label}
                        </span>
                      ))}
                    </div>
                    <div style={{ flex: 1, position: 'relative', height: '616px', overflow: 'hidden' }}>
                      {hours.map((h) => (
                        <div key={h.label} style={{ position: 'absolute', left: 0, right: 0, top: `${h.top}px`, borderTop: '1px solid #F4EAE6' }}></div>
                      ))}
                      {dow.map((d, i) => (
                        <div
                          key={d}
                          style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: `${i * colW}%`,
                            width: `${colW}%`,
                            boxSizing: 'border-box',
                            borderLeft: '1px solid #F4EAE6',
                            background: i === NOW_DAY ? 'rgba(133,80,90,.04)' : 'transparent',
                          }}
                        ></div>
                      ))}
                      {shown.map((a) => {
                        const on = sel === a.id;
                        const un = isUnclosed(a);
                        const lane = pos[a.id]?.lane ?? 0;
                        const w = colW / (pos[a.id]?.n ?? 1);
                        const h = Math.max(a.dur * HH - 3, 20);
                        let bg = '#F8E4E1',
                          fg = '#5A3A41';
                        if (a.status === 'done') (bg = '#EFE7E4'), (fg = '#6A5D58');
                        if (a.status === 'progress') (bg = '#2F2826'), (fg = '#fff');
                        if (un) (bg = '#FFF6F5'), (fg = '#8F2F2F');
                        if (on) (bg = '#85505A'), (fg = '#fff');
                        const tall = h >= 48;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            className={'blk' + (a.name ? '' : ' nocust') + (un ? ' unclosed' : '')}
                            aria-pressed={on}
                            onClick={() => {
                              setSel(a.id);
                              setLinking(false);
                            }}
                            style={{
                              top: `${(a.st - START) * HH}px`,
                              height: `${h}px`,
                              left: `${a.day * colW + lane * w}%`,
                              width: `calc(${w}% - 6px)`,
                              marginLeft: '3px',
                              backgroundColor: bg,
                              color: fg,
                            }}
                          >
                            <span style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {un ? '! ' : ''}
                              {a.name || '고객 없음'}
                            </span>
                            {tall ? <span style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.treat}</span> : null}
                            {tall ? (
                              <span className="num" style={{ fontSize: '11px', opacity: 0.85, display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {fmt(a.st)}
                                {!a.name ? <span className="route">{a.route}</span> : null}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              <aside
                aria-label="예약 상세"
                style={{
                  flex: '0 1 320px',
                  minWidth: '280px',
                  padding: '4px 0 4px 26px',
                  marginLeft: '20px',
                  borderLeft: '1px solid #F1E4E0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 className="h2">예약 상세</h2>
                    <span className="chip" style={{ background: look[1], color: look[2] }}>
                      <i></i>
                      {look[0]}
                    </span>
                  </div>
                  <span className="meta num">NM-2611{dates[x.day]}-{Math.round(x.st) + 4}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.3 }}>{x.name || '고객 정보 없음'}</span>
                  <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="route">예약 경로 · {x.route}</span>
                    {x.consult ? <span className="route">상담 후 진행</span> : null}
                  </span>
                  <span className="sub">
                    {x.name
                      ? kim
                        ? '누적 방문 8회 · 네일 평균 간격 24일'
                        : '고객 카드에서 방문 이력을 확인하세요'
                      : '다른 앱으로 받은 예약이라 시간만 막아 둔 상태예요.'}
                  </span>
                  {x.name ? (
                    <AppLink href="/customers/detail" style={{ fontSize: '13px', fontWeight: 500 }}>
                      고객 정보 보기 →
                    </AppLink>
                  ) : linking ? (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <select className="sel" value={linkPick} onChange={(e) => setLinkPick(e.target.value)} style={{ flex: 1, minWidth: 0 }}>
                        {CUSTOMERS.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-p btn-sm"
                        style={{ minHeight: '40px' }}
                        onClick={() => {
                          patch(x.id, { name: linkPick });
                          setLinking(false);
                          setToast(linkPick + ' 님과 연결했어요.');
                        }}
                      >
                        연결
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="btn btn-sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }} onClick={() => setLinking(true)}>
                      고객 연결
                    </button>
                  )}
                </div>
                {isUnclosed(x) ? (
                  <div className="hint" style={{ background: '#FBEAEA', color: '#8F2F2F' }}>
                    시술이 지났지만 아직 마감하지 않았어요. 마감하면 결제·방문 기록이 만들어져요.
                  </div>
                ) : null}
                <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '64px 1fr', borderTop: '1px solid #F1E4E0' }}>
                  {[
                    ['시술', x.treat],
                    ['일정', '11.' + dates[x.day] + ' (' + dow[x.day] + ') ' + fmt(x.st) + ' – ' + fmt(x.st + x.dur)],
                    ['스탭', x.staff],
                    ['총 금액', x.treat.split(' + ').some((n) => !(n in MENUS) || MENUS[n] === 0) ? '상담 후 결정' : won(x.treat.split(' + ').reduce((s, n) => s + MENUS[n], 0))],
                  ].map(([k, val]) => (
                    <div key={k} style={{ display: 'contents' }}>
                      <dt className="meta" style={{ padding: '10px 0', borderBottom: '1px solid #F4EAE6' }}>
                        {k}
                      </dt>
                      <dd className={k === '일정' || k === '총 금액' ? 'num' : ''} style={{ margin: 0, padding: '10px 0', borderBottom: '1px solid #F4EAE6', fontWeight: k === '시술' ? 600 : 400 }}>
                        {val}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px 14px', background: '#FBF3F1', borderRadius: '14px' }}>
                  <span className="meta">고객 요청</span>
                  <span style={{ fontSize: '13.5px', whiteSpace: 'pre-line' }}>
                    {kim ? '짧은 길이 선호 · 자삽 젤 제거\n손톱 주변 피부가 민감해요.' : '등록된 고객 요청이 없어요.'}
                  </span>
                </div>
                {x.status === 'done' ? (
                  <>
                    <AppLink href="/history" className="btn btn-p" style={{ minHeight: '44px' }}>
                      시술 기록 보기
                    </AppLink>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#6A5D58' }}>
                      <span>🔒 결제 수정 · 취소는 PIN이 필요해요</span>
                    </div>
                  </>
                ) : (
                  <>
                    {x.status === 'booked' && !isUnclosed(x) ? (
                      <button type="button" className="btn btn-sm" style={{ minHeight: '40px' }} onClick={() => patch(x.id, { status: 'progress' })}>
                        시술 시작
                      </button>
                    ) : null}
                    <button type="button" className="btn btn-p" style={{ minHeight: '44px' }} onClick={() => openClose(x)}>
                      시술 마감
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <AppLink href="#" style={{ fontWeight: 500 }}>
                        일정 변경
                      </AppLink>
                      <AppLink href="#" style={{ fontWeight: 500, color: '#A33B3B' }}>
                        예약 취소
                      </AppLink>
                    </div>
                  </>
                )}
              </aside>
            </div>
          </div>
          <p className="meta">같은 스탭의 예약 시간은 겹치지 않도록 제한됩니다. 휴무 및 휴게 시간은 매장 설정에서 관리할 수 있어요.</p>
        </div>
      </main>

      {reg ? (
        <div className="overlay" onClick={() => setReg(null)}>
          <div className="card modal" role="dialog" aria-label="예약 등록" onClick={(e) => e.stopPropagation()}>
            <h2 className="h2" style={{ fontSize: '19px' }}>
              예약 등록
            </h2>
            <div>
              <span className="lbl">예약 경로</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {ROUTES.map((r) => (
                  <button key={r} type="button" className="pill" aria-pressed={reg.route === r} onClick={() => setReg({ ...reg, route: r })}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="lbl">고객</span>
              <input
                className="inp"
                placeholder="고객 이름 검색"
                value={reg.name}
                disabled={reg.noCust}
                onChange={(e) => setReg({ ...reg, name: e.target.value })}
              />
              <label className="chk" style={{ marginTop: '8px' }}>
                <input type="checkbox" checked={reg.noCust} onChange={(e) => setReg({ ...reg, noCust: e.target.checked })} />
                <span>고객 없이 시간만 막기 (다른 앱으로 받은 예약)</span>
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              <div>
                <span className="lbl">날짜</span>
                <select className="inp" value={reg.day} onChange={(e) => setReg({ ...reg, day: Number(e.target.value) })}>
                  {dow.map((d, i) => (
                    <option key={d} value={i}>
                      11.{dates[i]} ({d})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="lbl">시간</span>
                <select className="inp" value={reg.st} onChange={(e) => setReg({ ...reg, st: Number(e.target.value) })}>
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {fmt(t)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="lbl">스탭</span>
                <select className="inp" value={reg.staff} onChange={(e) => setReg({ ...reg, staff: e.target.value })}>
                  {STAFF.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <span className="lbl">예정 시술 (1개 이상 필수)</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Object.keys(MENUS)
                  .filter((m) => m !== '딥 플럼 상담')
                  .map((m) => {
                    const on = reg.treats.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        className="pill"
                        aria-pressed={on}
                        onClick={() => setReg({ ...reg, err: '', treats: on ? reg.treats.filter((t: string) => t !== m) : [...reg.treats, m] })}
                      >
                        {m}
                      </button>
                    );
                  })}
              </div>
              <label className="chk" style={{ marginTop: '8px' }}>
                <input type="checkbox" checked={reg.consult} onChange={(e) => setReg({ ...reg, consult: e.target.checked })} />
                <span>상담 후 진행 — 손님이 시술을 정하지 못했어요. 가장 가능성 높은 시술을 골라 주세요.</span>
              </label>
            </div>
            {reg.err ? <span className="err">{reg.err}</span> : null}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn" onClick={() => setReg(null)}>
                취소
              </button>
              <button type="button" className="btn btn-p" onClick={submitReg}>
                등록
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {fin ? (
        <div className="overlay" onClick={() => setFin(null)}>
          <div className="card modal" role="dialog" aria-label="시술 마감" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <div>
              <h2 className="h2" style={{ fontSize: '19px' }}>
                시술 마감
              </h2>
              <span className="meta">
                {fin.link || '고객 없음'} · {x.id === fin.id ? '' : ''}
                {(() => {
                  const a = items.find((i) => i.id === fin.id)!;
                  return '11.' + dates[a.day] + ' ' + fmt(a.st) + ' · ' + a.staff + ' · ' + a.route;
                })()}
              </span>
            </div>

            {!fin.link ? (
              <div className="hint">
                고객 없는 예약이에요. 여기서 고객을 연결하세요.
                <select
                  className="inp"
                  style={{ marginTop: '8px' }}
                  value=""
                  onChange={(e) => setFin({ ...fin, link: e.target.value })}
                >
                  <option value="">고객 선택</option>
                  {CUSTOMERS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <span className="lbl">실제 시술 · 금액 확인</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(fin.lines as Line[]).map((l, i) => (
                  <div key={i} style={{ padding: '10px 12px', border: '1px solid #F1E4E0', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ flex: 1, fontWeight: 600 }}>{l.name}</span>
                      <input
                        className="inp num"
                        style={{ width: '120px', textAlign: 'right' }}
                        value={l.price}
                        inputMode="numeric"
                        aria-label={l.name + ' 금액'}
                        onChange={(e) => setLine(i, { price: Number(e.target.value.replace(/\D/g, '')) })}
                      />
                      <span className="meta">원</span>
                    </div>
                    <label className="chk">
                      <input type="checkbox" checked={l.exclude} onChange={(e) => setLine(i, { exclude: e.target.checked })} />
                      <span>주기 계산 제외 (이 방문의 {l.name}은 재방문 주기에 넣지 않아요)</span>
                    </label>
                    {l.exclude ? (
                      <div className="hint" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <span style={{ flex: '1 1 200px' }}>앞으로 이 메뉴를 모두 제외할까요?</span>
                        <button type="button" className="pill" aria-pressed={l.scope === 'once'} onClick={() => setLine(i, { scope: 'once' })}>
                          이번만
                        </button>
                        <button type="button" className="pill" aria-pressed={l.scope === 'all'} onClick={() => setLine(i, { scope: 'all' })}>
                          모두 제외
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontWeight: 700 }}>
                <span>합계</span>
                <span className="num">{won(finTotal)}</span>
              </div>
            </div>

            <div>
              <span className="lbl">결제 수단</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {PAYS.map((p) => (
                  <button key={p} type="button" className="pill" aria-pressed={fin.pay === p} onClick={() => setFin({ ...fin, pay: p })}>
                    {p}
                  </button>
                ))}
              </div>
              <span className="meta" style={{ display: 'block', marginTop: '6px' }}>
                🔒 저장 후 결제 수정 · 취소는 PIN이 필요해요.
              </span>
            </div>

            <div>
              <span className="lbl">시술 사진</span>
              {photoAllowed ? (
                <button type="button" className="btn btn-sm" onClick={() => setFin({ ...fin, photo: !fin.photo })}>
                  {fin.photo ? '사진 1장 첨부됨 (눌러서 제거)' : '+ 사진 첨부'}
                </button>
              ) : (
                <span className="meta">사진 수집에 동의한 고객만 사진을 첨부할 수 있어요.</span>
              )}
            </div>

            <div>
              <span className="lbl">메모</span>
              <textarea className="inp" placeholder="다음 방문 때 참고할 내용을 남겨 주세요." value={fin.memo} onChange={(e) => setFin({ ...fin, memo: e.target.value })} />
            </div>

            <div>
              <span className="lbl">수신 · 수집 동의 (항목별로 따로 받아요)</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '8px' }}>
                {[
                  ['marketing', '마케팅 수신 동의'],
                  ['night', '야간 광고 수신 동의'],
                  ['photoC', '사진 수집 · 활용 동의'],
                  ['health', '건강정보 수집 동의'],
                ].map(([k, t]) => (
                  <label key={k} className="chk">
                    <input type="checkbox" checked={fin[k]} onChange={(e) => setFin({ ...fin, [k]: e.target.checked })} />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="hint">저장하면 결제·방문 기록이 생성되고, 다음 방문 예측이 갱신돼요.</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn" onClick={() => setFin(null)}>
                닫기
              </button>
              <button type="button" className="btn btn-p" onClick={saveClose}>
                저장하고 마감
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
