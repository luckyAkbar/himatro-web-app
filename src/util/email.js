require('dotenv').config();

const nodemailer = require('nodemailer');
const { getTimeStamp } = require('./getTimeStamp');
const { formatToLowercase } = require('./formatter');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

const sendEmail = async (message) => {
  try {
    await transport.sendMail(message);
  } catch (e) {
    throw new Error(`Failed to send message ${message} to ${message.to}`);
  }
};

const generateErrorEmail = async (errorMessage, extraInformation = '') => {
  const message = {
    from: 'lucky.pengelolawebhimatro@gmail.com',
    to: 'lucky.akbar105619@students.unila.ac.id',
    subject: 'Severe Error Has Happen',
    html: `
            <h1>Severe Error Need to be Review</h1>
            <p>This incedent happen on ${getTimeStamp()}</p>
            <p>Error Message: ${errorMessage}</p>
            <p>Other information: ${String(extraInformation)}
        `,
  };

  try {
    await sendEmail(message);
  } catch (e) {
    console.log('email functionality broken', e);
  }
};

const sendForgotPasswordEmailNotif = async (targetEmail, tokenUUID) => {
  const message = {
    from: 'lucky.pengelolawebhimatro@gmail.com',
    to: formatToLowercase(targetEmail),
    subject: `Change Password for ${formatToLowercase(targetEmail)}`,
    html: `
      <h2 style="text-align:center;">Hello, ${formatToLowercase(targetEmail)}</h2>
      <p>Recently, someone claim that you've forgot your password on Himatro Website. <strong>If you aren't issuing this feature</strong>, you can simply <strong>ignore this email</strong> completely, and nothing will happen on your account. But, if you really forgot your password, you can simply click this link to continue on change your forgotten password</p>
      <a target="_blank" href="${process.env.SERVER_URL}/token/forgot-password?tokenId=${tokenUUID}">Link</a>
      <p>This token will expired within 5 minutes, after that, you will not be able to use that anymore</p>
      <p>One quick thing before you leave, have you mention something that needed to be improved from this web app? Or, do you want to join us in the developers team? Let me know all your thought about this app by simply replying / send us an email. <strong>EVERY SINGLE CONTRIBUTION WILL BE MUCH VALUED</strong></p>
      <br>
      <p>Regards,</p>
      <h3>Lucky Akbar</h3>
      <p>Head of Developers @Himatro Web App developers team</p>
    `,
  };

  try {
    await sendEmail(message);
  } catch (e) {
    throw new Error('Failed to send email for forgot password');
  }
};

const sendLoginCredentialViaEmail = async (password, { email }) => {
  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Login Credentials for Himatro Web App',
    html: `<h2 style="text-align:center;">Himatro Web App Login Credentials</h2>
            <p>Thanks for being patience and also thanks for sparing some time to fill out the previous form to get your login credentials.</p>
            <p>Just a quick reminder, this credentials <strong>SHOULD NEVER SHARED TO ANYONE ELSE</strong> because it's your secret, and it's your responsibility to keep it as secure as possible.</p>
            <p>This is your credentials: </p>
            <ul>
                <li>email: ${formatToLowercase(email)}</li>
                <li>password: ${password}</li>
            </ul>
            <p>One quick thing before you leave, have you mention something that needed to be improved from this web app? Or, do you want to join us in the developers team? Let me know all your thought about this app by simply replying / send us an email trough this mail. <strong>EVERY SINGLE CONTRIBUTION WILL BE MUCH VALUED</strong></p>
            <br>
            <p>Regards,</p>
            <h3>Lucky Akbar</h3>
            <p>Head of Developers @Himatro Web App developers team</p>
            `,
  };

  try {
    await sendEmail(message);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  sendEmail,
  generateErrorEmail,
  sendForgotPasswordEmailNotif,
  sendLoginCredentialViaEmail,
};
