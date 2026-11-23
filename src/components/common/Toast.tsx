import { useEffect, useState } from 'react';

// 전역 토스트: 어느 화면에서든 toast('저장했어요') / toast('겹쳐요', 'warn') 로 호출합니다.
// 실제로 끝난 작업에만 호출하세요(가짜 완료 메시지 금지).
export type ToastKind = 'success' | 'warn' | 'error';
type Item = { id: number; msg: string; kind: ToastKind; leaving: boolean };

let push: ((msg: string, kind: ToastKind) => void) | null = null;
let seq = 0;

export function toast(msg: string, kind: ToastKind = 'success') {
  push?.(msg, kind);
}

const ICON: Record<ToastKind, string> = { success: '✓', warn: '!', error: '×' };
const LIFE = 3600;

export function ToastHost() {
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    push = (msg, kind) => {
      const id = ++seq;
      setList((l) => [...l.slice(-2), { id, msg, kind, leaving: false }]);
      setTimeout(() => setList((l) => l.map((t) => (t.id === id ? { ...t, leaving: true } : t))), LIFE);
      setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), LIFE + 220);
    };
    return () => {
      push = null;
    };
  }, []);

  return (
    <div className="kp-toasts" role="status" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className={`kp-toast ${t.kind}${t.leaving ? ' out' : ''}`}>
          <span className="kp-toast-i" aria-hidden="true">
            {ICON[t.kind]}
          </span>
          <span>{t.msg}</span>
          <button
            type="button"
            className="kp-toast-x"
            aria-label="알림 닫기"
            onClick={() => setList((l) => l.filter((x) => x.id !== t.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
