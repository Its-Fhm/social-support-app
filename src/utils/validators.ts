import { z } from 'zod';

export const situationSchema = z.object({
  currentFinancial: z.string().min(10, 'Please describe at least 10 characters.'),
  employmentCircumstances: z.string().min(10, 'Please describe at least 10 characters.'),
  reason: z.string().min(10, 'Please describe at least 10 characters.'),
});

export type SituationSchema = z.infer<typeof situationSchema>;
