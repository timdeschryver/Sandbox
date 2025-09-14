import { type Routes } from '@angular/router';

export const customerManagementRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				loadComponent: () => import('./customers-overview/customers-overview'),
			},
			{
				path: ':customerId',
				loadComponent: () => import('./customer-details/customer-details'),
			},
			{
				path: '**',
				redirectTo: '',
			},
		],
	},
];

export default customerManagementRoutes;
