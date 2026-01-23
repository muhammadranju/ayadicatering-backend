import { z } from 'zod';

const createCategoryValidation = z.object({
  body: z.object({
    name: z.string().describe('Name is required'),
    nameArabic: z.string().describe('NameArabic is required'),
    image: z.string().optional(),
  }),
});

export { createCategoryValidation };
