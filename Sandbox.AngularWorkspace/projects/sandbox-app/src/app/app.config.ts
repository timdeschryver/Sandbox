import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { routes } from '@sandbox-app/app.routes';
import { provideOpenTelemetryInstrumentation } from '@opentelemetry';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes, withComponentInputBinding()),
		provideHttpClient(
			withXsrfConfiguration({
				cookieName: '__Sandbox-X-XSRF-TOKEN',
				headerName: 'X-XSRF-TOKEN',
			}),
		),
		{
			provide: DATE_PIPE_DEFAULT_OPTIONS,
			useValue: { dateFormat: 'dd-MMM-yyyy' },
		},
		provideOpenTelemetryInstrumentation(),
	],
};
