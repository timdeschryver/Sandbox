import { render, screen } from '@testing-library/angular';
import { expect, it } from 'vitest';
import ThemeToggle from './theme-toggle';
import userEvent from '@testing-library/user-event';

it('renders light mode icon and text initially', async () => {
	localStorage.setItem('app-theme', 'light');
	await render(ThemeToggle);

	expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
	expect(screen.getByText('Dark')).toBeInTheDocument();
});

it('renders dark mode icon and text initially', async () => {
	localStorage.setItem('app-theme', 'dark');
	await render(ThemeToggle);

	expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
	expect(screen.getByText('Light')).toBeInTheDocument();
});

it('toggles theme when button is clicked', async () => {
	localStorage.setItem('app-theme', 'dark');
	const user = userEvent.setup();

	await render(ThemeToggle);

	const button = screen.getByRole('button');
	await user.click(button);

	expect(localStorage.getItem('app-theme')).toBe('light');
});
