import { useMemo, useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { PinGate } from '@/components/common/PinGate';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styleText from './CampaignsPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

type Status = '주기 도래' | '이탈 신호' | '장기 미방문';
type Cust = {
  name: string;
  cat: string;
  status: Status;
  consent: boolean;
  optout: boolean;
  next: boolean;
  otherApp: boolean;
  nightOk: boolean;
};

const CATS = ['젤 네일', '네일 케어', '속눈썹 연장', '패디큐어'];
const STATUSES: Status[] = ['주기 도래', '이탈 신호', '장기 미방문'];
const SHOP = '네일무드 성수';
const UNIT_COST = 20;

const c = (name: string, cat: string, status: Status, o: Partial<Cust> = {}): Cust => ({
  name,
  cat,
  status,
  consent: true,
  optout: false,
  next: false,
  otherApp: false,
  nightOk: false,
  ...o,
});

const CUSTS: Cust[] = [
  c('최유진', '젤 네일', '주기 도래'),
  c('송다인', '젤 네일', '주기 도래', { nightOk: true }),
  c('정소윤', '젤 네일', '주기 도래'),
  c('한지우', '젤 네일', '주기 도래'),
  c('이나래', '젤 네일', '주기 도래', { next: true }),
  c('박세아', '젤 네일', '주기 도래', { consent: false }),
  c('윤하늘', '젤 네일', '주기 도래', { otherApp: true }),
  c('서민아', '젤 네일', '주기 도래', { nightOk: true }),
  c('오서현', '젤 네일', '이탈 신호'),
  c('정하린', '젤 네일', '이탈 신호', { consent: false }),
  c('강유나', '젤 네일', '이탈 신호', { optout: true }),
  c('김예원', '젤 네일', '이탈 신호'),
  c('조은서', '젤 네일', '장기 미방문'),
  c('임채원', '젤 네일', '장기 미방문', { otherApp: true }),
  c('김민지', '네일 케어', '주기 도래'),
  c('배수아', '네일 케어', '주기 도래', { nightOk: true }),
  c('문가영', '네일 케어', '이탈 신호'),
  c('박지은', '속눈썹 연장', '주기 도래'),
  c('홍서윤', '속눈썹 연장', '주기 도래', { next: true }),
  c('안유림', '속눈썹 연장', '이탈 신호'),
  c('류하은', '패디큐어', '주기 도래'),
  c('신다은', '패디큐어', '장기 미방문', { optout: true }),
];

const TPLS = [
  { id: 0, name: '주기 도래 안부', fits: '주기 도래', body: '{고객명} 고객님, 지난 {시술} 이후 시간이 꽤 지났어요. 편한 시간에 예약 링크에서 확인해 보세요.' },
  { id: 1, name: '오랜만이에요', fits: '이탈 신호', body: '{고객명} 고객님, 잘 지내시나요? {시술} 관리 받으신 지 조금 됐어요. 이번 달 일정 확인하고 가세요.' },
  { id: 2, name: '다시 만나요', fits: '장기 미방문', body: '{고객명} 고객님, 오랜만에 인사드려요. 지난 {시술} 기록을 기준으로 가볍게 다시 시작해 보실래요?' },
];

type Camp = { id: string; title: string; status: string; targets: number; sent: number; date: string; control?: number; msg?: string };
const INIT_CAMPS: Camp[] = [
  { id: 'c2', title: '월말 케어 리마인드', status: '예약 발송', targets: 17, sent: 0, date: '11.24 11:00 예약', control: 2, msg: '(광고) 네일무드 성수\n{고객명} 고객님, 월말에는 손톱 케어로 한 달을 마무리해 보세요.\n무료 수신거부 080-000-0000 (예시)' },
  { id: 'c3', title: '펄 디자인 재방문 캠페인', status: '발송 완료(가상)', targets: 30, sent: 24, date: '11.06 발송', control: 6, msg: '(광고) 네일무드 성수\n{고객명} 고객님, 좋아하셨던 펄 디자인의 새로운 무드를 준비했어요.\n무료 수신거부 080-000-0000 (예시)' },
  { id: 'c4', title: '가을 컬러 리마인드', status: '발송 완료(가상)', targets: 30, sent: 24, date: '11.13 발송', control: 6, msg: '(광고) 네일무드 성수\n{고객명} 고객님, 가을 컬러가 새로 들어왔어요.\n무료 수신거부 080-000-0000 (예시)' },
];

const ST: Record<string, [string, string]> = {
  '예약 발송': ['#F1E4E0', '#6D434B'],
  '발송 완료(가상)': ['#F9EBE8', '#85505A'],
  '검토 대기': ['#F5EBD3', '#6B4509'],
};

function Body() {
  const [sel, setSel] = useState('new');
  const [camps, setCamps] = useState<Camp[]>(INIT_CAMPS);
  const [cat, setCat] = useState(CATS[0]);
  const [statuses, setStatuses] = useState<Status[]>(['주기 도래']);
  const [tpl, setTpl] = useState<number | null>(null);
  const [ctrl, setCtrl] = useState(10);
  const [reviewed, setReviewed] = useState(false);
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [night, setNight] = useState(() => {
    const h = new Date().getHours();
    return h >= 21 || h < 8;
  });
  const [nightOnly, setNightOnly] = useState(false);
  const [done, setDone] = useState('');
  const [pvIdx, setPvIdx] = useState(0);

  const targets = useMemo(() => CUSTS.filter((x) => x.cat === cat && statuses.includes(x.status)), [cat, statuses]);
  const ex = {
    consent: targets.filter((x) => !x.consent),
    optout: targets.filter((x) => x.consent && x.optout),
    next: targets.filter((x) => x.consent && !x.optout && x.next),
    other: targets.filter((x) => x.consent && !x.optout && !x.next && x.otherApp),
  };
  const base = targets.filter((x) => x.consent && !x.optout && !x.next && !x.otherApp);
  const otherCheck = targets.filter((x) => x.consent && !x.optout && !x.next && x.otherApp).length;
  const sendable = nightOnly ? base.filter((x) => x.nightOk) : base;
  const nightExcluded = base.length - sendable.length;
  const controlN = Math.min(sendable.length, Math.round((sendable.length * ctrl) / 100));
  const sendN = sendable.length - controlN;
  const cost = sendN * UNIT_COST;

  const mainStatus = statuses[0] ?? '주기 도래';
  const recId = TPLS.find((t) => t.fits === mainStatus)?.id ?? 0;
  const useTpl = tpl ?? recId;
  const tplObj = TPLS[useTpl];
  const pvCust = sendable[Math.min(pvIdx, Math.max(sendable.length - 1, 0))];
  const personalized = (cu?: Cust) =>
    tplObj.body.replace('{고객명}', cu?.name ?? '고객').replace('{시술}', cat);
  const fullMsg = (cu?: Cust) => `(광고) ${SHOP}\n${personalized(cu)}\n무료 수신거부 080-000-0000 (예시)`;

  const blocked = mode === 'now' && night && !nightOnly;
  const canSend = reviewed && sendN > 0 && !blocked;

  const toggleStatus = (s: Status) => {
    setStatuses((p) => (p.includes(s) ? (p.length > 1 ? p.filter((x) => x !== s) : p) : [...p, s]));
    setReviewed(false);
  };

  const send = () => {
    if (!canSend) return;
    const isNow = mode === 'now';
    const nc: Camp = {
      id: 'n' + Date.now(),
      title: `${cat} ${statuses.join('·')} 안내`,
      status: isNow ? '발송 완료(가상)' : '예약 발송',
      targets: targets.length,
      sent: isNow ? sendN : 0,
      date: isNow ? '방금 발송' : '내일 11:00 예약',
      control: controlN,
      msg: fullMsg(),
    };
    setCamps((p) => [nc, ...p]);
    setDone(isNow ? `가상 발송했어요. 실제 문자는 나가지 않습니다. (발송 ${sendN}건 · 대조군 ${controlN}명)` : `내일 11:00 예약 발송으로 등록했어요. (발송 ${sendN}건 · 대조군 ${controlN}명)`);
    setReviewed(false);
  };

  const cur = camps.find((x) => x.id === sel);
  const totalSent = camps.reduce((a, x) => a + x.sent, 0);

  return (
    <div className="cp-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
        <div>
          <h1 className="cp-h1">캠페인 관리</h1>
          <p className="cp-sub">시술 카테고리 하나를 정해 대상을 고르고, 제외 사유와 비용을 확인한 뒤 검토 후 발송해요.</p>
        </div>
        <button type="button" className="cp-btn p" onClick={() => { setSel('new'); setDone(''); }}>
          + 캠페인 만들기
        </button>
      </div>

      <section className="cp-kpis" aria-label="캠페인 현황">
        <div className="cp-card cp-kpi"><span>예약 발송</span><b className="num">{camps.filter((x) => x.status === '예약 발송').length}건</b><em>발송 전까지 수정 가능</em></div>
        <div className="cp-card cp-kpi"><span>이번 달 발송</span><b className="num">{totalSent}건</b><em>가상 발송 기준</em></div>
        <div className="cp-card cp-kpi"><span>캠페인 수</span><b className="num">{camps.length}건</b><em>예약·완료 포함</em></div>
        <div className="cp-card cp-kpi"><span>성과 확인</span><b style={{ fontSize: 16, paddingTop: 8 }}><AppLink href="/performance" style={{ color: '#85505A' }}>성과 분석 보기 →</AppLink></b><em>귀속 14일 기준</em></div>
      </section>

      <div className="cp-grid">
        <section className="cp-card cp-list" aria-label="캠페인 목록">
          <h2>캠페인 목록</h2>
          <button type="button" className="cp-item" aria-pressed={sel === 'new'} onClick={() => { setSel('new'); setDone(''); }}>
            <b>새 캠페인 만들기</b>
            <span className="cp-meta">대상 선정부터 발송까지 단계별로 진행</span>
          </button>
          {camps.map((x) => (
            <button type="button" className="cp-item" key={x.id} aria-pressed={sel === x.id} onClick={() => setSel(x.id)}>
              <b>{x.title}</b>
              <span className="cp-meta num">대상 {x.targets}명 · 발송 {x.sent}건</span>
              <span className="cp-row2">
                <span className="cp-meta num">{x.date}</span>
                <span className="cp-chip" style={{ background: ST[x.status][0], color: ST[x.status][1] }}>{x.status}</span>
              </span>
            </button>
          ))}
        </section>

        <section className="cp-card cp-main" aria-label="캠페인 상세">
          {sel === 'new' ? (
            <>
              <div className="cp-step">
                <h3><i>1</i>시술 카테고리와 대상 선정</h3>
                <div className="cp-seg" role="group" aria-label="시술 카테고리">
                  {CATS.map((k) => (
                    <button type="button" key={k} aria-pressed={cat === k} onClick={() => { setCat(k); setReviewed(false); setPvIdx(0); }}>{k}</button>
                  ))}
                </div>
                <div className="cp-seg" role="group" aria-label="예측 상태">
                  {STATUSES.map((s) => (
                    <button type="button" key={s} aria-pressed={statuses.includes(s)} onClick={() => toggleStatus(s)}>{s}</button>
                  ))}
                </div>
                <div className="cp-box">
                  <span style={{ fontWeight: 600 }} className="num">대상 {targets.length}명 → 발송 가능 {sendable.length}명</span>
                  <span className="cp-note">{cat} 시술 기록이 있고 예측 상태가 {statuses.join(' / ')}인 고객이에요.</span>
                </div>
              </div>

              <div className="cp-step">
                <h3><i>2</i>제외 사유</h3>
                <div className="cp-excl">
                  <span className="cp-ex">수신 미동의 <b className="num">{ex.consent.length}</b></span>
                  <span className="cp-ex">수신 거부 <b className="num">{ex.optout.length}</b></span>
                  <span className="cp-ex">다음 예약 있음 <b className="num">{ex.next.length}</b></span>
                  <span className="cp-ex">다른 앱 예약 확인 필요 <b className="num">{otherCheck}</b></span>
                  {nightOnly && <span className="cp-ex">야간 광고 미동의 <b className="num">{nightExcluded}</b></span>}
                </div>
                <span className="cp-note">다른 앱 예약 확인 필요 고객은 발송 대상에서 빠지며, 다른 앱 예약 목록과 대조한 뒤 직접 안내할 수 있어요.</span>
              </div>

              <div className="cp-step">
                <h3><i>3</i>템플릿 선택</h3>
                <div className="cp-tpls">
                  {TPLS.map((t) => (
                    <button type="button" className="cp-tpl" key={t.id} aria-pressed={useTpl === t.id} onClick={() => setTpl(t.id)}>
                      <b>{t.name} {t.id === recId && <span className="cp-chip" style={{ background: '#F1E4E0', color: '#85505A', marginLeft: 4 }}>추천</span>}</b>
                      <span className="cp-note">{t.fits} 고객용{t.id === recId ? ' · 선택한 대상 상태 기준 추천(규칙 기반)' : ''}</span>
                    </button>
                  ))}
                </div>
                <div className="cp-pv">
                  <div className="cp-phone" aria-label="가상 휴대폰 미리보기">
                    <div className="top">가상 휴대폰 · 문자 메시지</div>
                    <div className="cp-bubble">{fullMsg(pvCust)}</div>
                  </div>
                  <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="cp-lbl">개인화 미리보기 고객</span>
                      <select className="cp-fld" value={pvIdx} onChange={(e) => setPvIdx(Number(e.target.value))}>
                        {sendable.length === 0 && <option value={0}>발송 가능한 고객 없음</option>}
                        {sendable.map((x, i) => <option key={x.name} value={i}>{x.name}</option>)}
                      </select>
                    </label>
                    <div className="cp-box">
                      <span className="cp-note">자동 삽입되며 삭제할 수 없어요</span>
                      <span style={{ fontSize: 13 }}>(광고) 표기<span className="cp-lock">잠금</span></span>
                      <span style={{ fontSize: 13 }}>전송자명 {SHOP}<span className="cp-lock">잠금</span></span>
                      <span style={{ fontSize: 13 }}>무료 수신거부 안내<span className="cp-lock">잠금</span></span>
                    </div>
                    <span className="cp-note">고객 이름과 시술명은 발송 시 고객별로 채워져요.</span>
                  </div>
                </div>
              </div>

              <div className="cp-step">
                <h3><i>4</i>예상 비용·건수와 대조군</h3>
                <div className="cp-stats">
                  <div className="cp-stat"><b className="num">{sendable.length}명</b><span>발송 가능 대상</span></div>
                  <div className="cp-stat"><b className="num">{controlN}명</b><span>대조군(발송 안 함)</span></div>
                  <div className="cp-stat"><b className="num">{sendN}건</b><span>예상 발송</span></div>
                  <div className="cp-stat"><b className="num">{cost.toLocaleString()}원</b><span>예상 비용(건당 {UNIT_COST}원 예시)</span></div>
                </div>
                <label style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                  <span className="cp-lbl">대조군 비율</span>
                  <input type="range" min={0} max={30} step={5} value={ctrl} onChange={(e) => setCtrl(Number(e.target.value))} style={{ accentColor: '#85505A' }} />
                  <input className="cp-fld num" type="number" min={0} max={30} value={ctrl} onChange={(e) => setCtrl(Math.max(0, Math.min(30, Number(e.target.value) || 0)))} style={{ width: 80 }} />
                  <span className="cp-note">% · 대상 중 일부를 무작위로 골라 발송하지 않고, 성과 분석에서 발송군과 비교해요.</span>
                </label>
              </div>

              <div className="cp-step">
                <h3><i>5</i>발송 시점</h3>
                <div className="cp-seg" role="group" aria-label="발송 방식">
                  <button type="button" aria-pressed={mode === 'now'} onClick={() => setMode('now')}>즉시 발송</button>
                  <button type="button" aria-pressed={mode === 'schedule'} onClick={() => setMode('schedule')}>예약 발송</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="cp-note">시연용 현재 시각</span>
                    <select className="cp-fld" value={night ? 'n' : 'd'} onChange={(e) => setNight(e.target.value === 'n')}>
                      <option value="d">오후 2:00 (주간)</option>
                      <option value="n">밤 10:30 (야간)</option>
                    </select>
                  </label>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                    <input type="checkbox" checked={nightOnly} onChange={(e) => { setNightOnly(e.target.checked); setReviewed(false); }} style={{ accentColor: '#85505A' }} />
                    야간 광고 수신 동의 고객만 발송
                  </label>
                </div>
                {blocked ? (
                  <div className="cp-warn">야간(21시~08시)에는 광고를 즉시 발송할 수 없어요. 예약 발송을 선택하면 다음 날 오전에 보내드려요.
                    <div style={{ marginTop: 8 }}><button type="button" className="cp-btn" onClick={() => setMode('schedule')}>예약 발송으로 바꾸기</button></div>
                  </div>
                ) : mode === 'schedule' ? (
                  <div className="cp-ok">내일 오전 11:00에 발송돼요. 발송 전까지 문구와 대상을 수정할 수 있어요.</div>
                ) : null}
              </div>

              <div className="cp-step">
                <h3><i>6</i>검토 후 발송</h3>
                <label className="cp-check">
                  <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
                  <span>원장 등 허용된 스탭이 다른 앱 예약 목록과 대조해, 발송 대상에 이미 예약한 고객이 없음을 확인했어요.</span>
                </label>
                {done && <div className="cp-ok">{done}</div>}
                <div className="cp-btns">
                  <span className="cp-note">MVP는 가상 발송이에요. 실제 문자는 전송되지 않아요.</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="cp-btn">임시 저장</button>
                    <button type="button" className="cp-btn p" disabled={!canSend} onClick={send}>
                      {mode === 'now' ? `${sendN}명에게 가상 발송` : `${sendN}명 예약 발송 등록`}
                    </button>
                  </div>
                </div>
                {!reviewed && <span className="cp-note">검토 체크를 해야 발송할 수 있어요.</span>}
              </div>
            </>
          ) : cur ? (
            <>
              <div className="cp-row2">
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{cur.title}</h2>
                <span className="cp-chip" style={{ background: ST[cur.status][0], color: ST[cur.status][1] }}>{cur.status}</span>
              </div>
              <div className="cp-stats">
                <div className="cp-stat"><b className="num">{cur.targets}명</b><span>대상</span></div>
                <div className="cp-stat"><b className="num">{cur.control ?? 0}명</b><span>대조군</span></div>
                <div className="cp-stat"><b className="num">{cur.sent}건</b><span>발송</span></div>
                <div className="cp-stat"><b className="num" style={{ fontSize: 14, paddingTop: 5 }}>{cur.date}</b><span>일정</span></div>
              </div>
              <div className="cp-phone" style={{ alignSelf: 'flex-start' }}>
                <div className="top">가상 휴대폰 · 문자 메시지</div>
                <div className="cp-bubble">{cur.msg}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {cur.status === '예약 발송' ? (
                  <>
                    <button type="button" className="cp-btn">발송 일정 변경</button>
                    <button type="button" className="cp-btn" style={{ color: '#8F2F2F' }}>예약 발송 취소</button>
                  </>
                ) : (
                  <AppLink href="/performance" className="cp-btn p">성과 자세히 보기</AppLink>
                )}
              </div>
            </>
          ) : null}
        </section>
      </div>
      <p className="cp-foot">마케팅 수신 동의 고객에게만 발송해요. 문구는 규칙·템플릿 기반으로 추천되며 자동 발송되지 않고, 검토 체크가 필요해요. MVP는 가상 발송입니다.</p>
    </div>
  );
}

export default function CampaignsPage() {
  useStyleSheet('CampaignsPage', styleText);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1100px' }}>
      <div style={{ flex: '0 0 232px', background: '#F4EBE6' }}>
        <Sidebar active="campaigns" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="파트너 센터 / 캠페인 관리" />
        <PinGate id="campaigns" title="캠페인 관리">
          <Body />
        </PinGate>
      </main>
    </div>
  );
}
