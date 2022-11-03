import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatarUrl: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Pool 1',
            code: 'bol123',
            ownerId: user.id,
            participants:{create: {userId: user.id}}
        }
    })

    await prisma.game.create({
        data: {
            date:'2022-11-05T12:00:00.452Z',
            firstTeamCountryCode: 'DE',
            SecondTeamCountryCode: 'BR',
        }
    })
    await prisma.game.create({
        data: {
            date:'2022-11-03T12:00:00.452Z',
            firstTeamCountryCode: 'BR',
            SecondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,
                    participants:{connect:{
                        userId_poolId: {
                            userId: user.id,
                            poolId: pool.id
                    }
                }}
            }
        }
    }})

}

main()