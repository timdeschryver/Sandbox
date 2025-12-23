import { render, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './theme-toggle';
import { ThemeService } from './theme.service';
import { signal } from '@angular/core';

describe('ThemeToggle', () => {
	it('renders light mode icon and text initially', async () => {
		const mockThemeService = {
			theme: signal('light' as const),
			toggleTheme: vi.fn(),
		};

		await render(ThemeToggle, {
			providers: [{ provide: ThemeService, useValue: mockThemeService }],
		});

		expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
		expect(screen.getByText('Dark')).toBeInTheDocument();
	});

	it('renders dark mode icon and text when theme is dark', async () => {
		const mockThemeService = {
			theme: signal('dark' as const),
			toggleTheme: vi.fn(),
		};

		await render(ThemeToggle, {
			providers: [{ provide: ThemeService, useValue: mockThemeService }],
		});

		expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
		expect(screen.getByText('Light')).toBeInTheDocument();
	});

	it('calls toggleTheme when button is clicked', async () => {
		const user = userEvent.setup();
		const mockThemeService = {
			theme: signal('light' as const),
			toggleTheme: vi.fn(),
		};

		await render(ThemeToggle, {
			providers: [{ provide: ThemeService, useValue: mockThemeService }],
		});

		const button = screen.getByRole('button');
		await user.click(button);

		expect(mockThemeService.toggleTheme).toHaveBeenCalledOnce();
	});

	it('has correct aria-pressed attribute', async () => {
		const mockThemeService = {
			theme: signal('dark' as const),
			toggleTheme: vi.fn(),
		};

		await render(ThemeToggle, {
			providers: [{ provide: ThemeService, useValue: mockThemeService }],
		});

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-pressed', 'true');
	});

	it('button is keyboard accessible', async () => {
		const user = userEvent.setup();
		const mockThemeService = {
			theme: signal('light' as const),
			toggleTheme: vi.fn(),
		};

		await render(ThemeToggle, {
			providers: [{ provide: ThemeService, useValue: mockThemeService }],
		});

		const button = screen.getByRole('button');
		button.focus();
		await user.keyboard('{Enter}');

		expect(mockThemeService.toggleTheme).toHaveBeenCalledOnce();
	});
});
