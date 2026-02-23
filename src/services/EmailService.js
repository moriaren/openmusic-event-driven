import nodemailer from 'nodemailer';
import config from '../utils/config.js';

class EmailService {
  constructor() {
    this._transporter = nodemailer.createTransport({
      
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false, // WAJIB untuk port 587
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }
  
  async sendEmail(to, subject, text, html, attachments = []) {
    await this._transporter.sendMail({
      from: `"OpenMusic" <${config.smtp.user}>`,
      to,
      subject,
      text,
      html,
      attachments,
    });
  }
}

export default EmailService;