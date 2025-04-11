import * as z from '@zod/mini';

export const CustomerId = z.number();
export type CustomerId = z.infer<typeof CustomerId>;

export const CustomerAddressId = z.number();
export type CustomerAddressId = z.infer<typeof CustomerAddressId>;
