import { z } from 'zod';

const createFaqValidation = z.object({
  question: z.string(),
  questionArabic: z.string(),
  answer: z.string(),
  answerArabic: z.string(),
});

export { createFaqValidation };
