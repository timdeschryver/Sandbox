import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
	selector: 'sandbox-theme-toggle',
	imports: [],
	templateUrl: './theme-toggle.html',
	styleUrl: './theme-toggle.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ThemeToggle {
	private readonly themeService = inject(ThemeService);
	readonly theme = this.themeService.theme;

	toggleTheme(): void {
		this.themeService.toggleTheme();
	}
}
