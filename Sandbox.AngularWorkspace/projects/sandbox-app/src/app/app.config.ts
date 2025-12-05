import {
	type ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideHttpClient, withFetch, withXsrfConfiguration } from '@angular/common/http';
import { routes } from '@sandbox-app/app.routes';
import { provideOpenTelemetryInstrumentation } from '@opentelemetry';
import { provideEventPlugins } from './shared/event-managers';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(
			routes,
			withComponentInputBinding(),
			withInMemoryScrolling({
				scrollPositionRestoration: 'enabled',
			}),
		),
		provideHttpClient(
			withXsrfConfiguration({
				cookieName: '__Sandbox-X-XSRF-TOKEN',
				headerName: 'X-XSRF-TOKEN',
			}),
			withFetch(),
		),
		{
			provide: DATE_PIPE_DEFAULT_OPTIONS,
			useValue: { dateFormat: 'dd-MMM-yyyy' },
		},
		provideEventPlugins(),
		provideOpenTelemetryInstrumentation(),
	],
};
