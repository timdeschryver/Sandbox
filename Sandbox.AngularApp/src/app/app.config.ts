import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { routes } from '@/app.routes';
import { provideOpenTelemetryInstrumentation } from '@/otel-instrumentation';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withComponentInputBinding()),
		provideHttpClient(
			withXsrfConfiguration({
				cookieName: '__Sandbox-X-XSRF-TOKEN',
				headerName: 'X-XSRF-TOKEN',
			})
		),
		{
			provide: DATE_PIPE_DEFAULT_OPTIONS,
			useValue: { dateFormat: 'dd-MMM-yyyy' },
		},
		provideOpenTelemetryInstrumentation(),
	],
};
