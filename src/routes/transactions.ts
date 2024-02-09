import { FastifyInstance } from "fastify"
import { KnexDb } from "../database"
import crypto from 'node:crypto'
import { z } from 'zod'
import { checkSessionId } from "../middlewares/checkSessionId"

export async function transactionRoute(app: FastifyInstance) {
    app.post('/', async (req, res) => {
        const createTransactionSchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionSchema.parse(req.body)

        let sessionId = req.cookies.sessionId
        if(!sessionId) {
            sessionId = crypto.randomUUID()

            res.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }

        await KnexDb('transactions').insert({
            id: crypto.randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_Id: sessionId,
        })

        return res.status(201).send('Transação criada com sucesso')
    })

    app.get('/', {preHandler: [checkSessionId]},async (req) => {
        const { sessionId } = req.cookies
        const transactions = await KnexDb('transactions').where('session_Id', sessionId).select('*')

        return { transactions }
    })


    app.get('/:id',  {preHandler: [checkSessionId]},async (req) => {
        const getTransactionSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionSchema.parse(req.params)

        const transaction = KnexDb('transactions').where('id', id).first()

        return { transaction }
    })

    app.get('/summary',  {preHandler: [checkSessionId]},async () => {
        const summary = await KnexDb('transactions').sum('amount', { as: 'amount'}).first()

        return { summary }
    })
}