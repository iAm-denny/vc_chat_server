require("dotenv").config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
console.log("EMAIL ----------", process.env.EMAIL);
console.log("PASSWORD ----------", process.env.PASSWORD);
module.exports = {
  transporter,
};
