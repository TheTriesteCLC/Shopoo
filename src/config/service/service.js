const jwt = require("jsonwebtoken");
const nodeMailer = require('nodemailer');

const emailPass='dfyu bknp umnn oyyg';
const emailAddr='anhthinhphuoc@gmail.com';
const secretKey = '440457';

exports.getTransport = () => nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: emailAddr,
        pass: emailPass
    }
  });

exports.generateToken = (email) => {
    // const payload = {
    //   email: email,
    //   expirationDate: expirationDate
    // }

    return jwt.sign( email , secretKey, { expiresIn: '1h' });
};

exports.getMailOptions = (email, link) => {
    let body = `
    <h2>Hey ${email}</h2>
    <p>Here's the special magic link you requested:</p>
    <p>${link}</p>
    <p>Please note that for added security this link becomes invalid after 45 minutes</p>
    <p>Stay Jiggy</p>`;
  
    return {
      body,
      subject: "Urgent: Super Secret Magic Link",
      to: email,
      html: body,
      from: emailAddr,
    };
  };