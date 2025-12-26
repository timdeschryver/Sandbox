import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	private readonly storageKey = 'app-theme';
	readonly theme = signal<Theme>(this.getInitialTheme());

	constructor() {
		this.applyTheme(this.theme());

		effect(() => {
			const currentTheme = this.theme();
			this.applyTheme(currentTheme);
			this.saveTheme(currentTheme);
		});

		this.watchSystemTheme();
	}

	toggleTheme(): void {
		this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
	}

	setTheme(theme: Theme): void {
		this.theme.set(theme);
	}

	private getInitialTheme(): Theme {
		const saved = localStorage.getItem(this.storageKey) as Theme | null;
		if (saved === 'light' || saved === 'dark') {
			return saved;
		}

		return this.getSystemTheme();
	}

	private getSystemTheme(): Theme {
		if (typeof window !== 'undefined') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return 'light';
	}

	private applyTheme(theme: Theme): void {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', theme);
		}
	}

	private saveTheme(theme: Theme): void {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(this.storageKey, theme);
		}
	}

	private watchSystemTheme(): void {
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

			const handleChange = (e: MediaQueryListEvent) => {
				const savedTheme = localStorage.getItem(this.storageKey);
				if (!savedTheme) {
					this.theme.set(e.matches ? 'dark' : 'light');
				}
			};

			mediaQuery.addEventListener('change', handleChange);
		}
	}
}
