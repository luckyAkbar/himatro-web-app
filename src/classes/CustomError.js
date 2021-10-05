const { sendEmail, generateErrorEmail } = require("../util/email");
const { getTimeStamp } = require('../util/getTimeStamp')

class CustomError extends Error{
  constructor(errorMessage, httpErrorStatus = 400) {
    super(errorMessage);
    this.message = errorMessage;
    this.httpErrorStatus = httpErrorStatus;
  }

  sendErrorResponse = (res, jsonForm = false) => {
    res.status(this.httpErrorStatus);

    if (jsonForm) {
      res.json({ errorMessage: this.errorMessage });
      return;
    }

    res.render('errorPage', {
      errorMessage: this.message
    });
  }

  notifyErrorViaEmail = async (targetEmail = 'lucky.akbar105619@students.unila.ac.id', errorMessage = this.errorMessage) => {
    const message = {
      from: 'lucky.pengelolawebhimatro@gmail.com',
      to: targetEmail,
      subject: 'Himatro Web App System has encounter an unpredicteable error',
      html: `
            <h1>${errorMessage}</h1>
            <p>This incedent happen on ${getTimeStamp()}</p>
            <p>This error potentially broke, or causing unexpected behaviour in this system. Please redo what
            you was doing, and if you keep receive this message, please consider contact system administrator
            of this website to fix the problem</p>
            <p>Alternatively, you can send an email to lucky.akbar105619@students.unila.ac.id to seek help as he is 
            the original developer of this website.</p>
        `,
    };
    
    try {
      if (this.httpErrorStatus >= 500) await generateErrorEmail(this.message);
      await sendEmail(message);  
    } catch {
      console.log(e);
    }
  }
}

module.exports = { CustomError }