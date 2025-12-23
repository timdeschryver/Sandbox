import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Authentication } from '@sandbox-app/authentication/authentication';
import { Authenticated } from '@sandbox-app/authentication/authenticated';
import { Anonymous } from '@sandbox-app/authentication/anonymous';

@Component({
	selector: 'sandbox-header',
	imports: [RouterLink, Authenticated, Anonymous, RouterLinkActive],
	templateUrl: './header.html',
	styleUrl: './header.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Header {
	private readonly authenticationService = inject(Authentication);
	protected readonly user = this.authenticationService.user;
}
