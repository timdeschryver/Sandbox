import { ChangeDetectionStrategy, Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { PreventDefaultEventPlugin } from './prevent-default-event.plugin';
import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

@Component({
	selector: 'sandbox-test',
	standalone: true,
	template: ` <a href="https://example.com" (click.preventDefault)="handleClick()"> Click me </a> `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
	handleClick = vi.fn();
}

describe('PreventDefaultEventPlugin', () => {
	it('prevents default behavior and calls handler', async () => {
		const user = userEvent.setup();
		const { fixture } = await render(TestComponent);

		const component = fixture.componentInstance;
		const link = screen.getByRole('link', { name: 'Click me' });

		await user.click(link);

		expect(component.handleClick).toHaveBeenCalledTimes(1);
	});

	it('plugin supports .preventDefault modifier', () => {
		const plugin = new PreventDefaultEventPlugin({});
		expect(plugin.supports('click.preventDefault')).toBe(true);
		expect(plugin.supports('submit.preventDefault')).toBe(true);
		expect(plugin.supports('click')).toBe(false);
	});
});
