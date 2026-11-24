import { useState, type ReactNode } from 'react';

// 기획서 8장: 잠긴 기능(캠페인·성과·설정 등)은 허용된 스탭이 PIN을 다시 입력해야 열립니다.
// 시연용: PIN은 1234, 한 번 열면 이 브라우저 탭이 닫힐 때까지 유지됩니다(sessionStorage).
const DEMO_PIN = '1234';

function readUnlocked(id: string): boolean {
  try {
    return sessionStorage.getItem('keepsy-pin-' + id) === '1';
  } catch {
    return false;
  }
}

export function PinGate(props: { id: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(() => readUnlocked(props.id));
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);

  if (open) return <>{props.children}</>;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === DEMO_PIN) {
      try {
        sessionStorage.setItem('keepsy-pin-' + props.id, '1');
      } catch {
        /* 저장 실패해도 이번 화면은 열립니다 */
      }
      setOpen(true);
    } else {
      setErr(true);
      setPin('');
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '72px 24px', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <form
        onSubmit={submit}
        style={{
          width: '360px',
          maxWidth: '100%',
          boxSizing: 'border-box',
          padding: '32px 28px',
          borderRadius: '24px',
          background: '#FFFFFF',
          border: '1px solid #F1E4E0',
          boxShadow: '0 6px 22px rgba(160,90,90,.08)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ fontSize: '28px', lineHeight: 1 }} aria-hidden="true">🔒</div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#221D1B' }}>{props.title}</h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#6B605B', lineHeight: 1.6 }}>
          잠긴 기능입니다. 사용이 허용된 스탭의 PIN을 입력해 주세요.
        </p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ''));
            setErr(false);
          }}
          aria-label="PIN"
          placeholder="PIN"
          style={{
            height: '46px',
            borderRadius: '12px',
            border: `1px solid ${err ? '#C98B8B' : '#EBD9D5'}`,
            textAlign: 'center',
            fontSize: '18px',
            letterSpacing: '.3em',
            outline: 0,
          }}
        />
        {err && <span style={{ fontSize: '12px', color: '#8F2F2F' }}>PIN이 맞지 않아요. 다시 입력해 주세요.</span>}
        <button
          type="submit"
          style={{ height: '46px', border: 0, borderRadius: '12px', background: '#7A4450', color: '#fff', font: "500 14px 'Noto Sans KR', sans-serif", cursor: 'pointer' }}
        >
          열기
        </button>
        <span style={{ fontSize: '11.5px', color: '#6B605B' }}>시연용 PIN: 1234</span>
      </form>
    </div>
  );
}
