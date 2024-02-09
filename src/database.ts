import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not found')

export const configDb: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    extension: 'ts',
  },
}

export const KnexDb = setupKnex(configDb)
