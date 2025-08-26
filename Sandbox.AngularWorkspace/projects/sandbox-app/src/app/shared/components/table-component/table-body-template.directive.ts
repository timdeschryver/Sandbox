import { Directive, input } from '@angular/core';
import { type HttpResourceRef } from '@angular/common/http';

@Directive({
	selector: 'ng-template[sandboxTableBody]',
})
export class TableBodyTemplateDirective<T> {
	public readonly sandboxTableBody = input.required<HttpResourceRef<T[] | undefined>>();
	static ngTemplateContextGuard<TContext>(
		_dir: TableBodyTemplateDirective<TContext>,
		ctx: unknown,
	): ctx is {
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
