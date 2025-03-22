import { Routes } from '@angular/router';
import { authenticatedGuard } from '@/authentication/authenticated.guard';

export const routes: Routes = [
	{
		path: '',
		canActivateChild: [authenticatedGuard],
		children: [
			{
				path: 'customers',
				loadChildren: () => import('@/customers/customers.routes'),
				title: 'Customers',
			},
		],
	},
	{
		path: 'user',
		loadComponent: () => import('@/authentication/user/user.component'),
		title: 'User',
	},
	{
		path: '**',
		loadComponent: () => import('@/authentication/not-found/not-found.component'),
		title: 'Not Found',
	},
];
