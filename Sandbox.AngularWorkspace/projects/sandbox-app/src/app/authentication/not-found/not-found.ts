import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'sandbox-not-found',
	imports: [RouterLink],
	templateUrl: './not-found.html',
	styleUrl: './not-found.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class NotFound {}
