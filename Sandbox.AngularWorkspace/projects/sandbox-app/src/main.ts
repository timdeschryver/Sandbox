import { AppComponent } from '@sandbox-app/app.component';
import { appConfig } from '@sandbox-app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
