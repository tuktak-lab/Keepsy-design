// 모든 화면 공통 인터랙션 보조 (main.tsx 에서 한 번 시작)
// 1) 탭·세그먼트: 선택 배경(인디케이터)이 선택된 버튼으로 부드럽게 이동
// 2) 이미지: 실제로 다 불러온 뒤 자연스럽게 나타남(그동안은 자리의 배경색이 플레이스홀더)

const TAB_GROUPS = '.tabs, .kp-seg, .cp-seg, .pf-seg, .st-seg';
const ACTIVE = ':scope > button[aria-selected="true"], :scope > button[aria-pressed="true"]';

function placeIndicators() {
  document.querySelectorAll<HTMLElement>(TAB_GROUPS).forEach((g) => {
    let ind = g.querySelector<HTMLElement>(':scope > .kp-ind');
    if (!ind) {
      ind = document.createElement('span');
      ind.className = 'kp-ind';
      ind.setAttribute('aria-hidden', 'true');
      g.appendChild(ind);
      g.classList.add('kp-has-ind');
    }
    const on = g.querySelector<HTMLElement>(ACTIVE);
    if (!on) {
      ind.style.opacity = '0';
      return;
    }
    ind.style.opacity = '1';
    ind.style.width = on.offsetWidth + 'px';
    ind.style.height = on.offsetHeight + 'px';
    ind.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
    // 처음 자리잡을 때는 움직이지 않고, 그 다음부터 이동 애니메이션
    if (!g.classList.contains('kp-ind-ready')) requestAnimationFrame(() => g.classList.add('kp-ind-ready'));
  });
}

function watchImages(root: ParentNode) {
  root.querySelectorAll<HTMLImageElement>('img:not([data-kp-img])').forEach((img) => {
    img.dataset.kpImg = '1';
    const done = () => img.classList.remove('kp-img-wait');
    if (!img.complete) img.classList.add('kp-img-wait');
    img.addEventListener('load', done);
    img.addEventListener('error', done);
  });
}

export function startMotion() {
  let queued = false;
  const run = () => {
    queued = false;
    placeIndicators();
    watchImages(document);
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      // 이미지 주소가 바뀌면(사진 전환) 다시 페이드
      if (r.type === 'attributes' && r.attributeName === 'src' && r.target instanceof HTMLImageElement) {
        const img = r.target;
        if (!img.complete) img.classList.add('kp-img-wait');
      }
    }
    schedule();
  });
  mo.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['aria-selected', 'aria-pressed', 'src'],
  });
  window.addEventListener('resize', schedule);
  document.fonts?.ready.then(schedule);
  schedule();
}
