import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'weatherforecast',
		loadComponent: () =>
			import('./weatherforecast/weatherforecast.component').then(
				(m) => m.WeatherForecastComponent,
			),
	},
	{
		path: 'people',
		loadComponent: () =>
			import('./people/people.component').then(
				(m) => m.PeopleComponent,
			),
	},
];
