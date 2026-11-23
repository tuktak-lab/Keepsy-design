import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { PinGate } from '@/components/common/PinGate';
import { toast } from '@/components/common/Toast';
import styleText from './SettingsPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

type Menu = { id: number; cat: string; name: string; min: number; max: number; addon: boolean; end: boolean };

const INIT_MENUS: Menu[] = [
  { id: 1, cat: '네일', name: '젤 원컬러', min: 21, max: 28, addon: false, end: false },
  { id: 2, cat: '네일', name: '젤 제거만', min: 21, max: 28, addon: false, end: true },
  { id: 3, cat: '네일', name: '아트 추가', min: 21, max: 28, addon: true, end: false },
  { id: 4, cat: '속눈썹', name: '연장 풀세트', min: 30, max: 60, addon: false, end: false },
  { id: 5, cat: '왁싱', name: '브라질리언', min: 28, max: 42, addon: false, end: false },
  { id: 6, cat: '반영구', name: '눈썹 시술', min: 365, max: 730, addon: false, end: false },
  { id: 7, cat: '반영구', name: '리터치(무료 보수)', min: 365, max: 730, addon: true, end: false },
  { id: 8, cat: '기타', name: '두피 케어', min: 28, max: 56, addon: false, end: false },
];

const INIT_STAFF = [
  { id: 1, name: '하늘', part: '네일', pin: true, lock: true },
  { id: 2, name: '서연', part: '네일', pin: true, lock: true },
  { id: 3, name: '다은', part: '속눈썹', pin: true, lock: false },
  { id: 4, name: '지우', part: '왁싱', pin: false, lock: false },
  { id: 5, name: '유나', part: '반영구', pin: true, lock: true },
];

const INIT_FEATURES: { id: string; name: string; pin: boolean }[] = [
  { id: 'dash', name: '대시보드', pin: false },
  { id: 'cal', name: '캘린더·예약', pin: false },
  { id: 'insight', name: '인사이트', pin: false },
  { id: 'contact', name: '고객 연락처 전체 보기', pin: true },
  { id: 'pay', name: '결제 수정·취소', pin: true },
  { id: 'camp', name: '캠페인', pin: true },
  { id: 'perf', name: '성과', pin: true },
];

function Toggle(props: { on: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={props.on}
      aria-label={props.label}
      className="st-sw"
      style={{ background: props.on ? '#7A4450' : '#D9CBC4' }}
      onClick={() => props.onChange(!props.on)}
    >
      <i style={{ left: props.on ? 21 : 3 }} />
    </button>
  );
}

