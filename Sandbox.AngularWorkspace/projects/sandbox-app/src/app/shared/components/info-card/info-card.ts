import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'sandbox-info-card',
	templateUrl: './info-card.html',
	styleUrl: './info-card.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCard {
	readonly title = input.required<string>();
	readonly testId = input<string>();
}
