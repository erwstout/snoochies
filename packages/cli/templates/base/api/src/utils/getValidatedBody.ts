import type { Request } from 'express';
import type { z } from 'zod';

export function getValidatedBody<T extends z.ZodSchema>(req: Request): z.infer<T> {
  return (req as Request & { validatedBody: z.infer<T> }).validatedBody;
}
