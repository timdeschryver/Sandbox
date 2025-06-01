import '@testing-library/jest-dom/vitest';
import { expect, it } from 'vitest';
import { signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { authenticatedGuard } from './authenticated.guard';
import { AuthenticationService } from './authentication.service';

it('allows access when user is authenticated', async () => {
	const guard = await setup(true);

	const result = await firstValueFrom(guard);

	expect(result).toBe(true);
});

it('navigates to login when user is unauthenticated', async () => {
	const guard = await setup(false);
	const document = TestBed.inject(DOCUMENT);

	const result = await firstValueFrom(guard);

	expect(result).toBe(false);
	expect(document.location.href).toBe('/bff/login?returnUrl=/page');
});

async function setup(isAuthenticated: boolean) {
	TestBed.configureTestingModule({
		providers: [
			{
				provide: AuthenticationService,
				useValue: {
					user: signal({
						isAuthenticated,
					}),
				},
			},
			{
				provide: DOCUMENT,
				useValue: {
					location: {
						href: 'initial',
					},
				},
			},
		],
	});

	return (await TestBed.runInInjectionContext(() => {
		const routeSnapshot = {} as ActivatedRouteSnapshot;
		const stateSnapshot = { url: '/page' } as RouterStateSnapshot;

		return authenticatedGuard(routeSnapshot, stateSnapshot);
	})) as Observable<boolean>;
}
