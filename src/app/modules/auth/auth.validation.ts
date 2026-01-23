import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z.string().min(1, { message: 'Email is required' }),
    oneTimeCode: z.number({ message: 'One time code is required' }),
  }),
});

const createLoginZodSchema = z.object({
  body: z.object({
    email: z.string().min(1, { message: 'Email is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string().min(1, { message: 'Email is required' }),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, {
      message: 'Confirm Password is required',
    }),
  }),
});

const createChangePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, {
      message: 'Current Password is required',
    }),
    newPassword: z.string().min(1, { message: 'New Password is required' }),
    confirmPassword: z.string({
      message: 'Confirm Password is required',
    }),
  }),
});

export const AuthValidation = {
  createVerifyEmailZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createResetPasswordZodSchema,
  createChangePasswordZodSchema,
};
