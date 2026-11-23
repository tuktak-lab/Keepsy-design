import { useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import { Avatar } from '@/components/common/Avatar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import styleText from './CustomersPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

const SEG: Record<string, [string, string]> = {
  예정: ['#F3EEEE', '#5B5552'],
  '주기 도래': ['#F9EBE8', '#85505A'],
  '이탈 신호': ['#F6DFDF', '#8F2F2F'],
  '장기 미방문': ['#ECE5E1', '#5B5552'],
};

const R = [
  { id: 'c1', name: '김민지', phone: '010-****-4821', visits: 8, last: '2026.10.24', paid: '472,000원', cats: ['네일'], seg: '예정', pred: '11.21 예약 확정', mk: true },
  { id: 'c2', name: '이윤서', phone: '010-****-9925', visits: 0, last: '첫 방문 예정', paid: '0원', cats: ['네일'], seg: '예정', pred: '11.21 첫 상담 예약', mk: false },
  { id: 'c3', name: '최유진', phone: '010-****-6140', visits: 6, last: '2026.10.17', paid: '358,000원', cats: ['네일', '속눈썹'], seg: '주기 도래', pred: '예측 11.20~11.27 (평균 주기 기준)', mk: true },
  { id: 'c4', name: '정하린', phone: '010-****-2506', visits: 3, last: '2026.09.12', paid: '186,000원', cats: ['네일'], seg: '이탈 신호', pred: '예측 종료 11.01 · 22일 경과', mk: false },
  { id: 'c5', name: '한예린', phone: '010-****-3719', visits: 4, last: '2026.10.21', paid: '242,000원', cats: ['네일', '왁싱'], seg: '주기 도래', pred: '11.15~11.22 (시술 평균 주기 기준)', mk: true },
  { id: 'c6', name: '오서현', phone: '010-****-8236', visits: 2, last: '2026.10.08', paid: '112,000원', cats: ['속눈썹'], seg: '이탈 신호', pred: '예측 종료 11.10 · 13일 경과', mk: true },
  { id: 'c7', name: '윤다혜', phone: '010-****-1175', visits: 9, last: '2026.07.24', paid: '684,000원', cats: ['네일', '반영구'], seg: '장기 미방문', pred: '마지막 방문 122일 전', mk: false },
  { id: 'c8', name: '박소율', phone: '010-****-7702', visits: 1, last: '2026.11.10', paid: '45,000원', cats: ['왁싱'], seg: '예정', pred: '12.08~12.22 (시술 평균 주기 기준)', mk: true },
];

export default function CustomersPage() {
  useStyleSheet('CustomersPage', styleText);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('전체');
  const [seg, setSeg] = useState('전체');
  const [vis, setVis] = useState('전체');
  const [sel, setSel] = useState('c1');

  const rows = R.filter((r) => {
    if (q && !(r.name.includes(q) || r.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '') || '§'))) return false;
    if (cat !== '전체' && !r.cats.includes(cat)) return false;
    if (seg !== '전체' && r.seg !== seg) return false;
    if (vis === '첫 방문 전' && r.visits !== 0) return false;
    if (vis === '1~2회' && !(r.visits >= 1 && r.visits <= 2)) return false;
    if (vis === '3~5회' && !(r.visits >= 3 && r.visits <= 5)) return false;
    if (vis === '6회 이상' && r.visits < 6) return false;
    return true;
  });
  const cur = R.find((r) => r.id === sel) || R[0];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '1020px' }}>
      <div style={{ flex: '0 0 232px', background: '#F4EBE6' }}>
        <Sidebar active="customers" />
      </div>
      <main style={{ flex: '999 1 640px', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
        <Topbar crumb="Customer Intelligence / 고객 목록" />
        <div className="wrap">
          <div className="row between" style={{ alignItems: 'flex-end' }}>
            <div className="col" style={{ gap: '6px' }}>
              <h1 className="h1">고객 목록</h1>
              <p className="sub">방문 횟수와 시술 카테고리별 예측 상태로 다시 만날 고객을 찾아보세요.</p>
            </div>
            <button type="button" className="btn btn-p">+ 고객 등록</button>
          </div>

          <div className="row" style={{ gap: '8px' }}>
            <input
              type="search"
              className="fld"
              style={{ flex: '1 1 260px', width: 'auto' }}
              placeholder="이름 또는 연락처 검색"
              aria-label="고객 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="sel" aria-label="시술 카테고리" value={cat} onChange={(e) => setCat(e.target.value)}>
              {['전체', '네일', '속눈썹', '왁싱', '반영구'].map((c) => (
                <option key={c} value={c}>{c === '전체' ? '시술 카테고리 전체' : c}</option>
              ))}
            </select>
            <select className="sel" aria-label="예측 상태" value={seg} onChange={(e) => setSeg(e.target.value)}>
              {['전체', '예정', '주기 도래', '이탈 신호', '장기 미방문'].map((c) => (
                <option key={c} value={c}>{c === '전체' ? '예측 상태 전체' : c}</option>
              ))}
            </select>
            <select className="sel" aria-label="방문 횟수" value={vis} onChange={(e) => setVis(e.target.value)}>
              {['전체', '첫 방문 전', '1~2회', '3~5회', '6회 이상'].map((c) => (
                <option key={c} value={c}>{c === '전체' ? '방문 횟수 전체' : '방문 ' + c}</option>
              ))}
            </select>
          </div>

          <section className="card" style={{ padding: '10px 0 6px', overflowX: 'auto' }}>
            <div className="crow head">
              <span>고객</span>
              <span>총 방문</span>
              <span>최근 방문 · 결제</span>
              <span>시술 카테고리</span>
              <span>예측 상태</span>
            </div>
            {rows.map((r) => (
              <div className={'crow' + (r.id === sel ? ' on' : '')} key={r.id}>
                <button type="button" className="pick" onClick={() => setSel(r.id)} aria-pressed={r.id === sel}>
                  <Avatar who={r.name} size="36" />
                  <span className="col">
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{r.name}</span>
                    <span className="meta num">{r.phone}</span>
                  </span>
                </button>
                <span className="num" style={{ fontWeight: 600 }}>{r.visits}회</span>
                <span className="col">
                  <span className="num">{r.last}</span>
                  <span className="meta num">{r.paid}</span>
                </span>
                <span className="meta">{r.cats.join(' · ')}</span>
                <span className="col" style={{ alignItems: 'flex-start', gap: '2px' }}>
                  <span className="chip" style={{ background: SEG[r.seg][0], color: SEG[r.seg][1] }}><i></i>{r.seg}</span>
                  <span className="meta">{r.pred}</span>
                </span>
              </div>
            ))}
            {rows.length === 0 ? <p className="sub" style={{ padding: '28px 24px' }}>조건에 맞는 고객이 없어요.</p> : null}
            <div className="meta" style={{ padding: '10px 18px 8px', borderTop: '1px solid #F1E4E0' }}>
              전체 248명 중 {rows.length}명 표시
            </div>
          </section>

          <section className="card row between">
            <div className="row" style={{ gap: '14px' }}>
              <Avatar who={cur.name} size="48" />
              <div className="col">
                <strong style={{ fontSize: '17px' }}>{cur.name}</strong>
                <span className="sub">총 방문 {cur.visits}회 · {cur.cats.join(' · ')} · 마케팅 수신 {cur.mk ? '동의' : '미동의'}</span>
              </div>
            </div>
            <div className="row" style={{ gap: '8px' }}>
              <AppLink href="/customers/detail" className="btn">고객 상세</AppLink>
              <AppLink href="/history" className="btn btn-p">시술 히스토리북</AppLink>
            </div>
          </section>
          <p className="meta">
            예측 상태는 고객 × 시술 카테고리별 방문 주기로 계산하며, 목록에는 가장 임박한 상태를 표시해요. 다음 예약이 있는 고객은 &quot;예정&quot;으로 표시해요.
          </p>
        </div>
      </main>
    </div>
  );
}
