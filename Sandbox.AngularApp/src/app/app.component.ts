import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './core/authentication.service';
import { AuthenticatedDirective } from './core/authenticated.directive';
import { AnonymousDirective } from './core/anonymous.directive';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		RouterLink,
		AuthenticatedDirective,
		AnonymousDirective,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	private http = inject(AuthenticationService);

	protected user = this.http.user;
}