export default function SettingsPage() {
  useStyleSheet('SettingsPage', styleText);

  const [shop, setShop] = useState({ name: '네일무드 성수', tel: '02-0000-0000', addr: '서울 성동구 연무장길 24, 2층' });
  const [hours, setHours] = useState(
    DAYS.map((d, i) => ({ day: d, open: '10:00', close: i === 5 ? '18:00' : '20:00', off: i === 6 })),
  );
  const [holidays, setHolidays] = useState([
    { id: 1, date: '2026-12-25', kind: '매장', who: '전체', memo: '성탄절' },
    { id: 2, date: '2026-12-02', kind: '스탭', who: '다은', memo: '연차' },
  ]);
  const [newHol, setNewHol] = useState({ date: '', kind: '매장', who: '전체' });
  const [menus, setMenus] = useState(INIT_MENUS);
  const [churn, setChurn] = useState({ auto: true, cap: 120 });
  const [staff, setStaff] = useState(INIT_STAFF);
  const [features, setFeatures] = useState(INIT_FEATURES);
  const [send, setSend] = useState({ name: '네일무드 성수', tel: '02-0000-0000', limit: 300, control: 10 });
  const [keep, setKeep] = useState(3);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const touch = () => {
    setDirty(true);
    setSaved(false);
  };

  const addHoliday = () => {
    if (!newHol.date) {
      toast('휴무 날짜를 먼저 선택해 주세요', 'warn');
      return;
    }
    setHolidays((h) => [...h, { id: Date.now(), ...newHol, memo: '' }]);
    setNewHol({ date: '', kind: '매장', who: '전체' });
    touch();
    toast(`${newHol.date} ${newHol.kind} 휴무일을 추가했어요`);
  };

  const saveAll = () => {
    setDirty(false);
    setSaved(true);
    toast('매장 설정을 저장했어요');
  };

  const updMenu = (id: number, patch: Partial<Menu>) => {
    setMenus((m) => m.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    touch();
  };

  const cats = ['네일', '속눈썹', '왁싱', '반영구', '기타'];
  const expireYear = 2026 - keep;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1200px' }}>
      <div style={{ flex: '0 0 232px' }}>
        <Sidebar active="settings" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="파트너 센터 / 매장 설정" />
        <PinGate id="settings" title="매장 설정">
          <div className="st-wrap">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <h1 className="st-h1">매장 설정</h1>
                <p className="st-sub">매장 정보, 시술 주기, 예측 기준, 스탭 잠금과 발송 규칙을 관리해요.</p>
              </div>
              <div className="st-savebar">
                <span className="st-meta kp-fade" key={dirty ? 'd' : saved ? 's' : 'n'} style={{ color: dirty ? '#7A4450' : undefined }}>
                  {dirty ? '저장되지 않은 변경 사항이 있어요' : saved ? '저장됨 · 2026.11.23' : '변경 사항 없음'}
                </span>
                <button
                  type="button"
                  className="st-btn p"
                  disabled={!dirty}
                  onClick={saveAll}
                >
                  변경사항 저장
                </button>
              </div>
            </div>
            <nav className="st-nav" aria-label="설정 구역">
              <a href="#st-shop">매장 정보</a>
              <a href="#st-menu">시술 메뉴·주기</a>
              <a href="#st-status">예측 상태 기준</a>
              <a href="#st-lock">스탭·PIN·잠금</a>
              <a href="#st-send">발송 설정</a>
              <a href="#st-privacy">개인정보 보관</a>
            </nav>
            <div className="st-note">설정 화면은 원장 PIN으로만 열려요. 이 화면의 모든 변경은 항상 원장 PIN이 필요해요.</div>

            {/* 1. 매장 정보 */}
            <section id="st-shop" className="st-card">
              <h2>매장 정보 · 영업시간 · 휴무일</h2>
              <div className="st-grid">
                <div className="st-field">
                  <label className="st-lbl" htmlFor="shop">매장명</label>
                  <input id="shop" className="st-fld" value={shop.name} onChange={(e) => { setShop({ ...shop, name: e.target.value }); touch(); }} />
                </div>
                <div className="st-field">
                  <label className="st-lbl" htmlFor="tel">매장 연락처</label>
                  <input id="tel" className="st-fld num" value={shop.tel} onChange={(e) => { setShop({ ...shop, tel: e.target.value }); touch(); }} />
                </div>
                <div className="st-field" style={{ flexBasis: '100%' }}>
                  <label className="st-lbl" htmlFor="addr">매장 주소</label>
                  <input id="addr" className="st-fld" value={shop.addr} onChange={(e) => { setShop({ ...shop, addr: e.target.value }); touch(); }} />
                </div>
              </div>
              <div>
                <div className="st-lbl">요일별 영업시간</div>
                {hours.map((h, i) => (
                  <div className="st-row" key={h.day}>
                    <span className="nm" style={{ width: 28, fontWeight: 600 }}>{h.day}</span>
                    <input type="time" className="st-time num" value={h.open} disabled={h.off} aria-label={`${h.day} 오픈`}
                      onChange={(e) => { setHours(hours.map((x, j) => (j === i ? { ...x, open: e.target.value } : x))); touch(); }} />
                    <span>~</span>
                    <input type="time" className="st-time num" value={h.close} disabled={h.off} aria-label={`${h.day} 마감`}
                      onChange={(e) => { setHours(hours.map((x, j) => (j === i ? { ...x, close: e.target.value } : x))); touch(); }} />
                    <label className="st-chk">
                      <input type="checkbox" checked={h.off}
                        onChange={(e) => { setHours(hours.map((x, j) => (j === i ? { ...x, off: e.target.checked } : x))); touch(); }} />
                      휴무
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <div className="st-lbl">휴무일</div>
                {holidays.map((h) => (
                  <div className="st-row kp-fade" key={h.id}>
                    <span className="num" style={{ width: 96 }}>{h.date}</span>
                    <span className={h.kind === '매장' ? 'st-tag' : 'st-tag w'}>{h.kind} 휴무</span>
                    <span className="grow">{h.who}{h.memo ? ` · ${h.memo}` : ''}</span>
                    <button type="button" className="st-btn" onClick={() => { setHolidays(holidays.filter((x) => x.id !== h.id)); touch(); toast(`${h.date} ${h.kind} 휴무일을 삭제했어요`); }}>삭제</button>
                  </div>
                ))}
                <div className="st-row">
                  <input type="date" className="st-time" style={{ width: 150 }} value={newHol.date} aria-label="휴무 날짜"
                    onChange={(e) => setNewHol({ ...newHol, date: e.target.value })} />
                  <div className="st-seg" role="group" aria-label="휴무 구분">
                    {['매장', '스탭'].map((k) => (
                      <button key={k} type="button" aria-pressed={newHol.kind === k}
                        onClick={() => setNewHol({ ...newHol, kind: k, who: k === '매장' ? '전체' : staff[0].name })}>{k} 휴무</button>
                    ))}
                  </div>
                  {newHol.kind === '스탭' && (
                    <select className="st-time" style={{ width: 100 }} value={newHol.who} aria-label="스탭 선택"
                      onChange={(e) => setNewHol({ ...newHol, who: e.target.value })}>
                      {staff.map((s) => <option key={s.id}>{s.name}</option>)}
                    </select>
                  )}
                  <button type="button" className="st-btn p" onClick={addHoliday}>휴무일 추가</button>
                </div>
              </div>
            </section>

            {/* 2. 시술 메뉴 */}
            <section id="st-menu" className="st-card">
              <h2>시술 메뉴 · 기본 주기</h2>
              <p className="st-meta">카테고리 기본값에서 시작하고, 메뉴마다 기본 주기(일)를 고칠 수 있어요. 고객 기록이 쌓이면 개인 평균 주기를 우선 적용해요.</p>
              <div className="st-note">
                <b>주기 계산 제외</b> : 반영구 리터치·무료 보수·아트 추가처럼 앞선 시술에 덧붙는 메뉴예요. 방문으로 기록되지만 재방문 주기 계산에는 넣지 않아요.<br />
                <b>종료 신호</b> : "젤 제거만"처럼 해당 시술을 그만둔다는 신호예요. 이 메뉴가 마지막이면 다음 방문을 예측하지 않아요.
              </div>
              {cats.map((c) => {
                const list = menus.filter((m) => m.cat === c);
                const d = list[0];
                return (
                  <div key={c}>
                    <div className="st-cat">{c} <span className="st-meta num">· 기본값 {d ? `${d.min}~${d.max}일` : ''}</span></div>
                    {list.map((m) => (
                      <div className="st-row" key={m.id}>
                        <span className="grow nm">{m.name}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <input type="number" className="st-time num" value={m.min} aria-label={`${m.name} 최소 주기`}
                            onChange={(e) => updMenu(m.id, { min: Number(e.target.value) })} />
                          ~
                          <input type="number" className="st-time num" value={m.max} aria-label={`${m.name} 최대 주기`}
                            onChange={(e) => updMenu(m.id, { max: Number(e.target.value) })} />
                          일
                        </span>
                        <label className="st-chk"><input type="checkbox" checked={m.addon} onChange={(e) => updMenu(m.id, { addon: e.target.checked })} />주기 계산 제외</label>
                        <label className="st-chk"><input type="checkbox" checked={m.end} onChange={(e) => updMenu(m.id, { end: e.target.checked })} />종료 신호</label>
                      </div>
                    ))}
                  </div>
                );
              })}
            </section>

            {/* 3. 예측 상태 */}
            <section id="st-status" className="st-card">
              <h2>예측 상태 기준</h2>
              <div className="st-grid" style={{ alignItems: 'flex-end' }}>
                <label className="st-chk" style={{ flex: '1 1 260px' }}>
                  <input type="checkbox" checked={churn.auto} onChange={(e) => { setChurn({ ...churn, auto: e.target.checked }); touch(); }} />
                  이탈 신호 기간을 고객별 해당 시술 평균 간격으로 사용
                </label>
                <div className="st-field" style={{ flex: '0 0 180px' }}>
                  <label className="st-lbl" htmlFor="cap">이탈 신호 상한(일)</label>
                  <input id="cap" type="number" className="st-fld num" value={churn.cap}
                    onChange={(e) => { setChurn({ ...churn, cap: Number(e.target.value) }); touch(); }} />
                </div>
              </div>
              <p className="st-meta">기본 상한은 120일이에요. 평균 간격이 이보다 길어도 상한까지만 이탈 신호로 봐요.</p>
              <dl>
                <div className="st-def"><dt className="st-lbl"><span className="st-tag">예정</span></dt><dd>다음 방문 예측일 전이에요. 아직 챙길 필요가 없어요.</dd></div>
                <div className="st-def"><dt className="st-lbl"><span className="st-tag">주기 도래</span></dt><dd>예측 시작일~종료일 사이예요. 예약이 없으면 안내를 고려해요.</dd></div>
                <div className="st-def"><dt className="st-lbl"><span className="st-tag w">이탈 신호</span></dt><dd>예측 종료일이 지나 이탈 신호 기간 안에 있어요.</dd></div>
                <div className="st-def"><dt className="st-lbl"><span className="st-tag w">장기 미방문</span></dt><dd>이탈 신호 기간까지 지나도록 방문이 없어요.</dd></div>
              </dl>
            </section>

            {/* 4. 스탭·PIN·잠금 */}
            <section id="st-lock" className="st-card">
              <h2>스탭 · PIN · 기능 잠금</h2>
              <div className="st-note">스탭은 5명(네일 2 · 속눈썹 1 · 왁싱 1 · 반영구 1)이에요. 잠금 기능은 허용된 스탭이 자기 PIN을 입력해야 열려요. 설정 변경은 항상 원장 PIN이 필요해요.</div>
              <div>
                {staff.map((s) => (
                  <div className="st-row" key={s.id}>
                    <span className="nm" style={{ width: 56 }}>{s.name}</span>
                    <span className="st-tag">{s.part}</span>
                    <span className="grow st-meta">{s.pin ? 'PIN 설정됨' : 'PIN 미설정'}</span>
                    <button type="button" className="st-btn" onClick={() => { setStaff(staff.map((x) => (x.id === s.id ? { ...x, pin: true } : x))); touch(); toast(s.pin ? `${s.name} PIN 변경을 반영했어요 · 저장하면 적용돼요` : `${s.name} PIN을 설정했어요 · 저장하면 적용돼요`); }}>
                      {s.pin ? 'PIN 변경' : 'PIN 설정'}
                    </button>
                    <label className="st-chk">
                      <input type="checkbox" checked={s.lock} disabled={!s.pin}
                        onChange={(e) => { setStaff(staff.map((x) => (x.id === s.id ? { ...x, lock: e.target.checked } : x))); touch(); }} />
                      잠금 기능 사용 허용
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <div className="st-lbl">기능별 접근 방식</div>
                {features.map((f) => (
                  <div className="st-row" key={f.id}>
                    <span className="grow nm">{f.name}</span>
                    <div className="st-seg" role="group" aria-label={`${f.name} 접근 방식`}>
                      <button type="button" aria-pressed={!f.pin} onClick={() => { setFeatures(features.map((x) => (x.id === f.id ? { ...x, pin: false } : x))); touch(); }}>공용</button>
                      <button type="button" aria-pressed={f.pin} onClick={() => { setFeatures(features.map((x) => (x.id === f.id ? { ...x, pin: true } : x))); touch(); }}>PIN</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. 발송 설정 */}
            <section id="st-send" className="st-card">
              <h2>발송 설정</h2>
              <div className="st-grid">
                <div className="st-field">
                  <label className="st-lbl" htmlFor="sn">전송자 명칭</label>
                  <input id="sn" className="st-fld" value={send.name} onChange={(e) => { setSend({ ...send, name: e.target.value }); touch(); }} />
                </div>
                <div className="st-field">
                  <label className="st-lbl" htmlFor="st">전송자 연락처</label>
                  <input id="st" className="st-fld num" value={send.tel} onChange={(e) => { setSend({ ...send, tel: e.target.value }); touch(); }} />
                </div>
                <div className="st-field">
                  <label className="st-lbl" htmlFor="ad">광고 표기</label>
                  <input id="ad" className="st-fld" value="(광고)" readOnly />
                </div>
                <div className="st-field">
                  <label className="st-lbl" htmlFor="rj">수신 거부 문구</label>
                  <input id="rj" className="st-fld" value="무료 수신 거부" readOnly />
                </div>
              </div>
              <p className="st-meta">(광고)와 무료 수신 거부 문구는 광고 메시지에 자동으로 들어가요. 수정할 수 없어요.</p>
              <div className="st-grid">
                <div className="st-field">
                  <label className="st-lbl" htmlFor="lim">매장 일 발송 한도(건)</label>
                  <input id="lim" type="number" className="st-fld num" value={send.limit} onChange={(e) => { setSend({ ...send, limit: Number(e.target.value) }); touch(); }} />
                </div>
                <div className="st-field">
                  <label className="st-lbl" htmlFor="ctl">대조군 기본 비율(%)</label>
                  <input id="ctl" type="number" className="st-fld num" value={send.control} onChange={(e) => { setSend({ ...send, control: Number(e.target.value) }); touch(); }} />
                </div>
              </div>
              <div className="st-note">
                야간(21시~다음 날 08시)에는 광고 메시지를 보낼 수 없어요. 수신 동의는 2년마다 재확인해야 하며, 재확인 시기가 된 고객은 안내해 드려요.
              </div>
            </section>

            {/* 6. 개인정보 */}
            <section id="st-privacy" className="st-card">
              <h2>개인정보 보관 기간</h2>
              <div className="st-grid" style={{ alignItems: 'flex-end' }}>
                <div className="st-field" style={{ flex: '0 0 240px' }}>
                  <label className="st-lbl" htmlFor="keep">마지막 방문 후 보관 기간</label>
                  <select id="keep" className="st-fld" value={keep} onChange={(e) => { setKeep(Number(e.target.value)); touch(); }}>
                    {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>{y}년{y === 3 ? ' (기본)' : ''}</option>)}
                  </select>
                </div>
                <p className="st-meta" style={{ flex: '1 1 260px' }}>
                  마지막 방문이 {expireYear}년 11월 이전인 고객이 파기 대상으로 표시돼요. 파기 대상 <b className="num">12명</b> (예시)
                </p>
              </div>
              <p className="st-meta">파기 대상은 자동으로 지워지지 않아요. 원장이 목록을 확인한 뒤 삭제를 승인해야 삭제돼요. 고객 정보 접근 로그는 2년간 보관해요.</p>
            </section>

            <div className="st-savebar">
              <button type="button" className="st-btn p" disabled={!dirty} onClick={saveAll}>변경사항 저장</button>
            </div>
            <p className="st-meta">시연용 화면이며 실제 발송·권한 정책은 운영 환경 연동 후 적용돼요.</p>
          </div>
        </PinGate>
      </main>
    </div>
  );
}
