export function generateRandomString(length: number) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}
