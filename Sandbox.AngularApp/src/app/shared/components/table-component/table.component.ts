import { ChangeDetectionStrategy, Component, contentChild, input, TemplateRef } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';
import { NgTemplateOutlet } from '@angular/common';
import { TableBodyTemplateDirective } from '@/shared/components/table-component/table-body-template.directive';

@Component({
	selector: 'app-table',
	imports: [NgTemplateOutlet],
	template: `
		<div>
			@if (resource().hasValue() && resource().isLoading()) {
				<div>Refreshing data...</div>
			}

			@if (resource().hasValue()) {
				<table>
					@if (headerTemplate()) {
						<thead>
							<tr>
								<th><button (click)="refresh()">🔃</button></th>
								<ng-container *ngTemplateOutlet="headerTemplate()!" />
							</tr>
						</thead>
					}
					<tbody>
						@if (resource().error()) {
							<div>{{ $any(resource().error()).error.title }}</div>
							<button (click)="refresh()">Retry</button>
						} @else if (resource().hasValue()) {
							@for (
								row of resource().value();
								track row.id;
								let index = $index, even = $even, odd = $odd, count = $count, first = $first, last = $last
							) {
								<tr>
									<td></td>
									<ng-container
										*ngTemplateOutlet="
											bodyTemplate()!;
											context: {
												$implicit: row,
												value: row,
												index: index,
												count: count,
												first: first,
												last: last,
												even: even,
												odd: odd,
											}
										"
									/>
								</tr>
							} @empty {
								<tr>
									<td colspan="100%">No data available.</td>
								</tr>
							}
						}
					</tbody>

					@if (footerTemplate()) {
						<tfoot>
							<tr>
								<ng-container *ngTemplateOutlet="footerTemplate()!" />
							</tr>
						</tfoot>
					}
				</table>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
	public resource = input.required<HttpResourceRef<{ id: string | number }[] | undefined>>();
	public headerTemplate = contentChild<TemplateRef<unknown>>('appTableHeader');
	public footerTemplate = contentChild<TemplateRef<unknown>>('appTableFooter');
	public bodyTemplate = contentChild(TableBodyTemplateDirective, {
		read: TemplateRef,
	});

	protected refresh() {
		this.resource().reload();
	}
}
