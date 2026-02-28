import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Authentication } from '@sandbox-app/authentication/authentication';
import { Authenticated } from '@sandbox-app/authentication/authenticated';
import { Anonymous } from '@sandbox-app/authentication/anonymous';
import ThemeToggle from '@sandbox-app/core/theme/theme-toggle';
import { FeatureFlags } from '@sandbox-app/feature-flags/feature-flags';

@Component({
	selector: 'sandbox-header',
	imports: [RouterLink, Authenticated, Anonymous, RouterLinkActive, ThemeToggle, NgOptimizedImage],
	templateUrl: './header.html',
	styleUrl: './header.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Header {
	private readonly authenticationService = inject(Authentication);
	protected readonly user = this.authenticationService.user;
	protected readonly featureFlags = inject(FeatureFlags);
}
