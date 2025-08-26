import { type OperatorFunction, filter } from 'rxjs';

export function filterNullish<T>(): OperatorFunction<T | null | undefined, T> {
	return filter((value): value is T => value !== null && value !== undefined);
}
