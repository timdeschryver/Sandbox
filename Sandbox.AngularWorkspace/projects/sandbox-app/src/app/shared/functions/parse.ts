import * as z from 'zod/mini';

export function parse<TSchema extends z.z.core.$ZodType>(schema: TSchema): (raw: unknown) => z.z.core.output<TSchema> {
	return (raw: unknown): z.z.core.output<TSchema> => {
		try {
			return z.parse(schema, raw);
		} catch (error) {
			if (ngDevMode) {
				console.error('Validation error:', error);
			}
			throw error;
		}
	};
}

export function parseCollection<TSchema extends z.z.core.$ZodType>(
	schema: TSchema,
): (raw: unknown) => z.z.core.output<TSchema>[] {
	return (raw: unknown): z.z.core.output<TSchema>[] => {
		try {
			return z.parse(z.array(schema), raw);
		} catch (error) {
			if (ngDevMode) {
				console.error('Validation error:', error);
			}
			throw error;
		}
	};
}
