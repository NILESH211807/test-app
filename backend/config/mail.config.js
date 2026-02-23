const nodemailer = require("nodemailer");

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

const mailConfig = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

module.exports = mailConfig;
