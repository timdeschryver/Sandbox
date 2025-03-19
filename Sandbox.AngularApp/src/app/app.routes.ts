import { Routes } from '@angular/router';
import { authenticatedGuard } from './authentication/authenticated.guard';

export const routes: Routes = [
	{
		path: '',
		canActivateChild: [authenticatedGuard],
		children: [
			{
				path: 'weatherforecast',
				loadComponent: () => import('./weatherforecast/weatherforecast.component'),
			},
			{
				path: 'people',
				loadComponent: () => import('./people/people.component'),
			},
			{
				path: 'customers',
				loadChildren: () => import('./customers/customers.routes'),
			},
		],
	},
	{
		path: '**',
		loadComponent: () => import('./authentication/not-found/not-found.component'),
		title: 'Not Found',
	},
];
