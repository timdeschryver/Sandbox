import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthenticationService } from '@sandbox-app/authentication/authentication.service';

@Component({
	selector: 'sandbox-user',
	imports: [JsonPipe],
	template: ` <pre>{{ user() | json }}</pre> `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserComponent {
	private readonly userService = inject(AuthenticationService);
	protected readonly user = this.userService.user;
}
