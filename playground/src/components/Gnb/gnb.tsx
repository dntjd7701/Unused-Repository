'use client';

import { ChildRoute, ParentRoute, ROUTE, ROUTE_PATH, gnbRootList, isParentRoute, routes } from './routes';
import classNames from 'classnames';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import './gnb.scss';

// children을 가지고 있는 route object
const ParentGnbItem = ({ route }: { route: ParentRoute }) => {
  const { item = [] } = useParams();
  const parentRoot = item.length > 0 ? routes[`/${item[0]}` as ROUTE_PATH] : routes['/']; //현재 경로의 시작점.
  const currentPath = ['', ...item].join('/') as ROUTE_PATH;
  const open = currentPath === route.link || (Array.isArray(route.children) && route.children.includes(currentPath));

  return (
    <li
      className={classNames('parent', `items-${Array.isArray(parentRoot?.children) ? parentRoot.children.length : 0}`, {
        open,
      })}>
      <Link href={route.link}>{route.name}</Link>
      <ul className='subRoutes'>
        {route.children.map((r: ROUTE_PATH, idx: number) => (
          <GnbItem
            key={idx}
            route={routes[r]}
          />
        ))}
      </ul>
    </li>
  );
};

// children을 가지고 있지 않는 route object
const ChildGnbItem = ({ route }: { route: ChildRoute }) => {
  const { item = [] } = useParams();
  const currentPath = ['', ...item].join('/') as ROUTE_PATH;

  return (
    <li className={classNames({ active: route.link === currentPath })}>
      <Link href={route.link}>{route.name}</Link>
    </li>
  );
};

const GnbItem = ({ route }: { route: ROUTE }) => (isParentRoute(route) ? <ParentGnbItem route={route} /> : <ChildGnbItem route={route} />);

const Gnb = () => {
  return (
    <aside>
      <Link href={routes['/'].link}>
        <h1>
          Side bar<sub>FE WS</sub>
        </h1>
      </Link>

      <ul className='mainRoutes'>
        {gnbRootList.map((route: ROUTE, idx: number) => (
          <GnbItem
            key={idx}
            route={route}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Gnb;
