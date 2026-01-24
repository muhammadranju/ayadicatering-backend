import { z } from 'zod';

const createBuildPackageValidation = z.object({
  body: z.object({
    platterName: z.string().min(1, 'Platter name is required'),
    platterNameArabic: z.string().min(1, 'Platter name Arabic is required'),
    description: z.string().min(1, 'Description is required'),
    descriptionArabic: z.string().min(1, 'Description Arabic is required'),
    image: z.string().optional(),
    price: z.string().min(1, 'Price is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
  }),
});

export { createBuildPackageValidation };
