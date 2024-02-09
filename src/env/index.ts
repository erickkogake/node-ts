import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.parse(process.env)

if (!_env) {
  console.error('😒 insira uma string válida')
  throw new Error('insira uma string válida')
}

export const env = _env
