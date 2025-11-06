const nodemailer = require("nodemailer")
// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST ,
    port: process.env.NODEMAILER_PORT ,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD 
    }
  });

module.exports = transport