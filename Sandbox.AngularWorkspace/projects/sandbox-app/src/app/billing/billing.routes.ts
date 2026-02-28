import { type Routes } from '@angular/router';

export const billingRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('@sandbox-app/billing/billing-overview/billing-overview'),
		title: 'Billing Overview',
	},
];

export default billingRoutes;
