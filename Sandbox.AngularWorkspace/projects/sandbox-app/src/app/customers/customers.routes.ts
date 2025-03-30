import { Routes } from '@angular/router';

export const customersRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				loadComponent: () => import('./customers-overview/customers-overview.component'),
			},
			{
				path: ':customerId',
				loadComponent: () => import('./customer-details/customer-details.component'),
			},
			{
				path: '**',
				redirectTo: '',
			},
		],
	},
];

export default customersRoutes;
