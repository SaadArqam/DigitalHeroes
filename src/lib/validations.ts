import { z } from 'zod';

export const ScoreSchema = z.object({
  score: z.number().min(1, 'Score must be between 1 and 45').max(45, 'Score must be between 1 and 45'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
});

export const ScoreIdSchema = z.object({
  id: z.string().uuid('Invalid score ID')
});

export const PlanSchema = z.enum(['monthly', 'yearly'], {
  errorMap: () => ({ message: 'Plan must be either monthly or yearly' })
});

export type ScoreFormData = z.infer<typeof ScoreSchema>;
export type ScoreIdData = z.infer<typeof ScoreIdSchema>;
export type PlanData = z.infer<typeof PlanSchema>;
