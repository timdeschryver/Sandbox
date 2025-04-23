import * as z from '@zod/mini';

export const CustomerId = z.uuid();
export type CustomerId = z.infer<typeof CustomerId>;

export const CustomerAddressId = z.uuid();
export type CustomerAddressId = z.infer<typeof CustomerAddressId>;
