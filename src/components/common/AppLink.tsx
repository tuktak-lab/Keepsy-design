import type { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

// 디자인 소스의 <a href="X.dc.html"> 를 앱 안 이동으로 바꾼 링크.
// '/' 로 시작하는 주소는 새로고침 없이 이동하고, 그 밖의 주소(#해시·tel: 등)는 일반 <a> 로 둡니다.
export function AppLink({ href = '', ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/')) return <Link to={href} {...rest} />;
  return <a href={href} {...rest} />;
}
