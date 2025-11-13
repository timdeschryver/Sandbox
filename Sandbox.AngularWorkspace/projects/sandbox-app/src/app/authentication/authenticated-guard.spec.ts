import { expect, it, vi } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { type ActivatedRouteSnapshot, type GuardResult, type RouterStateSnapshot } from '@angular/router';
import { type Observable, firstValueFrom } from 'rxjs';
import { authenticatedGuard } from './authenticated-guard';
import { Authentication } from './authentication';

it('allows access when user is authenticated', async () => {
	const { guard } = await setup(true);

	const result = await firstValueFrom(guard);

	expect(result).toBe(true);
});

it('invokes the login when user is unauthenticated', async () => {
	const { guard, authenticated } = await setup(false);

	const result = await firstValueFrom(guard);

	expect(result).toBe(false);
	expect(authenticated.login).toHaveBeenCalledWith('/page');
});

async function setup(isAuthenticated: boolean) {
	const authenticated = {
		user: signal({
			isAuthenticated,
		}),
		login: vi.fn(),
	};
	TestBed.configureTestingModule({
		providers: [
			{
				provide: Authentication,
				useValue: authenticated,
			},
		],
	});

	const guard = (await TestBed.runInInjectionContext(() => {
		const routeSnapshot = {} as ActivatedRouteSnapshot;
		const stateSnapshot = { url: '/page' } as RouterStateSnapshot;

		return authenticatedGuard(routeSnapshot, stateSnapshot);
	})) as Observable<GuardResult>;
	return { guard, authenticated };
}
