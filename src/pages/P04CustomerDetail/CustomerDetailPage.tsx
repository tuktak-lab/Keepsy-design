import { useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { Avatar } from '@/components/common/Avatar';
import { Photo } from '@/components/common/Photo';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styleText from './CustomerDetailPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

const TABS: [string, string][] = [
  ['summary', '고객 요약'],
  ['history', '시술 히스토리'],
  ['memo', '상담 메모'],
  ['activity', '관리 활동'],
];

const CATS = [
  { name: '네일', visits: 6, menus: '젤네일 6회, 젤 제거 3회', avg: 24 },
  { name: '속눈썹', visits: 2, menus: '속눈썹 연장 2회', avg: 38 },
];

const PRED = [
  {
    cat: '네일',
    chip: ['예정', '#F3EEEE', '#5B5552'],
    when: '약 3~4주 후 (평균 24일, 방문 6회)',
    range: '예측 11.14 ~ 11.21',
    note: '11.28 14:00 예약이 있어 재방문 안내 대상에서 제외돼요.',
  },
  {
    cat: '속눈썹',
    chip: ['주기 도래', '#F9EBE8', '#85505A'],
    when: '약 5~6주 후 (시술 평균 주기 기준)',
    range: '예측 11.04 ~ 11.11 · 12일 경과',
    note: '방문 2회라 시술 평균 주기로 예측했어요. 예약이 없어요.',
  },
];

const H = [
  { date: '10.24', treat: '클린 프렌치', cat: '네일', k: 'french', staff: '서연', price: '55,000원', note: '얇은 프렌치 라인 · 짧은 길이 · 케어는 자극을 최소화했어요.', bg: '#E9E4DD' },
  { date: '09.30', treat: '딥 플럼 글로시', cat: '네일', k: 'gloss', staff: '서연', price: '58,000원', note: '젤 제거 후 시술 · 짙은 컬러는 처음이었고 만족도가 높았어요.', bg: '#D9C9CD' },
  { date: '09.28', treat: '속눈썹 연장 C컬', cat: '속눈썹', k: 'milky', staff: '지아', price: '62,000원', note: '자연스러운 길이로 시술했어요.', bg: '#EBDDDA' },
  { date: '09.06', treat: '밀키 핑크 아트', cat: '네일', k: 'milky', staff: '서연', price: '59,000원', note: '작은 진주 포인트 · 다음에도 포인트는 작게 원해요.', bg: '#EBDDDA' },
];

const RHYTHM = [
  { d: '06.26', c: '네일' }, { d: '07.20', c: '네일' }, { d: '08.13', c: '네일' }, { d: '08.21', c: '속눈썹' },
  { d: '09.06', c: '네일' }, { d: '09.28', c: '속눈썹' }, { d: '09.30', c: '네일' }, { d: '10.24', c: '네일' },
];

const consentBox = { padding: '2px 0' } as const;

export default function CustomerDetailPage() {
  useStyleSheet('CustomerDetailPage', styleText);
  const [tab, setTab] = useState('summary');
  const [photoOk, setPhotoOk] = useState(true);
  const [healthOk, setHealthOk] = useState(true);

  const fmt = (ok: boolean, d: string) => (ok ? `동의 ${d}` : '미동의');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1280px' }}>
      <div style={{ flex: '0 0 232px', background: '#F4EBE6' }}>
        <Sidebar active="customers" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="Customer Intelligence / 고객 목록 / 김민지" />
        <div className="wrap">
          <div className="row between">
            <AppLink href="/customers" className="meta">‹ 고객 목록</AppLink>
            <div className="row" style={{ gap: '8px' }}>
              <button type="button" className="btn">고객 정보 수정</button>
              <AppLink href="/history" className="btn btn-p">시술 히스토리북</AppLink>
            </div>
          </div>

          <section className="card row" style={{ gap: '18px' }}>
            <Avatar who="김민지" size="72" />
            <div className="col" style={{ gap: '3px' }}>
              <div className="row" style={{ gap: '10px' }}>
                <h1 className="h1" style={{ fontSize: '24px' }}>김민지</h1>
                <span className="chip" style={{ background: '#F9EBE8', color: '#85505A' }}><i></i>주기 도래</span>
              </div>
              <span className="sub num">010-****-4821 · <span className="meta">🔒 전체 번호 보기는 PIN 확인 후 가능해요</span></span>
              <span className="meta">고객 코드 NM-C0248</span>
            </div>
          </section>

          <div className="tabs" role="tablist" aria-label="고객 상세">
            {TABS.map(([id, label]) => (
              <button type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} key={id}>{label}</button>
            ))}
          </div>

          {tab === 'summary' ? (
            <>
              <section className="card col" style={{ gap: '14px' }}>
                <h2 className="h2">방문 요약</h2>
                <div className="row" style={{ gap: 0 }}>
                  <div className="stat"><span className="meta">총 방문</span><b>8회</b></div>
                  <div className="stat"><span className="meta">시술</span><b>11건</b></div>
                  <div className="stat"><span className="meta">첫 방문</span><b>06.26</b></div>
                  <div className="stat"><span className="meta">마지막 방문</span><b>10.24</b></div>
                  <div className="stat"><span className="meta">누적 결제</span><b>472,000원</b></div>
                </div>
                <div className="col">
                  {CATS.map((c) => (
                    <div className="consent" key={c.name} style={{ justifyContent: 'flex-start', flexWrap: 'wrap', gap: '8px 14px' }}>
                      <strong>{c.name} 방문 {c.visits}회</strong>
                      <span className="meta">│</span>
                      <span>{c.menus}</span>
                      <span className="meta">│</span>
                      <span className="num">평균 간격 {c.avg}일</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="col" style={{ gap: '12px' }}>
                <h2 className="h2">시술별 예측 상태</h2>
                <div className="cgrid">
                  {PRED.map((p) => (
                    <div className="pcard" key={p.cat}>
                      <div className="row between">
                        <strong>{p.cat}</strong>
                        <span className="chip" style={{ background: p.chip[1], color: p.chip[2] }}><i></i>{p.chip[0]}</span>
                      </div>
                      <span style={{ fontWeight: 500 }}>{p.when}</span>
                      <span className="num" style={{ color: '#85505A', fontSize: '13px' }}>{p.range}</span>
                      <span className="meta">{p.note}</span>
                    </div>
                  ))}
                </div>
                <p className="meta">예측은 고객 × 시술 카테고리별로 따로 계산해요. 방문이 1~2회면 시술 평균 주기를 기준으로 해요.</p>
              </section>

              <section className="card col" style={{ gap: '14px' }}>
                <div className="row between">
                  <h2 className="h2">방문 리듬</h2>
                  <span className="meta">네일 평균 24일 · 속눈썹 평균 38일</span>
                </div>
                <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '4px' }}>
                  {RHYTHM.map((r, i) => (
                    <div key={i} className="col" style={{ alignItems: 'center', minWidth: '78px', gap: '6px', position: 'relative' }}>
                      <span style={{ width: '100%', height: '2px', background: i === 0 ? 'transparent' : '#E3D5CE', position: 'absolute', top: '5px', left: '-50%' }}></span>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: r.c === '네일' ? '#85505A' : '#D9AFA6', position: 'relative' }}></span>
                      <span className="num" style={{ fontSize: '12.5px', fontWeight: 600 }}>{r.d}</span>
                      <span className="meta">{r.c}</span>
                    </div>
                  ))}
                  <div className="col" style={{ alignItems: 'center', minWidth: '78px', gap: '6px', position: 'relative' }}>
                    <span style={{ width: '100%', borderTop: '2px dashed #85505A', position: 'absolute', top: '5px', left: '-50%' }}></span>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid #85505A', background: '#fff', boxSizing: 'border-box', position: 'relative' }}></span>
                    <span className="num" style={{ fontSize: '12.5px', fontWeight: 600, color: '#85505A' }}>11.28</span>
                    <span className="meta">예약</span>
                  </div>
                </div>
              </section>

              <div className="grid2">
                <section className="card col" style={{ gap: '12px' }}>
                  <h2 className="h2">취향 프로필</h2>
                  <div className="row" style={{ gap: '6px' }}>
                    {['미니멀', '펄', '짧은 길이', '자연스러운 C컬'].map((t) => (
                      <span className="chip" style={{ background: '#F9EBE8', color: '#85505A' }} key={t}>{t}</span>
                    ))}
                  </div>
                  <dl style={{ display: 'grid', gridTemplateColumns: '78px 1fr', gap: '8px', fontSize: '13px' }}>
                    <dt className="meta">선호 컬러</dt>
                    <dd className="row" style={{ gap: '12px' }}>
                      {[['밀키 핑크', '#EFD3D3'], ['누드', '#E8CDB8'], ['딥 플럼', '#6E2B3E']].map(([n, c]) => (
                        <span className="row" style={{ gap: '6px' }} key={n}>
                          <span style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid #EBD9D5' }}></span>{n}
                        </span>
                      ))}
                    </dd>
                    <dt className="meta">선호 디자인</dt><dd>미니멀 · 프렌치 · 펄</dd>
                    <dt className="meta">상담 포인트</dt><dd>짧은 길이 · 얇은 라인</dd>
                  </dl>
                </section>

                <section className="card col" style={{ gap: '10px' }}>
                  <h2 className="h2">주의사항</h2>
                  <div className="pcard">
                    <strong style={{ fontSize: '13px' }}>시술 주의사항</strong>
                    <span style={{ fontSize: '13px' }}>손톱 주변 피부가 자극에 민감해요. 케어는 최소화하고 길이는 짧게 유지해 주세요.</span>
                  </div>
                  <div className="pcard">
                    <strong style={{ fontSize: '13px' }}>건강 주의사항</strong>
                    {healthOk ? (
                      <span style={{ fontSize: '13px' }}>아세톤 접촉 시 피부 건조 · 속눈썹 글루 알레르기 이력 없음</span>
                    ) : (
                      <span className="meta">건강 정보 동의가 철회되어 이 칸의 내용은 삭제됐어요. 동의를 다시 받아야 입력할 수 있어요.</span>
                    )}
                  </div>
                  <p className="meta">건강 주의사항은 건강 정보에 동의한 고객만 입력할 수 있어요. 철회하면 그 칸만 삭제돼요.</p>
                </section>
              </div>

              <section className="card col" style={{ gap: '12px' }}>
                <div className="row between">
                  <h2 className="h2">시술 사진</h2>
                  <span className="meta">{photoOk ? '사진 동의 확인 · 비공개 저장' : '사진 동의 철회됨'}</span>
                </div>
                {photoOk ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(170px,100%),1fr))', gap: '12px' }}>
                    {H.slice(0, 3).map((h) => (
                      <figure key={h.date} style={{ margin: 0 }} className="col">
                        <div style={{ height: 150, overflow: 'hidden', borderRadius: 16 }}><Photo kind={h.k} h="150" bg={h.bg} /></div>
                        <figcaption className="meta num" style={{ paddingTop: 6 }}>{h.date} {h.treat}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p className="sub">사진 동의 철회로 저장된 시술 사진이 모두 삭제됐어요.</p>
                )}
              </section>

              <section className="card col" style={{ gap: '4px' }}>
                <div className="row between" style={{ paddingBottom: 6 }}>
                  <h2 className="h2">상담 메모</h2>
                  <button type="button" className="lk" onClick={() => setTab('memo')}>+ 메모 추가</button>
                </div>
                <div className="consent col"><span className="meta num">11.17 · 서연</span><span>손톱 주변 피부가 자극에 민감해요. 케어는 최소화해 주세요.</span></div>
                <div className="consent col"><span className="meta num">10.24 · 서연</span><span>프렌치 라인을 얇게 선호해요. 다음엔 작은 진주 포인트를 해보고 싶어 하세요.</span></div>
              </section>

              <section className="card col" style={{ gap: '4px' }}>
                <h2 className="h2" style={{ paddingBottom: 6 }}>동의 항목</h2>
                <span className="meta" style={{ fontWeight: 600 }}>필수</span>
                <div className="consent"><span>연락처 수집·이용</span><span className="num">동의 2026.06.26 14:02</span></div>
                <div className="consent"><span>방문 기록 수집·이용</span><span className="num">동의 2026.06.26 14:02</span></div>
                <span className="meta" style={{ fontWeight: 600, paddingTop: 8 }}>선택</span>
                <div className="consent">
                  <span>시술 사진</span>
                  <span className="row" style={{ gap: 10 }}>
                    <span className="num">{fmt(photoOk, '2026.06.26 14:03')}</span>
                    {photoOk ? <button type="button" className="lk" onClick={() => setPhotoOk(false)}>철회</button> : <button type="button" className="lk" onClick={() => setPhotoOk(true)}>다시 동의 받기</button>}
                  </span>
                </div>
                <div className="consent"><span>마케팅 수신</span><span className="num">동의 2026.06.26 14:03</span></div>
                <div className="consent"><span>야간 광고 수신</span><span className="num">미동의</span></div>
                <div className="consent">
                  <span>건강 정보</span>
                  <span className="row" style={{ gap: 10 }}>
                    <span className="num">{fmt(healthOk, '2026.09.28 11:20')}</span>
                    {healthOk ? <button type="button" className="lk" onClick={() => setHealthOk(false)}>철회</button> : <button type="button" className="lk" onClick={() => setHealthOk(true)}>다시 동의 받기</button>}
                  </span>
                </div>
                <p className="meta" style={{ ...consentBox }}>사진 동의를 철회하면 저장된 사진이, 건강 정보 동의를 철회하면 건강 주의사항 칸만 즉시 삭제돼요.</p>
              </section>
            </>
          ) : null}

          {tab === 'history' ? (
            <section className="card col">
              <div className="row between" style={{ paddingBottom: 8 }}>
                <h2 className="h2">시술 히스토리 · 방문 8회</h2>
                <AppLink href="/history" style={{ fontSize: 13, fontWeight: 500 }}>시술 히스토리북에서 기록 추가 →</AppLink>
              </div>
              {H.map((h) => (
                <div className="trow" key={h.date + h.treat}>
                  <strong className="num">2026.{h.date}</strong>
                  <span className="col">
                    <strong style={{ fontSize: 14.5 }}>{h.treat} <span className="meta" style={{ fontWeight: 400 }}>· {h.cat}</span></strong>
                    <span className="sub">{h.note}</span>
                  </span>
                  <span className="meta num" style={{ textAlign: 'right' }}>{h.staff}<br />{h.price}</span>
                </div>
              ))}
            </section>
          ) : null}

          {tab === 'memo' ? (
            <section className="card col" style={{ gap: 12, maxWidth: 720 }}>
              <h2 className="h2">상담 메모</h2>
              <label className="col" style={{ gap: 6 }}>
                <span className="lbl">새 메모</span>
                <textarea className="fld" rows={3} placeholder="상담 내용과 다음에 해보고 싶은 디자인을 남겨 주세요." />
              </label>
              <div><button type="button" className="btn btn-p">메모 저장</button></div>
              <div className="consent col"><span className="meta num">11.17 · 서연</span><span>손톱 주변 피부가 자극에 민감해요. 케어는 최소화해 주세요.</span></div>
              <div className="consent col"><span className="meta num">10.24 · 서연</span><span>프렌치 라인을 얇게 선호해요. 다음엔 작은 진주 포인트를 해보고 싶어 하세요.</span></div>
              <p className="meta">건강 관련 내용은 시술·건강 주의사항 칸에 구분해 적어 주세요.</p>
            </section>
          ) : null}

          {tab === 'activity' ? (
            <section className="card col" style={{ maxWidth: 720 }}>
              <h2 className="h2" style={{ paddingBottom: 8 }}>관리 활동</h2>
              {[
                ['11.14', '예약 생성 · 11.28 14:00', '가을 컬러 리마인드의 예약 링크로 예약했어요.'],
                ['11.13 12:11', '예약 링크 클릭', '메시지 도달 71분 뒤'],
                ['11.13 11:00', '문자 메시지 도달', '캠페인: 가을 컬러 리마인드'],
                ['10.24', '시술 완료 · 기록 저장', '클린 프렌치 · 55,000원'],
              ].map(([w, t, s]) => (
                <div className="trow" key={w} style={{ gridTemplateColumns: '96px 1fr' }}>
                  <span className="meta num">{w}</span>
                  <span className="col"><strong>{t}</strong><span className="sub">{s}</span></span>
                </div>
              ))}
            </section>
          ) : null}
          <p className="meta">시연용 고객 · 이미지예요. 동의를 받은 항목만 저장하고, 연락처는 기본으로 가려서 보여줘요.</p>
        </div>
      </main>
    </div>
  );
}
