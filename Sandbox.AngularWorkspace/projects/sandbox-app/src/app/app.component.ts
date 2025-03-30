import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '@sandbox-app/authentication/authentication.service';
import { AuthenticatedDirective } from '@sandbox-app/authentication/authenticated.directive';
import { AnonymousDirective } from '@sandbox-app/authentication/anonymous.directive';

@Component({
	selector: 'sandbox-root',
	imports: [RouterOutlet, RouterLink, AuthenticatedDirective, AnonymousDirective],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	private http = inject(AuthenticationService);

	protected user = this.http.user;
}
