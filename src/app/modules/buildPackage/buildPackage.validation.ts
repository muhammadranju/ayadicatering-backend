import { z } from 'zod';

const createBuildPackageValidation = z.object({
  platterName: z.string(),
  platterNameArabic: z.string(),
  description: z.string(),
  descriptionArabic: z.string(),
  image: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  categoryId: z.string(),
});

export { createBuildPackageValidation };
