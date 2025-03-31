import { ChangeDetectionStrategy, Component, TemplateRef, contentChild, input } from '@angular/core';
import { HttpResourceRef } from '@angular/common/http';
import { NgTemplateOutlet } from '@angular/common';
import { TableBodyTemplateDirective } from '@sandbox-app/shared/components/table-component/table-body-template.directive';

@Component({
	selector: 'sandbox-table',
	imports: [NgTemplateOutlet],
	templateUrl: './table.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
	public readonly resource = input.required<HttpResourceRef<{ id: string | number }[] | undefined>>();
	public readonly headerTemplate = contentChild<TemplateRef<unknown>>('sandboxTableHeader');
	public readonly footerTemplate = contentChild<TemplateRef<unknown>>('sandboxTableFooter');
	public readonly bodyTemplate = contentChild(TableBodyTemplateDirective, {
		read: TemplateRef,
	});

	protected refresh() {
		this.resource().reload();
	}
}
