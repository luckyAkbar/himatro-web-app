require('dotenv').config()

const nodemailer = require('nodemailer')
const { getTimeStamp } = require('../util/getTimeStamp')

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

const generateErrorEmail = async (errorMessage, extraInformation= '') => {
    const message = {
        from: 'lucky.pengelolawebhimatro@gmail.com',
        to: 'lucky.akbar105619@students.unila.ac.id',
        subject: 'Severe Error Has Happen',
        html: `
            <h1>Severe Error Need to be Review</h1>
            <p>This incedent happen on ${getTimeStamp()}</p>
            <p>Error Message: ${errorMessage}</p>
            <p>Other information: ${String(extraInformation)}
        `
    }

    try {
        await sendEmail(message)
    } catch (e) {
        console.log('email functionality broken', e)
    }
}

module.exports = {
    sendEmail,
    generateErrorEmail
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