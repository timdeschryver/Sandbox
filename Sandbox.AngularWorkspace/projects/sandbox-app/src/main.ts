import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@sandbox-app/app.config';
import { AppComponent } from '@sandbox-app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
	console.error(err),
);
