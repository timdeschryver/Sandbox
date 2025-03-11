import { Routes } from '@angular/router';
import { authenticatedGuard } from './core/authenticated.guard';

export const routes: Routes = [
	{
		path: '',
		canActivateChild: [authenticatedGuard],
		children: [
			{
				path: 'weatherforecast',
				loadComponent: () => import('./weatherforecast/weatherforecast.component')
			},
			{
				path: 'people',
				loadComponent: () => import('./people/people.component')
			},
		],
	},
	{
		path: '**',
		loadComponent: () => import('./core/not-found/not-found.component'),
		title: 'Not Found',
	},
];
