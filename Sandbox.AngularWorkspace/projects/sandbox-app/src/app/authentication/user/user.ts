import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Authentication } from '@sandbox-app/authentication/authentication';
import { InfoCard } from '@sandbox-app/shared/components/info-card/info-card';

@Component({
	selector: 'sandbox-user',
	imports: [JsonPipe, InfoCard],
	templateUrl: './user.html',
	styleUrl: './user.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class User {
	private readonly userService = inject(Authentication);
	protected readonly user = this.userService.user;
}
