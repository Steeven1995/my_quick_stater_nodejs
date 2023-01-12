const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function getCompany(userId){
    const company = await prisma.company.findUnique({ where: { ownerId : userId } })
    return company
}

module.exports = getCompany