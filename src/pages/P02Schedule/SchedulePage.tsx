import { useEffect, useRef, useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styleText from './SchedulePage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';
import { toast } from '@/components/common/Toast';

type Status = 'done' | 'booked' | 'progress';
type Appt = {
  id: string;
  day: number; // 2026-11-16(월)부터 며칠째인지 (0 = 11.16)
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
type View = 'day' | 'week' | 'month';
// 드래그 중 미리보기: 놓일 자리(요일·스탭·시작 시간)와 겹치는 예약
type Drag = { id: string; dx: number; dy: number; g: number; day: number; st: number; staff: string; hit: Appt | null };
type DragSrc = {
  a: Appt;
  x0: number;
  y0: number;
  scale: number;
  rect: DOMRect;
  groups: number;
  isDay: boolean;
  weekStart: number;
  anchor: number;
  dayStaff: string[];
  started: boolean;
  cur: Drag | null;
};

const HH = 56; // 1시간 높이(px)
const START = 9;
const END = 20;
const NOW_DAY = 5; // 오늘 = 11.21(토)
const NOW = 13 + 20 / 60;
const dow = ['월', '화', '수', '목', '금', '토', '일'];
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
const VIEWS: [View, string][] = [
  ['day', '일'],
  ['week', '주'],
  ['month', '월'],
];

// ── 날짜 계산: day 값(11.16부터의 일수) ↔ 실제 날짜 ──
const dOf = (off: number) => new Date(2026, 10, 16 + off);
const offOf = (y: number, m: number, d: number) => Math.round((Date.UTC(y, m, d) - Date.UTC(2026, 10, 16)) / 864e5);
const wd = (off: number) => ((off % 7) + 7) % 7; // 0 = 월요일
const md = (off: number) => `${dOf(off).getMonth() + 1}.${dOf(off).getDate()}`;
const fmt = (t: number) => {
  const h = Math.floor(t),
    m = Math.round((t - h) * 60);
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
};
const won = (n: number) => n.toLocaleString('ko-KR') + '원';
const isPast = (a: Appt) => a.day < NOW_DAY || (a.day === NOW_DAY && a.st + a.dur <= NOW);
const isUnclosed = (a: Appt) => a.status !== 'done' && isPast(a);
const when = (a: Appt) => `${md(a.day)} (${dow[wd(a.day)]}) ${fmt(a.st)} – ${fmt(a.st + a.dur)}`;
const price = (a: Appt) =>
  a.treat.split(' + ').some((n) => !(n in MENUS) || MENUS[n] === 0) ? '상담 후 결정' : won(a.treat.split(' + ').reduce((s, n) => s + MENUS[n], 0));

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

// 상태 → [표시 이름, 클래스]
const statusOf = (a: Appt): [string, string] => {
  if (isUnclosed(a)) return ['마감 미완료', 'unclosed'];
  if (a.status === 'done') return ['시술 완료', 'done'];
  if (a.status === 'progress') return ['진행 중', 'progress'];
  return ['예약 확정', 'booked'];
};
const STATES: [string, string][] = [
  ['booked', '예약 확정'],
  ['progress', '진행 중'],
  ['done', '시술 완료'],
  ['unclosed', '마감 미완료'],
];

// 같은 칸(요일 또는 스탭)에서 시간이 겹치는 예약끼리만 가로로 나눕니다.
// 한 묶음이 maxL칸을 넘으면 앞 칸만 보여주고 나머지는 "+N건"으로 접습니다.
type Pos = { lane: number; n: number; hidden: boolean };
type More = { group: number; st: number; end: number; lane: number; n: number; count: number };
function layout(list: Appt[], groupOf: (a: Appt) => number, groups: number, maxL: number) {
  const pos: Record<string, Pos> = {};
  const more: More[] = [];
  for (let g = 0; g < groups; g++) {
    const arr = list.filter((a) => groupOf(a) === g).sort((a, b) => a.st - b.st);
    let cluster: Appt[] = [];
    let laneEnds: number[] = [];
    let cStart = 0;
    let cEnd = -1;
    const flush = () => {
      if (!cluster.length) return;
      const lanes = laneEnds.length;
      if (lanes > maxL) {
        const keep = maxL - 1;
        let hidden = 0;
        cluster.forEach((a) => {
          const h = pos[a.id].lane >= keep;
          pos[a.id] = { lane: pos[a.id].lane, n: maxL, hidden: h };
          if (h) hidden++;
        });
        more.push({ group: g, st: cStart, end: cEnd, lane: keep, n: maxL, count: hidden });
      } else {
        cluster.forEach((a) => (pos[a.id].n = Math.max(lanes, 1)));
      }
      cluster = [];
      laneEnds = [];
    };
    for (const a of arr) {
      if (a.st >= cEnd) {
        flush();
        cStart = a.st;
      }
      let lane = laneEnds.findIndex((e) => e <= a.st);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = a.st + a.dur;
      cEnd = Math.max(cEnd, a.st + a.dur);
      pos[a.id] = { lane, n: 1, hidden: false };
      cluster.push(a);
    }
    flush();
  }
  return { pos, more };
}

// 월 달력 칸 (월요일 시작)
function monthCells(y: number, m: number) {
  const first = offOf(y, m, 1);
  const start = first - wd(first);
  const days = new Date(y, m + 1, 0).getDate();
  const rows = Math.ceil((wd(first) + days) / 7);
  return Array.from({ length: rows * 7 }, (_, i) => {
    const off = start + i;
    return { off, d: dOf(off).getDate(), inMonth: dOf(off).getMonth() === m };
  });
}

export default function SchedulePage() {
  useStyleSheet('SchedulePage', styleText);

  const [items, setItems] = useState<Appt[]>(seed);
  const [sel, setSel] = useState<string | null>(null);
  const [view, setView] = useState<View>('week');
  const [anchor, setAnchor] = useState(NOW_DAY); // 기준 날짜
  const [mini, setMini] = useState({ y: 2026, m: 10 }); // 미니 달력에 보이는 달
  const [staffF, setStaffF] = useState('전체');
  const [reg, setReg] = useState<any>(null);
  const [fin, setFin] = useState<any>(null);
  const [linking, setLinking] = useState(false);
  const [linkPick, setLinkPick] = useState(CUSTOMERS[0]);
  const [askCancel, setAskCancel] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [back, setBack] = useState<string | null>(null); // 원위치로 돌아가는 카드
  const [flash, setFlash] = useState<{ id: string; n: number } | null>(null); // 상태가 바뀐 카드 강조 1회
  const detailRef = useRef<HTMLElement>(null);
  const lanesRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const dragSrc = useRef<DragSrc | null>(null);
  const dragOff = useRef<(() => void) | null>(null);
  const noClick = useRef(false);

  useEffect(() => () => dragOff.current?.(), []);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 320);
    return () => clearTimeout(t);
  }, [flash]);
  useEffect(() => {
    if (!back) return;
    const t = setTimeout(() => setBack(null), 220);
    return () => clearTimeout(t);
  }, [back]);
  // 기준 날짜가 바뀌면 미니 달력도 그 달로
  useEffect(() => {
    const d = dOf(anchor);
    setMini({ y: d.getFullYear(), m: d.getMonth() });
  }, [anchor]);

  const patch = (id: string, p: Partial<Appt>) => setItems((l) => l.map((a) => (a.id === id ? { ...a, ...p } : a)));
  const pulse = (id: string) => setFlash((f) => ({ id, n: (f?.n ?? 0) + 1 }));

  const shown = items.filter((a) => staffF === '전체' || a.staff === staffF);
  const onDay = (off: number) => shown.filter((a) => a.day === off).sort((a, b) => a.st - b.st);
  const unclosed = items.filter(isUnclosed).sort((a, b) => a.day - b.day || a.st - b.st);
  const x = sel ? items.find((a) => a.id === sel) ?? null : null;
  const kim = x?.id === 'sat-kim';

  const select = (id: string) => {
    setSel(id);
    setLinking(false);
    setAskCancel(false);
    if (window.innerWidth <= 1240) setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };
  const closeDetail = () => {
    setSel(null);
    setLinking(false);
    setAskCancel(false);
  };
  const goTo = (a: Appt) => {
    setAnchor(a.day);
    if (view === 'month') setView('week');
    select(a.id);
  };

  // ── 이동 ──
  const weekStart = anchor - wd(anchor);
  const A = dOf(anchor);
  const move = (dir: 1 | -1) => {
    if (view === 'day') setAnchor((v) => v + dir);
    else if (view === 'week') setAnchor((v) => v + 7 * dir);
    else setAnchor(offOf(A.getFullYear(), A.getMonth() + dir, 1));
  };
  const title = (() => {
    if (view === 'day') return `${A.getFullYear()}년 ${A.getMonth() + 1}월 ${A.getDate()}일 (${dow[wd(anchor)]})`;
    if (view === 'month') return `${A.getFullYear()}년 ${A.getMonth() + 1}월`;
    const s = dOf(weekStart),
      e = dOf(weekStart + 6);
    return s.getMonth() === e.getMonth()
      ? `${s.getFullYear()}년 ${s.getMonth() + 1}월 ${s.getDate()}일 – ${e.getDate()}일`
      : `${s.getFullYear()}년 ${s.getMonth() + 1}월 ${s.getDate()}일 – ${e.getMonth() + 1}월 ${e.getDate()}일`;
  })();

  // ── 시술 마감 ──
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
    pulse(a.id);
    toast('저장했어요. 결제·방문 기록이 생성되고, 다음 방문 예측이 갱신됩니다.');
  };
  const setLine = (i: number, p: Partial<Line>) =>
    setFin((f: any) => ({ ...f, lines: f.lines.map((l: Line, k: number) => (k === i ? { ...l, ...p } : l)) }));

  // ── 예약 등록 · 일정 변경 · 취소 ──
  const openReg = () =>
    setReg({ editId: null, route: '매장 직접', noCust: false, name: '', day: anchor, st: 15, staff: '서연', treats: [] as string[], consult: false, err: '' });
  const openEdit = (a: Appt) =>
    setReg({
      editId: a.id,
      route: a.route,
      noCust: !a.name,
      name: a.name || '',
      day: a.day,
      st: a.st,
      staff: a.staff,
      treats: a.treat.split(' + ').filter((t) => t in MENUS),
      consult: a.consult,
      err: '',
    });
  const submitReg = () => {
    if (reg.treats.length === 0) return setReg({ ...reg, err: '예정 시술을 1개 이상 선택해 주세요.' });
    if (!reg.noCust && !reg.name.trim()) return setReg({ ...reg, err: '고객 이름을 입력하거나 "고객 없이 시간만 막기"를 선택해 주세요.' });
    const fields = {
      day: reg.day,
      st: reg.st,
      name: reg.noCust ? null : reg.name.trim(),
      treat: reg.treats.join(' + '),
      staff: reg.staff,
      route: reg.route,
      consult: reg.consult,
    };
    if (reg.editId) {
      patch(reg.editId, fields);
      pulse(reg.editId);
      setReg(null);
      toast('예약 일정을 변경했어요.');
      return;
    }
    const id = 'new-' + Date.now();
    setItems((l) => [...l, { id, dur: 1, status: 'booked', ...fields }]);
    setAnchor(reg.day);
    select(id);
    setReg(null);
    toast(reg.noCust ? '고객 없는 예약으로 시간을 막았어요. 상세에서 고객을 연결할 수 있어요.' : '예약을 등록했어요.');
  };
  const cancelAppt = (a: Appt) => {
    setItems((l) => l.filter((i) => i.id !== a.id));
    closeDetail();
    toast(`${a.name || '고객 없는'} 예약(${when(a)})을 취소했어요.`);
  };
  const times: number[] = [];
  for (let t = 9; t <= 19; t += 0.5) times.push(t);
  const regDays = reg ? Array.from({ length: 7 }, (_, i) => reg.day - wd(reg.day) + i) : [];

  const startTreat = (a: Appt) => {
    patch(a.id, { status: 'progress' });
    pulse(a.id);
    toast(a.name ? `${a.name} 님 시술을 시작했어요` : '고객 없는 예약의 시술을 시작했어요');
  };

  // ── 예약 카드 드래그 이동 (예약 확정 상태만) ──
  // html 에 zoom 이 걸려 있어 화면 좌표(clientX·getBoundingClientRect)와 CSS px 의 비율이 다를 수 있습니다.
  // .lanes 의 화면상 높이 ÷ offsetHeight 로 배율을 구해 보정합니다.
  const endDrag = () => {
    dragOff.current?.();
    dragOff.current = null;
    dragSrc.current = null;
    setDrag(null);
  };
  const cancelDrag = (id: string) => {
    endDrag();
    setBack(id);
  };
  const onDragMove = (e: PointerEvent) => {
    const s = dragSrc.current;
    if (!s) return;
    const dxS = e.clientX - s.x0,
      dyS = e.clientY - s.y0;
    if (!s.started) {
      if (Math.hypot(dxS, dyS) < 4) return;
      s.started = true;
      noClick.current = true;
    }
    e.preventDefault();
    const { a, scale, rect, groups } = s;
    const dx = dxS / scale,
      dy = dyS / scale;
    const g = Math.min(groups - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * groups)));
    const st = Math.min(END - a.dur, Math.max(START, Math.round((a.st + dy / HH) * 2) / 2));
    const day = s.isDay ? s.anchor : s.weekStart + g;
    const staff = s.isDay ? s.dayStaff[g] : a.staff;
    const hit =
      itemsRef.current.find((b) => b.id !== a.id && b.staff === staff && b.day === day && b.st < st + a.dur && st < b.st + b.dur) ?? null;
    s.cur = { id: a.id, dx, dy, g, day, st, staff, hit };
    setDrag(s.cur);
  };
  const onDragUp = () => {
    const s = dragSrc.current;
    if (!s) return;
    const d = s.cur;
    const a = s.a;
    // 드래그 직후의 click 한 번만 막고, 다음 클릭은 정상 처리
    setTimeout(() => (noClick.current = false), 0);
    if (!s.started || !d) return endDrag();
    if (d.day === a.day && d.st === a.st && d.staff === a.staff) return cancelDrag(a.id);
    if (d.hit) {
      cancelDrag(a.id);
      toast(`${d.staff} 님의 ${fmt(d.hit.st)} ${d.hit.name || '고객 없는'} 예약과 겹쳐서 옮기지 않았어요`, 'warn');
      return;
    }
    endDrag();
    patch(a.id, { day: d.day, st: d.st, staff: d.staff });
    select(a.id);
    pulse(a.id);
    toast(`${a.name || '고객 없는'} 예약을 ${d.staff !== a.staff ? d.staff + ' 님 ' : ''}${md(d.day)} (${dow[wd(d.day)]}) ${fmt(d.st)}으로 옮겼어요`);
  };
  const onDragDown = (e: React.PointerEvent, a: Appt) => {
    if (e.button !== 0 || a.status !== 'booked' || !lanesRef.current || dragSrc.current) return;
    const el = lanesRef.current;
    const rect = el.getBoundingClientRect();
    dragSrc.current = {
      a,
      x0: e.clientX,
      y0: e.clientY,
      scale: rect.height / el.offsetHeight || 1,
      rect,
      groups,
      isDay,
      weekStart,
      anchor,
      dayStaff,
      started: false,
      cur: null,
    };
    const key = (k: KeyboardEvent) => {
      if (k.key === 'Escape' && dragSrc.current) {
        noClick.current = dragSrc.current.started;
        cancelDrag(a.id);
      }
    };
    const up = () => onDragUp();
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('keydown', key);
    dragOff.current = () => {
      window.removeEventListener('pointermove', onDragMove);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('keydown', key);
    };
  };

  // ── 캘린더 블록 ──
  // 줄 우선순위: 고객명 → 시간 → 시술명 → 상태. 카드 높이(=예약 시간)가 모자라면 아래 줄부터 잘립니다.
  const block = (a: Appt, left: number, width: number, over = false) => {
    const [label, cls] = statusOf(a);
    const h = Math.max(a.dur * HH - 4, 24);
    // 이름(17.5px) 아래에 온전히 들어가는 줄 수(줄당 16.2px). 잘린 줄이 보이지 않게 합니다.
    const lines = Math.min(3, Math.max(0, Math.floor((h - 8 - 17.5) / 16.2)));
    const canDrag = a.status === 'booked';
    const dragging = drag?.id === a.id;
    return (
      <button
        key={a.id}
        id={'blk-' + a.id}
        type="button"
        className={`blk s-${cls} l${lines}${a.name ? '' : ' nocust'}${sel === a.id ? ' on' : ''}${h < 44 ? ' short' : ''}${over ? ' over' : ''}${
          canDrag ? ' drag' : ''
        }${dragging ? ' dragging' : ''}${back === a.id ? ' back' : ''}${flash?.id === a.id ? ' flash f' + (flash.n % 2) : ''}`}
        aria-pressed={sel === a.id}
        aria-label={`${a.name || '고객 없는 예약'} · ${a.treat} · ${fmt(a.st)} · ${label}`}
        onPointerDown={canDrag ? (e) => onDragDown(e, a) : undefined}
        onClick={() => {
          if (noClick.current) return;
          select(a.id);
        }}
        style={{
          top: (a.st - START) * HH + 2,
          height: h,
          left: `calc(${left}% + 3px)`,
          width: `calc(${width}% - 6px)`,
          transform: dragging ? `translate(${drag!.dx}px, ${drag!.dy}px)` : undefined,
        }}
      >
        <span className="b1">
          <b>{a.name || '고객 없음'}</b>
          <span className="num">{fmt(a.st)}</span>
        </span>
        <span className="bt num">
          {fmt(a.st)}–{fmt(a.st + a.dur)}
        </span>
        <span className="b2">{a.treat}</span>
        <span className="b3">{a.name ? label : `${label} · ${a.route}`}</span>
      </button>
    );
  };

  // ── 주간 / 일간 그리드 ──
  const dayStaff = staffF === '전체' ? STAFF : [staffF];
  const isDay = view === 'day';
  const groups = isDay ? dayStaff.length : 7;
  const gW = 100 / groups;
  const gridList = isDay ? shown.filter((a) => a.day === anchor) : shown.filter((a) => a.day >= weekStart && a.day < weekStart + 7);
  const { pos, more } = layout(gridList, (a) => (isDay ? dayStaff.indexOf(a.staff) : a.day - weekStart), groups, isDay ? 99 : 2);
  const hours: number[] = [];
  for (let h = START; h < END; h++) hours.push(h);
  const dragDur = drag ? items.find((a) => a.id === drag.id)?.dur ?? 1 : 1;

  // ── 선택한 날짜 요약 ──
  const dayList = onDay(anchor);
  const count = (cls: string) => dayList.filter((a) => statusOf(a)[1] === cls).length;
  const todayList = onDay(NOW_DAY);
  const nextUp = todayList.find((a) => a.st + a.dur > NOW && a.status !== 'done');

  const actions = (a: Appt) => {
    const [, cls] = statusOf(a);
    const editRow = (
      <div className="sub-acts">
        <button type="button" className="lk" onClick={() => openEdit(a)}>일정 변경</button>
        <button type="button" className="lk danger" onClick={() => setAskCancel(true)}>예약 취소</button>
      </div>
    );
    if (cls === 'done')
      return (
        <>
          <AppLink href="/history" className="btn btn-p btn-w">시술 기록 보기</AppLink>
          <p className="meta lock">결제 수정 · 취소는 PIN 확인 후 가능해요.</p>
        </>
      );
    if (cls === 'progress')
      return (
        <button type="button" className="btn btn-p btn-w" onClick={() => openClose(a)}>
          시술 완료 · 마감
        </button>
      );
    if (cls === 'unclosed')
      return (
        <>
          <button type="button" className="btn btn-p btn-w" onClick={() => openClose(a)}>시술 마감하기</button>
          {editRow}
        </>
      );
    return (
      <>
        <div className="act-2">
          <button type="button" className="btn btn-p" onClick={() => startTreat(a)}>
            시술 시작
          </button>
          <button type="button" className="btn" onClick={() => openClose(a)}>
            바로 마감
          </button>
        </div>
        {editRow}
      </>
    );
  };

  const notes = (a: Appt) => {
    const n: string[] = [`예약 경로 · ${a.route}`];
    if (a.consult) n.push('상담 후 진행 — 시술을 정하지 못한 예약이에요.');
    if (!a.name) n.push('고객 없는 예약 — 다른 앱으로 받은 예약이라 시간만 막아 두었어요.');
    if (isUnclosed(a)) n.push('마감 미완료 — 결제·방문 기록이 아직 없어요.');
    return n;
  };

  return (
    <div className="shell">
      <div style={{ flex: '0 0 232px' }}>
        <Sidebar active="schedule" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="파트너 센터 / 예약 · 일정" />
        <div className="wrap">
          <header className="head">
            <div>
              <h1 className="h1 serif">예약 · 일정 관리</h1>
              <p className="sub">날짜를 고르고, 예약을 눌러 상세를 확인하세요. 시술이 끝나면 바로 마감합니다.</p>
            </div>
            <button type="button" className="btn btn-p" onClick={openReg}>
              + 예약 등록
            </button>
          </header>

          <div className="layout">
            {/* ── 좌측: 미니 달력 · 날짜 요약 · 스탭 · 미처리 ── */}
            <aside className="left card">
              <section className="mini">
                <div className="mini-h">
                  <b className="serif">
                    {mini.y}년 {mini.m + 1}월
                  </b>
                  <div>
                    <button type="button" className="ib" aria-label="이전 달" onClick={() => setMini((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))}>
                      ‹
                    </button>
                    <button type="button" className="ib" aria-label="다음 달" onClick={() => setMini((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))}>
                      ›
                    </button>
                  </div>
                </div>
                <div className="mini-g">
                  {dow.map((d) => (
                    <span key={d} className="mini-w">
                      {d}
                    </span>
                  ))}
                  {monthCells(mini.y, mini.m).map((c) => {
                    const has = shown.some((a) => a.day === c.off);
                    return (
                      <button
                        key={c.off}
                        type="button"
                        className={'mini-d num' + (c.inMonth ? '' : ' out') + (c.off === NOW_DAY ? ' today' : '') + (c.off === anchor ? ' on' : '')}
                        aria-label={`${md(c.off)}${has ? ' 예약 있음' : ''}`}
                        aria-pressed={c.off === anchor}
                        onClick={() => setAnchor(c.off)}
                      >
                        {c.d}
                        {has ? <i></i> : null}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="daysum">
                <span className="meta">선택한 날짜</span>
                <b className="ds-date">
                  {A.getMonth() + 1}월 {A.getDate()}일 ({dow[wd(anchor)]}){anchor === NOW_DAY ? <em>오늘</em> : null}
                </b>
                <p className="ds-n kp-fade" key={'n' + anchor + staffF}>
                  예약 <b className="num">{dayList.length}</b>건
                </p>
                {dayList.length ? (
                  <ul className="ds-list kp-fade" key={'l' + anchor + staffF}>
                    {STATES.map(([cls, label]) => (
                      <li key={cls}>
                        <span className={'sw s-' + cls}></span>
                        {label}
                        <b className="num">{count(cls)}</b>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="meta kp-fade" key={'e' + anchor}>
                    예약이 없는 날이에요.
                  </p>
                )}
              </section>

              <section className="staffbox">
                <span className="lbl">담당 스탭</span>
                <div className="staff" role="group" aria-label="담당 스탭">
                  {['전체', ...STAFF].map((s) => (
                    <button key={s} type="button" aria-pressed={staffF === s} onClick={() => setStaffF(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              {unclosed.length > 0 ? (
                <section className="pending" aria-label="미처리 업무">
                  <span className="lbl">
                    마감 미완료 <b className="num">{unclosed.length}건</b>
                  </span>
                  {unclosed.map((u) => (
                    <button key={u.id} type="button" className={'pend' + (sel === u.id ? ' on' : '')} onClick={() => goTo(u)}>
                      <b>{u.name || '고객 없음'}</b>
                      <span className="num">{when(u)}</span>
                      <span className="pend-t">시술 마감 필요{u.name ? '' : ' · 고객 연결 필요'}</span>
                    </button>
                  ))}
                </section>
              ) : null}
            </aside>

            {/* ── 중앙: 메인 캘린더 ── */}
            <section className="card center">
              <div className="c-head">
                <div className="c-nav">
                  <button type="button" className="btn btn-sm" onClick={() => setAnchor(NOW_DAY)}>
                    오늘
                  </button>
                  <button type="button" className="ib" aria-label="이전" onClick={() => move(-1)}>
                    ‹
                  </button>
                  <button type="button" className="ib" aria-label="다음" onClick={() => move(1)}>
                    ›
                  </button>
                  <b className="c-title serif num">{title}</b>
                </div>
                <div className="seg" role="group" aria-label="보기 단위">
                  <span className="seg-ind" style={{ transform: `translateX(${VIEWS.findIndex((v) => v[0] === view) * 100}%)` }} aria-hidden="true"></span>
                  {VIEWS.map(([v, t]) => (
                    <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="legend">
                {STATES.map(([cls, label]) => (
                  <span key={cls}>
                    <i className={'sw s-' + cls}></i>
                    {label}
                  </span>
                ))}
                <span>
                  <i className="sw nocust"></i>고객 없는 예약
                </span>
                <AppLink href="#" className="req">
                  예약 변경 요청 1건 →
                </AppLink>
              </div>

              {view === 'month' ? (
                <div className="month kp-fade" key={'m' + A.getFullYear() + '-' + A.getMonth()}>
                  {dow.map((d) => (
                    <div key={d} className="m-head">
                      {d}
                    </div>
                  ))}
                  {monthCells(A.getFullYear(), A.getMonth()).map((c) => {
                    const list = onDay(c.off);
                    const extra = list.length - 3;
                    return (
                      <div key={c.off} className={'m-cell' + (c.inMonth ? '' : ' out') + (c.off === NOW_DAY ? ' today' : '') + (c.off === anchor ? ' on' : '')}>
                        <button
                          type="button"
                          className="m-date num"
                          onClick={() => {
                            setAnchor(c.off);
                            setView('day');
                          }}
                        >
                          {c.d}
                        </button>
                        {list.slice(0, 3).map((a) => (
                          <button key={a.id} type="button" className={`m-item s-${statusOf(a)[1]}${sel === a.id ? ' on' : ''}`} onClick={() => select(a.id)}>
                            <span className="num">{fmt(a.st)}</span> {a.name || '고객 없음'}
                          </button>
                        ))}
                        {extra > 0 ? (
                          <button
                            type="button"
                            className="m-more"
                            onClick={() => {
                              setAnchor(c.off);
                              setView('day');
                            }}
                          >
                            +{extra}건 더보기
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid-scroll">
                  <div className="grid" style={{ minWidth: isDay ? 0 : 640 }}>
                    <div className="g-head">
                      <div className="axis-sp"></div>
                      {isDay
                        ? dayStaff.map((s) => (
                            <div key={s} className="col-h static">
                              <b>{s}</b>
                              <span className="num">{gridList.filter((a) => a.staff === s).length}건</span>
                            </div>
                          ))
                        : Array.from({ length: 7 }, (_, i) => weekStart + i).map((off) => (
                            <button
                              key={off}
                              type="button"
                              className={'col-h' + (off === NOW_DAY ? ' today' : '') + (off === anchor ? ' on' : '')}
                              onClick={() => setAnchor(off)}
                              onDoubleClick={() => setView('day')}
                              title="누르면 선택, 두 번 누르면 일간 보기"
                            >
                              <span className="ch-w">{dow[wd(off)]}</span>
                              <span className="ch-d num">{dOf(off).getDate()}</span>
                            </button>
                          ))}
                    </div>
                    <div className="g-body kp-fade" key={view + (isDay ? anchor : weekStart)}>
                      <div className="axis" style={{ height: (END - START) * HH }}>
                        {hours.map((h) => (
                          <span key={h} className="num" style={{ top: (h - START) * HH }}>
                            {(h < 10 ? '0' : '') + h}:00
                          </span>
                        ))}
                      </div>
                      <div ref={lanesRef} className={'lanes' + (drag ? ' is-drag' : '')} style={{ height: (END - START) * HH }}>
                        {hours.map((h) => (
                          <div key={h} className="hl" style={{ top: (h - START) * HH }}></div>
                        ))}
                        {Array.from({ length: groups }, (_, i) => (
                          <div
                            key={i}
                            className={'col' + ((!isDay && weekStart + i === NOW_DAY) || (isDay && anchor === NOW_DAY) ? ' today' : '')}
                            style={{ left: `${i * gW}%`, width: `${gW}%` }}
                          ></div>
                        ))}
                        {gridList.map((a) => {
                          const p = pos[a.id];
                          if (!p || p.hidden) return null;
                          const g = isDay ? dayStaff.indexOf(a.staff) : a.day - weekStart;
                          // 주간 보기에서 두 예약이 겹치면: 먼저 온 예약은 칸 전체, 나중 예약은 오른쪽으로 비켜 겹쳐 표시
                          if (!isDay && p.n === 2) {
                            return p.lane === 0 ? block(a, g * gW, gW) : block(a, g * gW + gW * 0.4, gW * 0.6, true);
                          }
                          const w = gW / p.n;
                          return block(a, g * gW + p.lane * w, w);
                        })}
                        {drag ? (
                          <div
                            className={'drop' + (drag.hit ? ' bad' : '')}
                            aria-hidden="true"
                            style={{
                              top: (drag.st - START) * HH + 2,
                              height: Math.max(dragDur * HH - 4, 24),
                              left: `calc(${drag.g * gW}% + 3px)`,
                              width: `calc(${gW}% - 6px)`,
                            }}
                          >
                            <span className="num">
                              {md(drag.day)} ({dow[wd(drag.day)]}) {fmt(drag.st)}–{fmt(drag.st + dragDur)}
                            </span>
                            {drag.hit ? <b>{drag.hit.name || '고객 없는'} 예약과 겹쳐요</b> : null}
                          </div>
                        ) : null}
                        {more.map((m, i) => {
                          const w = gW / m.n;
                          return (
                            <button
                              key={i}
                              type="button"
                              className="blk-more"
                              style={{
                                top: (m.st - START) * HH + 2,
                                height: Math.max((m.end - m.st) * HH - 4, 24),
                                left: `calc(${m.group * gW + m.lane * w}% + 3px)`,
                                width: `calc(${w}% - 6px)`,
                              }}
                              onClick={() => {
                                setAnchor(weekStart + m.group);
                                setView('day');
                              }}
                            >
                              +{m.count}건
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {gridList.length === 0 ? <p className="empty-note">이 기간에는 예약이 없어요.</p> : null}
                  </div>
                </div>
              )}
              <p className="meta foot">같은 스탭의 예약 시간은 겹치지 않도록 제한됩니다. 휴무 및 휴게 시간은 매장 설정에서 관리할 수 있어요.</p>
            </section>

            {/* ── 우측: 예약 상세 / 오늘의 예약 ── */}
            <aside className="card right glass" ref={detailRef} aria-label={x ? '예약 상세' : '오늘의 예약'}>
              {x ? (
                <div className="detail kp-slide" key={x.id}>
                  <div className="d-top">
                    <span className={'st-chip s-' + statusOf(x)[1]}>{statusOf(x)[0]}</span>
                    <span className="meta num">NM-2611{String(dOf(x.day).getDate()).padStart(2, '0')}-{Math.round(x.st) + 4}</span>
                    <button type="button" className="ib close" aria-label="상세 닫기" onClick={closeDetail}>
                      ×
                    </button>
                  </div>

                  <div className="d-name">
                    <b>{x.name || '고객 정보 없음'}</b>
                    {x.name ? (
                      <AppLink href="/customers/detail" className="p-link">
                        고객 정보 보기 →
                      </AppLink>
                    ) : linking ? (
                      <div className="link-row">
                        <select className="inp" value={linkPick} onChange={(e) => setLinkPick(e.target.value)}>
                          {CUSTOMERS.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn-p"
                          onClick={() => {
                            patch(x.id, { name: linkPick });
                            setLinking(false);
                            pulse(x.id);
                            toast(linkPick + ' 님과 연결했어요.');
                          }}
                        >
                          연결
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="btn btn-sm" onClick={() => setLinking(true)}>
                        고객 연결
                      </button>
                    )}
                    {kim ? <span className="meta">누적 방문 8회 · 네일 평균 주기 24일</span> : null}
                  </div>

                  <dl className="d-dl">
                    <dt>예약 시간</dt>
                    <dd className="num strong">{when(x)}</dd>
                    <dt>시술</dt>
                    <dd className="strong">{x.treat}</dd>
                    <dt>담당</dt>
                    <dd>{x.staff}</dd>
                    <dt>{x.status === 'done' ? '결제 금액' : '예정 금액'}</dt>
                    <dd className="num strong">{price(x)}</dd>
                  </dl>

                  <div className="box">
                    <span className="lbl">고객 요청사항</span>
                    <p>{kim ? '짧은 길이 선호 · 자삽 젤 제거\n손톱 주변 피부가 민감해요.' : '등록된 요청사항이 없어요.'}</p>
                  </div>
                  <div className={'box note' + (isUnclosed(x) ? ' warn' : '')}>
                    <span className="lbl">특이사항</span>
                    <ul>
                      {notes(x).map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="d-acts">
                    {askCancel ? (
                      <div className="confirm">
                        <span>이 예약을 취소할까요? 캘린더에서 삭제돼요.</span>
                        <div>
                          <button type="button" className="btn btn-sm" onClick={() => setAskCancel(false)}>
                            돌아가기
                          </button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => cancelAppt(x)}>
                            예약 취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      actions(x)
                    )}
                  </div>
                </div>
              ) : (
                <div className="today kp-fade">
                  <span className="meta">오늘의 예약 · {md(NOW_DAY)} ({dow[wd(NOW_DAY)]})</span>
                  <p className="t-n">
                    <b className="num">{todayList.length}</b>건
                    <span className="meta num">
                      {' '}
                      · 완료 {todayList.filter((a) => a.status === 'done').length} · 남은 예약 {todayList.filter((a) => a.status !== 'done').length}
                    </span>
                  </p>
                  {nextUp ? (
                    <button type="button" className="next" onClick={() => select(nextUp.id)}>
                      <span className="meta">{nextUp.status === 'progress' ? '지금 진행 중' : '다음 예약'}</span>
                      <b>
                        <span className="num">{fmt(nextUp.st)}</span> {nextUp.name || '고객 없음'}
                      </b>
                      <span>
                        {nextUp.treat} · {nextUp.staff}
                      </span>
                    </button>
                  ) : null}
                  <ul className="t-list">
                    {todayList.map((a) => (
                      <li key={a.id}>
                        <button type="button" onClick={() => select(a.id)}>
                          <span className="num t-time">{fmt(a.st)}</span>
                          <span className="t-who">
                            <b>{a.name || '고객 없음'}</b>
                            <span>{a.treat}</span>
                          </span>
                          <span className={'t-st s-' + statusOf(a)[1]}>{statusOf(a)[0]}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="meta">예약을 누르면 이 자리에 상세 정보가 표시돼요.</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      {reg ? (
        <div className="overlay" onClick={() => setReg(null)}>
          <div className="card modal" role="dialog" aria-label={reg.editId ? '일정 변경' : '예약 등록'} onClick={(e) => e.stopPropagation()}>
            <h2 className="h2" style={{ fontSize: '19px' }}>
              {reg.editId ? '일정 변경' : '예약 등록'}
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
              <input className="inp" placeholder="고객 이름 검색" value={reg.name} disabled={reg.noCust} onChange={(e) => setReg({ ...reg, name: e.target.value })} />
              <label className="chk" style={{ marginTop: '8px' }}>
                <input type="checkbox" checked={reg.noCust} onChange={(e) => setReg({ ...reg, noCust: e.target.checked })} />
                <span>고객 없이 시간만 막기 (다른 앱으로 받은 예약)</span>
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              <div>
                <span className="lbl">날짜</span>
                <select className="inp" value={reg.day} onChange={(e) => setReg({ ...reg, day: Number(e.target.value) })}>
                  {regDays.map((off) => (
                    <option key={off} value={off}>
                      {md(off)} ({dow[wd(off)]})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="lbl">시간</span>
                <select className="inp" value={reg.st} onChange={(e) => setReg({ ...reg, st: Number(e.target.value) })}>
                  {(times.includes(reg.st) ? times : [...times, reg.st].sort((a, b) => a - b)).map((t) => (
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
                  .filter((m) => m !== '딥 플럼 상담' || reg.treats.includes(m))
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
                {reg.editId ? '변경 저장' : '등록'}
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
                {fin.link || '고객 없음'} ·{' '}
                {(() => {
                  const a = items.find((i) => i.id === fin.id)!;
                  return md(a.day) + ' ' + fmt(a.st) + ' · ' + a.staff + ' · ' + a.route;
                })()}
              </span>
            </div>

            {!fin.link ? (
              <div className="hint">
                고객 없는 예약이에요. 여기서 고객을 연결하세요.
                <select className="inp" style={{ marginTop: '8px' }} value="" onChange={(e) => setFin({ ...fin, link: e.target.value })}>
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
                  <div key={i} className="fin-line">
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
    </div>
  );
}
