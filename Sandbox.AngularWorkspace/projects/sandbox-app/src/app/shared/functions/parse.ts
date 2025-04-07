import * as v from 'valibot';

export function parse<const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	schema: TSchema,
): (raw: unknown) => v.InferOutput<TSchema> {
	return (raw: unknown): v.InferOutput<TSchema> => {
		try {
			return v.parse(schema, raw);
		} catch (error) {
			if (ngDevMode) {
				console.error('Validation error:', error);
			}
			throw error;
		}
	};
}

export function parseCollection<const TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
	schema: TSchema,
): (raw: unknown) => v.InferOutput<TSchema>[] {
	return (raw: unknown): v.InferOutput<TSchema>[] => {
		try {
			return v.parse(v.array(schema), raw);
		} catch (error) {
			if (ngDevMode) {
				console.error('Validation error:', error);
			}
			throw error;
		}
	};
}
