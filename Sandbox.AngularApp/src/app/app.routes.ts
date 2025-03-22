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
			},
		],
	},
	{
		path: '**',
		loadComponent: () => import('@/authentication/not-found/not-found.component'),
		title: 'Not Found',
	},
];
