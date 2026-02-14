import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

@Component({
	selector: 'sandbox-alert',
	template: `
		<div [class]="classes()">
			<div class="flex items-start gap-3">
				<div [class]="iconContainerClasses()">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						[innerHTML]="iconPath()"
					></svg>
				</div>
				<div class="flex-1">
					<ng-content />
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
	readonly type = input.required<AlertType>();

	readonly classes = computed(() => {
		const baseClasses = 'p-4 rounded-md mb-4 border';
		const typeClasses = {
			error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
			success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
			warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
			info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
		};

		const typeClass = typeClasses[this.type()];
		return `${baseClasses} ${typeClass}`;
	});

	readonly iconContainerClasses = computed(() => {
		const baseClasses = 'w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0';
		const typeClasses = {
			error: 'bg-red-500 text-white',
			success: 'bg-green-500 text-white',
			warning: 'bg-yellow-500 text-white',
			info: 'bg-blue-500 text-white',
		};

		const typeClass = typeClasses[this.type()];
		return `${baseClasses} ${typeClass}`;
	});

	readonly iconPath = computed(() => {
		const icons = {
			error: '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
			success: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
			warning:
				'<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
			info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
		};
		return icons[this.type()];
	});

	readonly textClasses = computed(() => {
		const typeClasses = {
			error: 'text-red-700 dark:text-red-300',
			success: 'text-green-700 dark:text-green-300',
			warning: 'text-yellow-700 dark:text-yellow-300',
			info: 'text-blue-700 dark:text-blue-300',
		};

		return typeClasses[this.type()];
	});
}
