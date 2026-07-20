import { type HttpResourceRef } from '@angular/common/http';
import { Directive, input } from '@angular/core';

@Directive({
	selector: 'ng-template[sandboxTableBody]',
})
export class TableBodyTemplate<T> {
	public readonly sandboxTableBody = input.required<HttpResourceRef<T[] | undefined>>();
	static ngTemplateContextGuard<TContext>(
		_dir: TableBodyTemplate<TContext>,
		_ctx: unknown,
	): _ctx is {
		$implicit: TContext;
		value: TContext;
		index: number;
		count: number;
		first: boolean;
		last: boolean;
		even: boolean;
		odd: boolean;
	} {
		return true;
	}
}
