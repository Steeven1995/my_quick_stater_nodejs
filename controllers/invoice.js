
const {PrismaClient} = require('@prisma/client')
const puppeteer = require('puppeteer');
const prisma = new PrismaClient()
const getCompany = require('../utils/getcompany')
const ejs = require('ejs');
const sendEmail = require('../utils/sendMail')



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

    async download(req, res, next) {

        const invoiceId = req.params.invoiceId

        try{


            const invoice = await prisma.invoice.findUnique({
                where: {
                    id: invoiceId
                },
                include: { client: true , company : true}
            })

            if(!invoice){
                res.status(404).json({success:false, message:"Page introuvale"})
            }

        
            invoice['products'] = JSON.parse(invoice.products)

            let totalPriceHt = invoice.products.reduce((acc, val) => acc + (val.prix_unitaire*val.quantity), 0);

            invoice['totalPriceHt'] = totalPriceHt;
            invoice['totalTva'] = (totalPriceHt/100) * invoice.tva

            const data = invoice
            
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(await ejs.renderFile('views/invoice.ejs',  data));
            const pdf = await page.pdf({ format: 'A4' });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
            res.status(200).send(pdf);

            await browser.close();

        }catch(error){
            next(error)
        }  
    }

    async sendEmail(req, res, next){

        const {emailClient, invoiceId, title} = req.body

        try{
            const company  = await getCompany(req.user.id)

            sendEmail(emailClient, `Facture de ${company.name} : ${title}`,`<p>Vous pouvez télécharger votre facture en cliquant sur le lient suivant <a href='http://localhost:3000/api/invoice/download/${invoiceId}'>cliquez ici</a></p>`)
            .then(response=> res.json({success : true, message:"Le compte a été crée avec succès veuillez vérifier vos email pour confirmer"}))
            .catch(error=> res.status(500).send({message : error.message}))

        }catch(error){

        }
    }

}

module.exports = new InvoiceController()
