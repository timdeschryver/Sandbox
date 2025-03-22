import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthenticationService } from '@/authentication/authentication.service';

@Component({
	selector: 'sandbox-user',
	template: ` <pre>{{ user() | json }}</pre> `,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [JsonPipe],
})
export default class UserComponent {
	private readonly userService = inject(AuthenticationService);
	protected readonly user = this.userService.user;
}
