import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

@Component({
	selector: 'sandbox-alert',
	template: '<div [class]="`alert alert-${type()}`"><ng-content /></div>',
	styleUrl: './alert.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
	readonly type = input.required<AlertType>();
}
