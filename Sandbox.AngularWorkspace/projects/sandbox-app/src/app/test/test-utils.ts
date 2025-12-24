export function stripUtilAttributes(element: HTMLElement | null): HTMLElement | null {
	if (!element) {
		return null;
	}
	const html = element.innerHTML
		.replace(/ ng-version=".*?"/g, '')
		.replace(/ ng-server-context=".*?"/g, '')
		.replace(/ ng-reflect-(.*?)=".*?"/g, '')
		.replace(/ _nghost(.*?)=""/g, '')
		.replace(/ _ngcontent(.*?)=""/g, '');
	const div = document.createElement('div');
	div.innerHTML = html;
	return div;
}
