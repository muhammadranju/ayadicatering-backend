import { z } from 'zod';

const initiatePaymentZodSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().optional(),
    description: z.string().optional(),
    customerDetails: z.object({
      //   name: z.string({ required_error: 'Name is required' }),
      //   email: z.string({ required_error: 'Email is required' }).email(),
      //   phone: z.string({ required_error: 'Phone is required' }),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zip: z.string().optional(),
    }),
  }),
});

export const PaymentValidation = {
  initiatePaymentZodSchema,
};
