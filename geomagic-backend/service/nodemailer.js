const nodemailer = require('nodemailer');

/**
 * createTransporter
 *
 * Builds a Nodemailer transport from environment variables.
 * Credentials are never hard-coded; see .env.example.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT),
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

module.exports = { createTransporter };
