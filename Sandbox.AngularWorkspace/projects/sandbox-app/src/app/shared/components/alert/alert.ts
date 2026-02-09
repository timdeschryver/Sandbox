import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

@Component({
	selector: 'sandbox-alert',
	template: '<div [class]="classes()"><ng-content /></div>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
	readonly type = input.required<AlertType>();

	readonly classes = computed(() => {
		const baseClasses = 'p-4 rounded-md mb-4 border-l-4';
		const typeClasses = {
			error: 'bg-red-50 dark:bg-red-950/30 border-l-red-500 text-red-700 dark:text-red-300',
			success: 'bg-green-50 dark:bg-green-950/30 border-l-green-500 text-green-700 dark:text-green-300',
			warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-l-yellow-500 text-yellow-700 dark:text-yellow-300',
			info: 'bg-blue-50 dark:bg-blue-950/30 border-l-blue-500 text-blue-700 dark:text-blue-300',
		};

		const typeClass = typeClasses[this.type()];
		return `${baseClasses} ${typeClass}`;
	});
}
