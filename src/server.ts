import Fastify from "fastify";
import cors from '@fastify/cors';
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';
import shortUniqueId from 'short-unique-id';

const prisma = new PrismaClient({
    log: ['query'],
});


async function bootstrap() {
    const fastify = Fastify({ logger: true });
    await fastify.register(cors,{
        origin: true,
    })


    fastify.get('/pools/count', async () =>{
        const pools = await prisma.pool.count();
        return {pools}
    });

    fastify.get('/users/count', async () =>{
        const users = await prisma.user.count();
        return {users}
    });

    fastify.get('/guesses/count', async () =>{
        const guesses = await prisma.guess.count();
        return {guesses}
    });
    
    fastify.post('/pools', async (req,res) =>{
        const createPoolBody = z.object({
            title: z.string(),
        })

        const { title } = createPoolBody.parse(req.body);

        const generate = new shortUniqueId({length: 6});
        const code = String(generate()).toUpperCase();

        await prisma.pool.create({
            data: {
                title,
                code
            }
        })

        return res.status(201).send({code});
    });
    
    
    await fastify.listen({port:3333, /*host:'0.0.0.0'*/});

}
    
bootstrap();