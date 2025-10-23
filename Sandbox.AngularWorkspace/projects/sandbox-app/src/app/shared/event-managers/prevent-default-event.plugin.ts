import { EventManagerPlugin } from '@angular/platform-browser';

/**
 * Event manager plugin that enables the .prevent modifier for event bindings.
 * Usage: (click.preventDefault)="handler()" - automatically calls preventDefault() on the event
 */
export class PreventDefaultEventPlugin extends EventManagerPlugin {
	supports(eventName: string): boolean {
		return eventName.endsWith('.preventDefault');
	}

	addEventListener(element: HTMLElement, eventName: string, handler: (event: Event) => void): () => void {
		const [actualEventName] = eventName.split('.');

		const wrappedHandler = (event: Event) => {
			event.preventDefault();
			handler(event);
		};

		return this.manager.addEventListener(element, actualEventName, wrappedHandler) as () => void;
	}
}
