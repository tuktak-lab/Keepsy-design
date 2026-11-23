import { images } from '@/assets/images';

export function Avatar(props: { who?: string; size?: any }) {
  function renderVals(): any {
    const M: any = {
      김민지: images.avatarKimMinji,
      이윤서: images.avatarLeeYunseo,
      최유진: images.avatarChoiYujin,
      정하린: images.avatarJungHarin,
      한예린: images.avatarHanYerin,
      오서현: images.avatarOhSeohyun,
    };
    const n = props.who || '';
    const s = props.size || 36;
    const url = M[n] || '';
    return {
      who: n,
      size: s,
      url,
      hasPhoto: !!url,
      noPhoto: !url,
      initial: n.charAt(0),
      fs: Math.round(s * 0.4),
    };
  }
  const v = renderVals();

  return (
    <span
      style={{
        display: 'block',
        flex: 'none',
        width: `${v.size}px`,
        height: `${v.size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#ECE8E3',
        position: 'relative',
      }}
    >
      {' '}
      {v.hasPhoto ? (
        <img
          src={v.url}
          alt={v.who}
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 22%' }}
        />
      ) : null}{' '}
      {v.noPhoto ? (
        <span
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#5B5552',
            font: `700 ${v.fs}px 'Noto Sans KR', sans-serif`,
          }}
        >
          {v.initial}
        </span>
      ) : null}{' '}
    </span>
  );
}
