import { App } from '@sandbox-app/app';
import { appConfig } from '@sandbox-app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(App, appConfig).catch((err: unknown) => {
	console.error(err);
});
