const router = require('express').Router();
const bcrypt = require('bcrypt');

const generateAccessToken = require('../utils/generateAccessToken')
const generateRefreshToken = require('../utils/generateResfresToken')
const isAuthenticateWithToken = require('../utils/isAuthenticateWithToken')
const generateTokenConfirmation = require('../utils/generateTokenConfirmation')
const sendEmail = require('../utils/sendMail')

// Prisma run
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.post('/login', async (req, res, next) => {

  try{

    const {email, password} = req.body
    const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
    })

    if(!user){
        res.status(401).send({message : "Cet utilisateur n'existe pas"})
        return
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Email ou mot de passe incorrect' });

    if(user.isConfirm==false){
      res.status(403).send({message : "Veuillez confirmer votre compte"})
      return
    }
    
    const data = {
      id : user.id,
      email : user.email,
      name :user.name,
      admin : user.admin,
    }

    const accessToken = generateAccessToken(data)
    const refreshToken = generateRefreshToken(data);

    res.json({accessToken,refreshToken })

  }catch(error){

    next(error)

  }
});

router.post('/signup', async(req, res, next)=>{
  try{

    const {name, email, password} = req.body
    const userExist = await prisma.user.findUnique({
        where: {
          email: email,
        },
    })
    const hashedPassword = await bcrypt.hash(password, 10);

    if(userExist){
      res.status(401).send({message : "Cet utilisateur existe déjà"})
      return
    }
    const token = generateTokenConfirmation()
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password : hashedPassword,
        isConfirm : false,
        token : token
      },
    })


    sendEmail(email, "Email de confirmation",`<p>Merci d'avoir crée un compte chez nous veuillez confirmer votre en cliquant sur ce lien <a href='http://localhost:3000/api/auth/confirmation/${token}'>cliquez ici</a></p>`)
    .then(response=> res.json({data : user, message:"Le compte a été crée avec succès veuillez vérifier vos email pour confirmer"}))
    .catch(error=> res.status(500).send({message : error.message}))
    

  }catch(error){
    next(error)
  }
})

router.get('/me', isAuthenticateWithToken, async(req, res, next)=>{
  try{
    res.send(req.user)
  }catch(error){
    next(error)
  }
})

router.get('/confirmation/:token', async(req, res, next)=>{

  const {token} = req.params

  try{
    const user = await prisma.user.findMany({where : { token: token }})

    if (!user[0]) {
        return res.status(404).json({ message: 'Invalid token' });
    }

    await prisma.user.update({
      where: {
          id: user[0].id
        },
        data: {
            isConfirm: true,
            token: null
        }
    });

    return res.status(200).json({ message: 'Email confirmed' })

  }catch(error){

    next(error)

  }
})

router.post("/refreshToken", (req, res)=>{

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    // TODO : check en bdd que le user a toujours les droit et qu'il existe toujours

    const userExist = prisma.user.findUnique({
        where: {
          email: user.email,
        },
    })

    if(!userExist){
        res.status(401).send({message : "Cet utilisateur n'existe pas"})
        return
    }

    delete user.iat;
    delete user.exp;

    const refreshedToken = generateAccessToken(user);
    res.send({
      accessToken: refreshedToken,
    });

  });
})

router.post("/forgot-password", async(req, res, next)=>{

  const {email} = req.body

  try {
    
    const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
    })

    if(!user) {
      res.status(401).send({message : "Cet utilisateur n'existe pas"})
      return
    }

    const token = generateTokenConfirmation()
    const curentTime_one_hour = Date.now() + 3600000;
    const tokenExpiration = new Date(curentTime_one_hour)

    await prisma.user.update({
      where: {
          id: user.id
        },
        data: {
            token : token,
            tokenExpiration : tokenExpiration
        }
    });

    sendEmail(email, "Reinitialisation de mot de passe !",`<p>Changer de mot de passe en cliqautn sur ce lien <a href='http://localhost:3000/api/auth/reset-password/${token}'>cliquez ici</a></p>`)
    .then(response=> res.json({message:"Une email de reinitialisation de mot de passe vous a été envoyé !"}))
    .catch(error=> res.status(500).send({message : error.message}))

  }catch(error){
    next(error)
  }
  
})

router.post('/reset-password/:token', async(req, res, next)=>{

  const { password } = req.body;
  const {token} = req.params;

  try{
    // check if token exist
    const user = await prisma.user.findMany({where : { token: token }})

    if (!user[0]) {
      return res.status(404).json({ message: 'Invalid token' });
    }

    const expireDate = new Date(user[0].tokenExpiration).getTime()
    const curentTime_one_hour = Date.now() 

    if(curentTime_one_hour>expireDate){
      return res.status(404).json({ message: 'Token expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: {
          id: user[0].id
        },
        data: {
            token : null,
            tokenExpiration : null
        }
    });

    res.json({
      message : "Vous vénez de reinitialiser votre mot de passe veuillez vous connecter !"
    })

  }catch(error){
    next(error)
  }

})


module.exports = router;