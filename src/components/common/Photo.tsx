import { images } from '@/assets/images';

export function Photo(props: { kind?: string; h?: any; bg?: string; caption?: string; label?: string }) {
  function renderVals(): any {
    const U: any = {
      milky: images.nailMilky,
      hero: images.nailHero,
      gloss: images.nailGloss,
      french: images.nailFrench,
      pearl: images.nailHero,
    };
    const k = props.kind || 'milky';
    return {
      url: U[k] || U.milky,
      h: props.h || 90,
      bg: props.bg || '#E9E4DD',
      caption: props.caption ?? '',
      label: props.label || '시술 사진',
    };
  }
  const v = renderVals();

  return (
    <div
      role="img"
      aria-label={v.label}
      style={{ position: 'relative', width: '100%', height: `${v.h}px`, background: v.bg, overflow: 'hidden' }}
    >
      {' '}
      <img
        src={v.url}
        alt={v.label}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />{' '}
      <span
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          padding: '0 8px 5px',
          font: "400 11px 'Noto Sans KR', sans-serif",
          color: '#FFFFFF',
          textShadow: '0 0 3px rgba(0,0,0,.45)',
        }}
      >
        {v.caption}
      </span>{' '}
    </div>
  );
}
