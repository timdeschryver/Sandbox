import type { Provider } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { PreventDefaultEventPlugin } from './prevent-default-event.plugin';

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
