import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Authentication } from '@sandbox-app/authentication/authentication';

@Component({
	selector: 'sandbox-user',
	imports: [JsonPipe],
	template: ` <pre>{{ user() | json }}</pre> `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class User {
	private readonly userService = inject(Authentication);
	protected readonly user = this.userService.user;
}
