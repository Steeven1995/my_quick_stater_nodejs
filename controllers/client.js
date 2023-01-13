const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const getCompany = require('../utils/getcompany')

class ClientController {
    
    async create(req, res, next) {

        const { name, deliveryAddress, bp, city, country, phone, email } = req.body

        try{

            const companyId  = await getCompany(req.user.id)

            const client = await prisma.client.create({
                data: {
                    name, deliveryAddress, bp,city, country, phone, email,
                    company: {
                        connect: { id: companyId.id }
                    }
                }
            })

            res.json({success: true, data : client})

        }catch(error){

            next(error)

        }

    }

    async update(req, res, next) {
        const { name, deliveryAddress, bp, city, country, phone, email } = req.body
        const { clientId } = req.params
        try{
            const client = await prisma.client.update({
                where: { id : clientId },
                data: { name, deliveryAddress, bp, city, country, phone, email  },
            })

            res.json({success: true, data : client})

        }catch(error){

            next(error)

        }

    }

    async findMany(req, res, next) {

        try{
            const companyId  = await getCompany(req.user.id)
            
            const clients = await prisma.client.findMany({
                where: {
                    company: {
                        id: companyId.id
                    }
                }
            })

            res.json({success: true, data : clients})

        }catch(error){

            next(error)

        }

    }

    async findOne(req, res, next) {

        const { clientId } = req.params
        try{
            const client = await prisma.client.findUnique({
                where: {
                    id: clientId
                },
                include: { invoices: true },
            })
            res.json({success: true, data : client})
        }catch(error){
            next(error)
        }
    }
    
    async delete(req, res, next) {

        const { clientId } = req.params

        try{

            const companyId  = await getCompany(req.user.id)
            const client = await prisma.client.delete({
                where: {
                    id: clientId,
                    company: {
                        id: companyId.id
                    }
                }
            })

            res.json({success: true, message : "Client supprimé"})

        }catch(error){

            next(error)

        }
    }

}

module.exports = new ClientController()
