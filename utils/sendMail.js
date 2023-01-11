const nodemailer = require('nodemailer');

function sendEmail(to, subject, message){

    return new Promise((resolve, reject) =>{
      var transporter = nodemailer.createTransport({
        service : "gmail",
        secure: true,
        auth : {
          user : process.env.USER_SENDER_MAIL,
          pass : process.env.USER_PASS
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
  
      })

      const mail_configs = {
        from : process.env.USER_SENDER_MAIL,
        to : to,
        subject : subject,
        html : message
      }
  
      transporter.sendMail(mail_configs, function(error, info){
        if(error){
          console.log(error)
          return reject({message : `An error has occured`})
        }
        return resolve({message : "Email send succesfuly"})
      })
  
    })
  }

  module.exports = sendEmail