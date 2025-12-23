import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'sandbox-not-found',
	imports: [RouterLink],
	template: `
		<div class="not-found-page">
			<div class="not-found-content">
				<div class="error-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="120"
						height="120"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M16 16s-1.5-2-4-2-4 2-4 2" />
						<line x1="9" y1="9" x2="9.01" y2="9" />
						<line x1="15" y1="9" x2="15.01" y2="9" />
					</svg>
				</div>
				<h1 class="error-title">404 - Page Not Found</h1>
				<p class="error-message">Sorry, the page you are looking for cannot be found.</p>
				<a routerLink="/" class="home-button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
						<polyline points="9 22 9 12 15 12 15 22" />
					</svg>
					<span>Go to Home Page</span>
				</a>
			</div>
		</div>
	`,
	styles: `
		.not-found-page {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: calc(100vh - var(--header-height) - var(--space-16));
			padding: var(--space-8) 0;
		}

		.not-found-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			max-width: 500px;
			padding: var(--space-8);
		}

		.error-icon {
			margin-bottom: var(--space-6);
		}

		.error-icon svg {
			color: var(--color-gray-400);
		}

		.error-title {
			font-size: var(--font-size-3xl);
			font-weight: 600;
			color: var(--color-text-primary);
			margin: 0 0 var(--space-4) 0;
		}

		.error-message {
			font-size: var(--font-size-lg);
			color: var(--color-text-secondary);
			line-height: var(--line-height-relaxed);
			margin: 0 0 var(--space-8) 0;
		}

		.home-button {
			display: inline-flex;
			align-items: center;
			gap: var(--space-2);
			padding: var(--space-3) var(--space-6);
			background-color: var(--color-primary);
			color: var(--color-white);
			border-radius: var(--radius-md);
			font-size: var(--font-size-base);
			font-weight: 500;
			text-decoration: none;
			transition: all var(--transition-fast);
		}

		.home-button:hover {
			background-color: var(--color-primary-dark);
			color: var(--color-white);
			box-shadow: var(--shadow-md);
			transform: translateY(-1px);
		}

		.home-button:active {
			transform: translateY(0);
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class NotFound {}
