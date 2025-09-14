import { type Routes } from '@angular/router';
import { authenticatedGuard } from '@sandbox-app/authentication/authenticated-guard';

export const routes: Routes = [
	{
		path: '',
		canActivateChild: [authenticatedGuard],
		children: [
			{
				path: 'customers',
				loadChildren: () => import('@sandbox-app/customer-management/customer-management.routes'),
				title: 'Customers',
			},
		],
	},
	{
		path: 'user',
		loadComponent: () => import('@sandbox-app/authentication/user/user'),
		title: 'User',
	},
	{
		path: '**',
		loadComponent: () => import('@sandbox-app/authentication/not-found/not-found'),
		title: 'Not Found',
	},
];
