import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import Header from './core/header/header';

@Component({
	selector: 'sandbox-root',
	imports: [RouterOutlet, Header],
	templateUrl: './app.html',
	styleUrl: './app.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
// oxlint-disable-next-line typescript/no-extraneous-class
export class App {}
