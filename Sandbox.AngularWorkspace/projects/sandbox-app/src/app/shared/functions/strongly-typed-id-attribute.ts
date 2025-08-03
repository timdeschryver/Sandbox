import * as z from 'zod/mini';

export function stronglyTypedIdAttribute<const TSchema extends z.z.core.$ZodType>(
	schema: TSchema,
	map: (value: unknown) => unknown = (value: unknown): unknown => value,
): (raw: unknown) => z.z.core.infer<TSchema> {
	return (raw: unknown): z.z.core.infer<TSchema> => {
		try {
			return z.parse(schema, map(raw));
		} catch (error) {
			if (ngDevMode) {
				console.error('Validation error:', error);
			}
			throw error;
		}
	};
}
