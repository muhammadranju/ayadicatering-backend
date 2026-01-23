import { z } from 'zod';

const createCategoryValidation = z.object({
  name: z.string(),
  image: z.string(),
});

export { createCategoryValidation };
