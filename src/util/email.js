require('dotenv').config()

const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD_EMAIL
    }
})

const sendEmail = async (message) => {
    try {
        await transport.sendMail(message)
    } catch(e) {
        console.log(e)
        throw new Error(`Failed to send message ${message} to ${message.to}`)
    }
}

module.exports = {
    sendEmail
}

// const message = {
//     from: 'lucky.pengelolawebhimatro@gmail.com',
//     to: 'm248r4231@dicoding.org',
//     subject: 'test subject',
//     html: '<h1>halo gaes hehe</h1>'
// }

// transport.sendMail(message, (err, info) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(info);
//     }
// })