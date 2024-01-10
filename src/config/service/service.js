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
  <h2>Hey ${email},</h2>
  <p>Here's the link to activate your account:</p>
  <p>${link}</p>
  <p>Please note that this link becomes invalid after 1 hour.</p>
  <p>Thank you for using our services.</p>`;

  return {
    body,
    subject: "Shopoo account verify",
    to: email,
    html: body,
    from: emailAddr,
  };
};

exports.verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    return { success: true, data: decodedToken };
  } catch(err) {
    return { success: false, error: err.message };
  }
}