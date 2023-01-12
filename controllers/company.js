const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const cloudinary = require('../utils/cloudinary');

class CompanyController {

  async create(req, res, next) {

    const { name, description, city, country, address, bp, phone, email } = req.body
    const logo = req.files.logo
    const userId = req.user.id

    try {

        const result = await cloudinary.uploader.upload(logo.tempFilePath, {
            folder: "company",
        })
    
        const company = await prisma.company.create({
            data: {
                name,
                description,
                phone, 
                email,
                logo_url :result.url, 
                logo_public_id:result.public_id,
                city,
                country,
                address,
                bp,
                owner: {
                    connect: { id: userId }
                }
            }
        })
        res.json(company)

    } catch (error) {
        next(error);
    }
  }

  async findOne(req, res,next) {
    const userId = req.user.id
    try{

        const company = await prisma.company.findUnique({ where: { ownerId : userId } })

        if(!company){
            res.status(401).send({message : "Aucune entreprise creer avec cet utilisateur"})
            return
        }

        res.json({data : company})

    }catch(error){
        next(error)
    }
   
  }

  async update(req, res, next) {

    const userId = req.user.id

    try{

        const { name, description, city, country, address, bp, phone, email } = req.body
        
        if(req.files){
            const {logo} = req.files
            const result = await cloudinary.uploader.upload(logo.tempFilePath, {
                folder: "company",
            })
            const company = await prisma.company.update({
                where: { ownerId : userId },
                data: { name, description, logo_url :result.url, 
                    logo_public_id:result.public_id, city, country, address, bp },
              })
            res.json(company)
            return
        }

        const company = await prisma.company.update({
            where: { ownerId : userId },
            data: { name, description, city, country, address, bp, phone, email },
          })
        res.json(company)

    }catch(error){
        next(error)
    }
    

  }

  async delete(req, res, next) {
    const userId = req.user.id
    try{
        const company = await prisma.company.delete({ where: { ownerId : userId } })
        res.json(company)
    }catch(error){
        next(error)
    }
  }

}

module.exports = new CompanyController()
