import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@/authentication/authentication.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { filterNullish } from '@/shared/operators';
import { DOCUMENT } from '@angular/common';

export const authenticatedGuard: CanActivateFn = (_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
	const user = inject(AuthenticationService);
	const document = inject(DOCUMENT);

	return toObservable(user.user).pipe(
		filterNullish(),
		map((user) => {
			if (user.isAuthenticated) {
				return true;
			}
			if (document.defaultView) {
				document.defaultView.location.href = '/bff/login';
			}
			return false;
		}),
	);
};
