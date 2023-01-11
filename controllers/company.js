const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const cloudinary = require('../utils/cloudinary');

class CompanyController {

  async create(req, res, next) {

    const { name, description, city, country, address, bp } = req.body
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
        console.log("error");
        next(error);

    }
   
  }

}

module.exports = new CompanyController()
