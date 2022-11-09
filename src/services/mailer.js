"use strict";

const nodemailer = require("nodemailer");

require('dotenv').config();

const Utilities = require('~utilities/file');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_SMTP_USERNAME,
      pass: process.env.MAIL_SMTP_PASSWORD
    },
    tls: {rejectUnauthorized: false}
});


class Mailer{

    constructor(){
        this.Mail = {text : ""};
    }

    from(from){
        this.Mail.from = from;
        return this;
    }


    subject(subject){
        this.Mail.subject = subject;
        return this;
    }


    to(recipient){
        this.Mail.to = recipient;
        return this;
    }

    text(text){
        this.Mail.text = text;
        return this;
    }

    template(template){
        this.Mail.html = Utilities.loadTemplate(template);
        return this;
    }

    async send(){
        return await transporter.sendMail(this.Mail);
    }

    
}

module.exports = () => new Mailer();

