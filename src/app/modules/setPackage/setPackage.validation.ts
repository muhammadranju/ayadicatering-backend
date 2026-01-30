import { z } from 'zod';

const createSetPackageValidation = z.object({
  platterName: z.string(),
  platterNameArabic: z.string(),
  description: z.string(),
  descriptionArabic: z.string(),
  image: z.string(),
  items: z.array(z.string()),
  itemsArabic: z.array(z.string()),
  price: z.number(),
  person: z.number().optional(),
});

export { createSetPackageValidation };
