import { bootstrapApplication } from '@angular/platform-browser';
import { App } from '@sandbox-app/app';
import { appConfig } from '@sandbox-app/app.config';

bootstrapApplication(App, appConfig).catch((err: unknown) => {
	console.error(err);
});
