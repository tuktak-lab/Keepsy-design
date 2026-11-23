// 숫자 표시 컴포넌트.
// 숫자가 올라가는 장식 애니메이션은 쓰지 않기로 해서(차트 등장 효과만 유지) 최종값을 바로 보여줍니다.
// 여러 화면이 같은 이름으로 쓰고 있어 컴포넌트와 props 는 그대로 둡니다.
export function CountUp(props: { value: number; duration?: number; format?: (n: number) => string; decimals?: number }) {
  const n = Number(props.value.toFixed(props.decimals ?? 0));
  return <>{props.format ? props.format(n) : n.toLocaleString('ko-KR')}</>;
}
