import type { Provider } from '@angular/core';
import { PreventDefaultEventPlugin } from './prevent-default-event.plugin';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

const EVENT_PLUGINS: Provider[] = [PreventDefaultEventPlugin].map((plugin) => {
	return {
		provide: EVENT_MANAGER_PLUGINS,
		multi: true,
		useClass: plugin,
	};
});

export function provideEventPlugins(): Provider[] {
	return EVENT_PLUGINS;
}
