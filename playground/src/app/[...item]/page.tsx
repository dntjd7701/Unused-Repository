'use client';

import { isParentRoute, ROUTE, ROUTE_PATH, routes } from '@/components/Gnb/routes';

const ItemPage = ({ params: { item } }: { params: { item: string[] } }) => {
	const path = ['', ...item].join('/') as ROUTE_PATH;
	const route: ROUTE = routes[path];


	if (!route) return null;

	// 일단은 null로 보류, 나중에 뭘 채울지 고민해보자
	if (isParentRoute(route)) {
		return null;
	}

	const { children: Component } = route;

	return Component ? <Component /> : null;
};

export default ItemPage;
