import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideEventPlugins } from '@sandbox-app/shared/event-managers';

export default [
	provideZonelessChangeDetection(),
	provideHttpClient(),
	provideHttpClientTesting(),
	provideEventPlugins(),
];
