import { Avatar } from '@/components/common/Avatar';
import { Photo } from '@/components/common/Photo';
import logo from '@/assets/images/keepsy-logo-thin.png';
import styleText from './DesignSystemPage.css?inline';
import { useStyleSheet } from '@/hooks/useStyleSheet';

export default function DesignSystemPage() {
  useStyleSheet('DesignSystemPage', styleText);

  function renderVals(): any {
    const P = (name, items) => ({
      name,
      items: items.map(([n, hex, use]: any) => ({
        name: n,
        hex,
        use,
      })),
    });
    const palettes = [
      P('중립 · 글자와 선', [
        ['Ink', '#1F1B1A', '제목, 본문, 숫자'],
        ['Text 2', '#5B5552', '보조 설명'],
        ['Meta', '#77706C', '날짜, 표 헤더'],
        ['Line strong', '#EBD9D5', '버튼·입력 테두리'],
        ['Line', '#F1E4E0', '카드 테두리·영역 구분'],
        ['Line soft', '#F6EDEA', '표 행 구분'],
        ['Surface', '#FCF7F5', '본문 배경(흰색→옅은 핑크)'],
        ['Sidebar', '#F4EBE6', '내비게이션(베이지)'],
      ]),
      P('포인트 · Berry', [
        ['Berry', '#85505A', '주요 버튼, 활성 탭'],
        ['Berry dark', '#6D434B', 'Hover'],
        ['Rose', '#C99AA1', '데이터 보조'],
        ['Berry tint', '#F8F1F2', '선택된 행'],
        ['Select', '#F3E5E7', '선택 버튼'],
      ]),
      P('상태', [
        ['예정', '#5B5552', 'bg #F3EEEE'],
        ['주기 도래', '#6B4509', 'bg #F5EBD3'],
        ['이탈 신호', '#8F2F2F', 'bg #F8E3E1'],
        ['장기 미방문', '#5B5552', 'bg #ECE5E1'],
        ['예약 확정', '#2F3F55', 'bg #E1E6EE'],
        ['재방문 완료', '#85505A', '데이터 결과'],
      ]),
    ];
    const T: any = [
      ['화면 제목', '고객 목록', 26, 700, '-0.03em', '#1F1B1A'],
      ['큰 숫자', '486,000원', 30, 500, '-0.025em', '#1F1B1A'],
      ['강조 헤드라인', '28일의 리듬, 7일의 공백', 20, 700, '-0.025em', '#1F1B1A'],
      ['섹션 제목', '지금 관리가 필요한 고객', 15.5, 700, '-0.02em', '#1F1B1A'],
      ['이름 · 행 제목', '김민지', 14, 600, '-0.01em', '#1F1B1A'],
      ['본문', '짧은 길이와 자연스러운 핑크를 선호해요.', 13.5, 400, '-0.01em', '#1F1B1A'],
      ['보조 설명', '35일 경과 / 평균 28일 / 예정 예약 없음', 13, 400, '-0.01em', '#5B5552'],
      ['메타', '11.21 14:00 · 서연', 12, 400, '-0.01em', '#77706C'],
      ['표 헤더', '재방문 예상 / 예약', 12, 500, '-0.01em', '#77706C'],
    ];
    const types = T.map(([role, sample, size, w, ls, c]: any) => ({
      role,
      sample,
      size,
      w,
      ls,
      c,
      spec: `${size}px / ${w} / ${ls}`,
    }));
    const radii = [
      {
        v: '2px',
        use: '시술 사진',
        w: 64,
        h: 44,
        r: '2px',
      },
      {
        v: '4px',
        use: '칩, 면, 메뉴',
        w: 64,
        h: 44,
        r: '4px',
      },
      {
        v: '6px',
        use: '버튼, 입력',
        w: 64,
        h: 44,
        r: '6px',
      },
      {
        v: '11px',
        use: '토글',
        w: 40,
        h: 22,
        r: '11px',
      },
      {
        v: '50%',
        use: '아바타, 상태 점',
        w: 44,
        h: 44,
        r: '50%',
      },
    ];
    const chips = [
      {
        label: '예정',
        bg: '#F3EEEE',
        fg: '#5B5552',
      },
      {
        label: '주기 도래',
        bg: '#F5EBD3',
        fg: '#6B4509',
      },
      {
        label: '장기 미방문',
        bg: '#ECE5E1',
        fg: '#5B5552',
      },
      {
        label: '이탈 신호',
        bg: '#F8E3E1',
        fg: '#8F2F2F',
      },
      {
        label: '예약 확정',
        bg: '#E1E6EE',
        fg: '#2F3F55',
      },
      {
        label: '검토 대기',
        bg: '#F5EBD3',
        fg: '#6B4509',
      },
      {
        label: '발송 완료',
        bg: '#F3E5E7',
        fg: '#6D434B',
      },
    ];
    const blocks = [
      {
        name: '정하린',
        label: '시그니처 펄 · 완료',
        bg: '#F3E5E7',
        fg: '#6D434B',
        bar: '#85505A',
      },
      {
        name: '이윤서',
        label: '딥 플럼 · 확정',
        bg: '#E1E6EE',
        fg: '#2F3F55',
        bar: '#5A6B85',
      },
      {
        name: '박지은',
        label: '클린 프렌치 · 진행 중',
        bg: '#4A403C',
        fg: '#FFFFFF',
        bar: '#4A403C',
      },
      {
        name: '김민지',
        label: '시그니처 펄 · 선택',
        bg: '#85505A',
        fg: '#FFFFFF',
        bar: '#6E2A38',
      },
    ];
    const rows = [
      {
        name: '김민지',
        phone: '010-****-4821',
        last: '2026.10.24',
        seg: '예정',
        cbg: '#F3EEEE',
        cfg: '#5B5552',
        next: '11.21 14:00',
        bg: '#F8F1F2',
      },
      {
        name: '정하린',
        phone: '010-****-2506',
        last: '2026.09.12',
        seg: '이탈 신호',
        cbg: '#F8E3E1',
        cfg: '#8F2F2F',
        next: '10.17 예상',
        bg: 'transparent',
      },
    ];
    const bars = [
      {
        label: '링크 클릭',
        n: 21,
        w: 43.8,
        c: '#C99AA1',
      },
      {
        label: '재예약',
        n: 10,
        w: 20.8,
        c: '#85505A',
      },
      {
        label: '실제 재방문',
        n: 8,
        w: 16.7,
        c: '#85505A',
      },
    ];
    const nav = [
      { label: '대시보드', bg: 'transparent', fg: '#5A4F4B', w: 400 },
      { label: '고객 목록', bg: '#FFFDFB', fg: '#2F2826', w: 600 },
      { label: '예약 관리', bg: 'transparent', fg: '#5A4F4B', w: 400 },
      { label: '인사이트', bg: 'transparent', fg: '#5A4F4B', w: 400 },
    ];
    const photos = [
      {
        k: 'milky',
        n: '밀키 핑크 · 펄',
      },
      {
        k: 'hero',
        n: '시그니처 펄',
      },
      {
        k: 'gloss',
        n: '딥 플럼 글로시',
      },
      {
        k: 'french',
        n: '클린 프렌치',
      },
    ];
    return {
      palettes,
      types,
      radii,
      chips,
      blocks,
      rows,
      bars,
      nav,
      photos,
    };
  }
  const v = renderVals();

  return (
    <div style={{ padding: '48px 56px 64px', boxSizing: 'border-box', maxWidth: '1440px' }}>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          paddingBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {' '}
          <span className="meta" style={{ fontWeight: '600', letterSpacing: '.04em' }}>
            <img src={logo} alt="Keepsy" style={{ height: '18px', width: 'auto', verticalAlign: '-3px', marginRight: '6px' }} />· SMART BEAUTY CRM
          </span>{' '}
          <h1 style={{ fontSize: '30px', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.25' }}>
            관리자 디자인 시스템
          </h1>
          <p className="sub">
            9개 관리자 화면에서 실제로 쓰는 값만 모았습니다. 선과 표로 나누고, 색은 의미가 있을 때만 씁니다.
          </p>
        </div>{' '}
        <span className="meta num">v1.0 · 2026.11 · Noto Sans KR</span>{' '}
      </header>
      <section className="sec">
        <div className="sec-h">
          <b>01</b>
          <h2>컬러</h2>
          <p className="meta">중립색이 화면의 대부분을 맡고, 베리는 주요 행동과 선택 상태에만 씁니다.</p>
        </div>
        <div className="sec-b">
          {v.palettes.map((g, i0) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} key={i0}>
              {' '}
              <span className="grp">{g.name}</span>{' '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '14px 16px',
                }}
              >
                {g.items.map((c, i1) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} key={i1}>
                    {' '}
                    <span
                      style={{
                        display: 'block',
                        height: '44px',
                        borderRadius: '4px',
                        background: c.hex,
                        boxShadow: 'inset 0 0 0 1px rgba(31,27,26,.08)',
                      }}
                    ></span>{' '}
                    <span style={{ fontSize: '12.5px', fontWeight: '600' }}>{c.name}</span>{' '}
                    <span className="mono">{c.hex}</span> <span className="meta">{c.use}</span>{' '}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="sec">
        <div className="sec-h">
          <b>02</b>
          <h2>타이포그래피</h2>
          <p className="meta">한 서체, 세 단계 굵기. 큰 숫자는 가늘게, 이름과 강조는 600, 제목만 700.</p>
        </div>
        <div className="sec-b" style={{ gap: '0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 200px',
              gap: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #1F1B1A',
            }}
            className="meta"
          >
            <span>역할</span>
            <span>예시</span>
            <span>크기 / 굵기 / 자간</span>
          </div>
          {v.types.map((t, i0) => (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 200px',
                gap: '16px',
                alignItems: 'baseline',
                padding: '12px 0',
                borderBottom: '1px solid #EEEAE5',
              }}
              key={i0}
            >
              {' '}
              <span className="sub">{t.role}</span>{' '}
              <span
                className="num"
                style={{
                  fontSize: `${t.size}px`,
                  fontWeight: t.w,
                  letterSpacing: t.ls,
                  color: t.c,
                  lineHeight: '1.35',
                }}
              >
                {t.sample}
              </span>{' '}
              <span className="mono">{t.spec}</span>{' '}
            </div>
          ))}
        </div>
      </section>
      <section className="sec">
        <div className="sec-h">
          <b>03</b>
          <h2>구분과 모서리</h2>
          <p className="meta">카드 대신 선으로 나눕니다. 모서리는 요소의 크기와 역할에 따라 다르게.</p>
        </div>
        <div className="sec-b">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="grp">섹션 제목 아래</span>
              <div style={{ paddingBottom: '8px', borderBottom: '1px solid #1F1B1A', fontWeight: '700' }}>
                캠페인별 성과
              </div>
              <span className="meta">1px Ink · 표와 목록의 시작</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="grp">행 구분</span>
              <div style={{ borderTop: '1px solid #EEEAE5', borderBottom: '1px solid #EEEAE5', height: '28px' }}></div>
              <span className="meta">1px Line soft · 표 행</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="grp">영역 구분</span>
              <div style={{ display: 'flex', height: '28px' }}>
                <div style={{ flex: '1' }}></div>
                <div style={{ flex: '1', borderLeft: '1px solid #E7E3DE' }}></div>
              </div>
              <span className="meta">1px Line · 좌우 패널, KPI 사이</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="grp">면 구분</span>
              <div style={{ height: '28px', background: '#F6F4F1', borderRadius: '4px' }}></div>
              <span className="meta">Surface · 선택 고객 요약, 표 헤더</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', alignItems: 'flex-end', paddingTop: '6px' }}>
            {v.radii.map((r, i0) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }} key={i0}>
                {' '}
                <span
                  style={{
                    display: 'block',
                    width: `${r.w}px`,
                    height: `${r.h}px`,
                    border: '1px solid #85505A',
                    borderRadius: r.r,
                    background: '#F8F1F2',
                  }}
                ></span>{' '}
                <span style={{ fontSize: '12.5px', fontWeight: '600' }}>{r.v}</span>
                <span className="meta">{r.use}</span>{' '}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="sec-h">
          <b>04</b>
          <h2>버튼 · 입력</h2>
          <p className="meta">높이 40px, 좌우 16px. 주요 버튼은 화면당 하나.</p>
        </div>
        <div className="sec-b">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="grp">버튼</span>{' '}
            <div className="state meta">
              <span>Default</span>
              <span>Hover</span>
              <span>Focus</span>
              <span>Disabled</span>
            </div>
            <div className="state">
              <div>
                <span className="btn btn-p">변경사항 저장</span>
              </div>
              <div>
                <span className="btn btn-p" style={{ background: '#6D434B', borderColor: '#6D434B' }}>
                  변경사항 저장
                </span>
              </div>
              <div>
                <span className="btn btn-p" style={{ outline: '2px solid #85505A', outlineOffset: '2px' }}>
                  변경사항 저장
                </span>
              </div>
              <div>
                <span className="btn" style={{ background: '#F3EEEE', borderColor: '#F3EEEE', color: '#A39B97' }}>
                  변경사항 저장
                </span>
              </div>
            </div>
            <div className="state">
              <div>
                <span className="btn">고객 확인</span>
              </div>
              <div>
                <span className="btn" style={{ background: '#F6F4F1' }}>
                  고객 확인
                </span>
              </div>
              <div>
                <span className="btn" style={{ outline: '2px solid #85505A', outlineOffset: '2px' }}>
                  고객 확인
                </span>
              </div>
              <div>
                <span className="btn" style={{ background: '#F3EEEE', borderColor: '#F3EEEE', color: '#A39B97' }}>
                  고객 확인
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="grp">입력 · 선택</span>{' '}
            <div className="state">
              <div>
                <span className="fld" style={{ color: '#A39B97' }}>
                  이름, 연락처 또는 취향 태그 검색
                </span>
              </div>
              <div>
                <span className="fld" style={{ borderColor: '#A9A19B' }}>
                  네일무드 성수
                </span>
              </div>
              <div>
                <span className="fld" style={{ borderColor: '#85505A', boxShadow: 'inset 0 0 0 1px #85505A' }}>
                  네일무드 성수
                </span>
              </div>
              <div>
                <span className="fld" style={{ background: '#F6F4F1', borderColor: '#EEEAE5', color: '#A39B97' }}>
                  마지막 이용 후 24개월
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="sec-h">
          <b>05</b>
          <h2>상태 · 선택</h2>
          <p className="meta">상태는 색과 글자를 함께 씁니다. 색만으로 뜻을 전하지 않습니다.</p>
        </div>
        <div className="sec-b">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="grp">고객 관계 · 관리 상태</span>{' '}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {' '}
              {v.chips.map((c, i0) => (
                <span className="chip" style={{ background: c.bg, color: c.fg }} key={i0}>
                  <i></i>
                  {c.label}
                </span>
              ))}{' '}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="grp">예약 블록</span>{' '}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {v.blocks.map((b, i0) => (
                <div
                  style={{
                    width: '132px',
                    padding: '6px 8px',
                    borderRadius: '3px',
                    background: b.bg,
                    color: b.fg,
                    borderLeft: `3px solid ${b.bar}`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  key={i0}
                >
                  <span style={{ fontWeight: '600', fontSize: '12.5px' }}>{b.name}</span>
                  <span style={{ fontSize: '11.5px', opacity: '.85' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="grp">탭</span>{' '}
              <div style={{ display: 'flex', borderBottom: '1px solid #E7E3DE' }}>
                <span
                  style={{
                    padding: '8px 14px',
                    borderBottom: '2px solid #85505A',
                    marginBottom: '-1px',
                    fontWeight: '700',
                  }}
                >
                  전체 248
                </span>
                <span style={{ padding: '8px 14px', color: '#5B5552' }}>예정 198</span>
                <span style={{ padding: '8px 14px', color: '#5B5552' }}>이탈 신호 22</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="grp">토글</span>{' '}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {' '}
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '22px',
                      borderRadius: '11px',
                      background: '#85505A',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: '21px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#fff',
                      }}
                    ></span>
                  </span>
                  <span className="meta">켜짐</span>
                </span>{' '}
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '22px',
                      borderRadius: '11px',
                      background: '#C9C3BD',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: '3px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#fff',
                      }}
                    ></span>
                  </span>
                  <span className="meta">꺼짐</span>
                </span>{' '}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="grp">선택 버튼</span>{' '}
              <div style={{ display: 'flex', gap: '8px' }}>
                <span
                  className="btn"
                  style={{ background: '#F3E5E7', borderColor: '#85505A', color: '#6E2A38', fontWeight: '700' }}
                >
                  네일
                </span>
                <span className="btn">속눈썹</span>
                <span className="btn">왁싱</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="sec-h">
          <b>06</b>
          <h2>데이터 표현</h2>
          <p className="meta">숫자는 표나 막대 중 한 곳에만. 막대는 얇게, 끝만 살짝 둥글게.</p>
        </div>
        <div className="sec-b">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="grp" style={{ borderBottom: '0' }}>
              표 행
            </span>{' '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
                gap: '14px',
                padding: '8px',
                background: '#F6F4F1',
                borderTop: '1px solid #1F1B1A',
                borderBottom: '1px solid #E7E3DE',
                fontSize: '12px',
                color: '#77706C',
              }}
            >
              <span>고객</span>
              <span>최근 시술</span>
              <span>관계</span>
              <span style={{ textAlign: 'right' }}>재방문 예상</span>
            </div>
            {v.rows.map((r, i0) => (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
                  gap: '14px',
                  alignItems: 'center',
                  padding: '10px 8px',
                  borderBottom: '1px solid #EEEAE5',
                  background: r.bg,
                }}
                key={i0}
              >
                {' '}
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ display: 'flex', flex: 'none' }}>
                    <div>
                      <Avatar who={r.name} size="36" />
                    </div>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{r.name}</span>
                    <span className="meta num">{r.phone}</span>
                  </span>
                </span>{' '}
                <span className="num">{r.last}</span>{' '}
                <span>
                  <span className="chip" style={{ background: r.cbg, color: r.cfg }}>
                    <i></i>
                    {r.seg}
                  </span>
                </span>{' '}
                <span className="num" style={{ textAlign: 'right', fontWeight: '600' }}>
                  {r.next}
                </span>{' '}
              </div>
            ))}{' '}
            <span className="meta" style={{ paddingTop: '8px' }}>
              선택된 행 = Berry tint 배경. 행 높이 56px, 숫자는 고정폭.
            </span>{' '}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="grp">KPI 줄</span>{' '}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  borderTop: '1px solid #E7E3DE',
                  borderBottom: '1px solid #E7E3DE',
                }}
              >
                <div style={{ padding: '12px 16px 12px 0', display: 'flex', flexDirection: 'column' }}>
                  <span className="sub">재예약률</span>
                  <span
                    className="num"
                    style={{
                      fontSize: '30px',
                      fontWeight: '500',
                      letterSpacing: '-0.025em',
                      lineHeight: '1.25',
                      color: '#85505A',
                    }}
                  >
                    20.8%
                  </span>
                  <span className="meta">발송 48건 중 10건</span>
                </div>
                <div
                  style={{
                    padding: '12px 16px',
                    borderLeft: '1px solid #E7E3DE',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span className="sub">연결 매출</span>
                  <span
                    className="num"
                    style={{ fontSize: '30px', fontWeight: '500', letterSpacing: '-0.025em', lineHeight: '1.25' }}
                  >
                    486,000원
                  </span>
                  <span className="meta">방문 완료 8건</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="grp">비교 막대</span>{' '}
              {v.bars.map((b, i0) => (
                <div
                  style={{ display: 'grid', gridTemplateColumns: '88px 1fr 40px', gap: '12px', alignItems: 'center' }}
                  key={i0}
                >
                  <span className="sub">{b.label}</span>
                  <span style={{ display: 'block', height: '12px', background: '#F3EFEA' }}>
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        width: `${b.w}%`,
                        background: b.c,
                        borderRadius: '0 3px 3px 0',
                      }}
                    ></span>
                  </span>
                  <span className="num" style={{ textAlign: 'right', fontWeight: '600' }}>
                    {b.n}
                  </span>
                </div>
              ))}{' '}
              <span className="meta">과정 = Rose · 결과 = Berry · 최종 방문 = Jade</span>{' '}
            </div>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="sec-h">
          <b>07</b>
          <h2>내비게이션</h2>
          <p className="meta">7개 메뉴, 기록 → 분석 → 재방문 흐름. 활성 메뉴만 흰 면·왼쪽 바·굵기로 구분합니다.</p>
        </div>
        <div className="sec-b">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '232px',
                background: 'linear-gradient(180deg, #F6EEEA 0%, #F1E5DF 100%)',
                padding: '12px',
                boxSizing: 'border-box',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {' '}
              {v.nav.map((n, i0) => (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '40px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    fontSize: '13.5px',
                    background: n.bg,
                    color: n.fg,
                    fontWeight: n.w,
                  }}
                  key={i0}
                >
                  {n.label}
                </span>
              ))}{' '}
            </div>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: '1px solid #EEEAE5',
                }}
              >
                <span className="sub">기본</span>
                <span className="mono">#F6EEEA→#F1E5DF 바탕 · 글자 #5A4F4B · 400</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: '1px solid #EEEAE5',
                }}
              >
                <span className="sub">활성</span>
                <span className="mono">#FFFDFB 바탕 · 왼쪽 #85505A 바 · 글자 #2F2826 · 600</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '12px', padding: '10px 0' }}>
                <span className="sub">상단 바</span>
                <span className="mono">92px · 경로 / 기능 검색 / 근무자 · 매장 / 알림</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="sec-h">
          <b>08</b>
          <h2>이미지</h2>
          <p className="meta">고객 사진은 원형, 시술 사진은 2px 모서리. 사진이 없으면 이니셜로 대체합니다.</p>
        </div>
        <div className="sec-b">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="grp">고객 아바타</span>{' '}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end' }}>
                {' '}
                <div>
                  <Avatar who="김민지" size="72" />
                </div>{' '}
                <div>
                  <Avatar who="최유진" size="52" />
                </div>{' '}
                <div>
                  <Avatar who="오서현" size="40" />
                </div>{' '}
                <div>
                  <Avatar who="윤다혜" size="40" />
                </div>{' '}
              </div>{' '}
              <span className="meta num">72 상세 · 52 요약 · 36–40 목록 · 사진 없음</span>
            </div>
            <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="grp">시술 사진</span>{' '}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px' }}>
                {v.photos.map((p, i0) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} key={i0}>
                    <div style={{ borderRadius: '2px', overflow: 'hidden' }}>
                      <div>
                        <Photo kind={p.k} h="96" />
                      </div>
                    </div>
                    <span className="meta">{p.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <p className="meta" style={{ paddingTop: '20px', borderTop: '1px solid #E7E3DE' }}>
        인물·시술 사진은 제공된 화면 캡처에서 잘라낸 시안용 이미지입니다. 배포 전 사용 허락된 사진으로 교체합니다.
      </p>
    </div>
  );
}
