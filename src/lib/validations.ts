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

export const CharityIdSchema = z.object({
  id: z.string().uuid('Invalid charity ID')
});

export const CharityPreferenceSchema = z.object({
  charity_id: z.string().uuid('Invalid charity ID'),
  contribution_percentage: z.number().min(10, 'Contribution percentage must be at least 10%').max(100, 'Contribution percentage cannot exceed 100%')
});

export type ScoreFormData = z.infer<typeof ScoreSchema>;
export type ScoreIdData = z.infer<typeof ScoreIdSchema>;
export type PlanData = z.infer<typeof PlanSchema>;
export type CharityIdData = z.infer<typeof CharityIdSchema>;
export type CharityPreferenceData = z.infer<typeof CharityPreferenceSchema>;
