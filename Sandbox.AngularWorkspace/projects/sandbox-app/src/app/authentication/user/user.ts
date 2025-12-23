import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Authentication } from '@sandbox-app/authentication/authentication';

@Component({
	selector: 'sandbox-user',
	imports: [JsonPipe],
	template: `
		<div class="user-page">
			<div class="user-card">
				<div class="card-header">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="user-icon"
					>
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
					<h1 class="page-title">User Profile</h1>
				</div>
				<div class="user-details">
					<pre class="json-display">{{ user() | json }}</pre>
				</div>
			</div>
		</div>
	`,
	styles: `
		.user-page {
			width: 100%;
		}

		.user-card {
			background-color: var(--color-background);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-lg);
			padding: var(--space-8);
			box-shadow: var(--shadow-sm);
			max-width: 800px;
			margin: 0 auto;
		}

		.card-header {
			display: flex;
			align-items: center;
			gap: var(--space-4);
			margin-bottom: var(--space-6);
			padding-bottom: var(--space-4);
			border-bottom: 1px solid var(--color-border-light);
		}

		.user-icon {
			color: var(--color-primary);
		}

		.page-title {
			font-size: var(--font-size-2xl);
			font-weight: 600;
			color: var(--color-text-primary);
			margin: 0;
		}

		.user-details {
			background-color: var(--color-surface);
			border: 1px solid var(--color-border-light);
			border-radius: var(--radius-md);
			padding: var(--space-6);
			overflow: auto;
		}

		.json-display {
			font-family: var(--font-mono);
			font-size: var(--font-size-sm);
			color: var(--color-text-primary);
			line-height: var(--line-height-relaxed);
			margin: 0;
			white-space: pre-wrap;
			word-wrap: break-word;
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class User {
	private readonly userService = inject(Authentication);
	protected readonly user = this.userService.user;
}
