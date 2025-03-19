import { Routes } from '@angular/router';

export const customersRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'overview',
				loadComponent: () => import('./customers-overview/customers-overview.component'),
			},
			{
				path: '**',
				redirectTo: 'overview',
			},
		],
	},
];

export default customersRoutes;
