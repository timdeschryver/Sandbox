export interface User {
	isAuthenticated: boolean;
	name: string;
	claims: { type: string; value: string }[];
}
