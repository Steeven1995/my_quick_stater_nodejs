const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const getCompany = require('../utils/getcompany')

class InvoiceController {
    
    async create(req, res, next) {

        const { title, tva, amount, date, statut, products, clientId } = req.body

        try{

            const company  = await getCompany(req.user.id)

            const newInvoice = await prisma.invoice.create({

                data: {
                    title, tva : Number(tva), amount : Number(amount), date, statut, products : JSON.stringify(products),
                    client: {
                        connect: {
                            id: clientId,
                        }
                    },
                    company : {
                        connect : {
                            id : company.id
                        }
                    }
                }
            })

            res.json({success:true, data : newInvoice})

        }catch(error){

            next(error)

        }

    }

    async findMany(req, res, next) {

        try{

            const company  = await getCompany(req.user.id)

            const allInvoice = await prisma.invoice.findMany({
                where: {
                    company: {
                        id: company.id
                    }
                },
                include: { client: true }
            })

            res.json({success:true, data : allInvoice})

        }catch(error){

            next(error)

        }
    }

    async findOne(req, res, next) {

        const { invoiceId } = req.params

        try{
        
            const invoice = await prisma.invoice.findUnique({
                where: {
                    id: invoiceId
                },
                include: { client: true }
            })

            res.json({success:true, data : invoice})

        }catch(error){

            next(error)

        }

    }

    async update(req, res, next) {

        const { title, tva, amount, date, statut, products, clientId } = req.body

        const { invoiceId } = req.params

        try{
            const updatedInvoice = await prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    client: {
                        connect: {
                            id: clientId
                        }
                    },
                    title, tva : Number(tva), amount : Number(amount), date, statut, products : JSON.stringify(products)
                }
            })

            res.json({success: true, data : updatedInvoice})

        }catch(error){

            next(error)

        }

    }

    async delete(req, res, next) {

        const { invoiceId } = req.params

        try{            
            await prisma.invoice.delete({
                where: {
                    id: invoiceId,
                }
            })
            res.json({success: true, message : "Facture supprimée"})
        }catch(error){

            next(error)

        }
    }

}

module.exports = new InvoiceController()
