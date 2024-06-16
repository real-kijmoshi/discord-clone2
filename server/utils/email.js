const nodemailer = require('nodemailer');
const fs = require('fs');

const presets = {
    verify: fs.readFileSync(__dirname + '/../email/verification.html', 'utf8'),
}

class QueueItem {
    constructor(to, subject, html) {
        this.to = to;
        this.subject = subject;
        this.html = html;
    }
}

class Sender {
    constructor() {
        this.queue=[];
        this.queueRunning = false;


        this.email = process.env.EMAIL;
        this.password = process.env.EMAIL_PASSWORD;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.email,
                pass: this.password
            }
        });

        this.transporter.verify((error, success) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take messages');
            }
        });
    }

    addToQueue(to, subject, html) {
        this.queue.push(new QueueItem(to, subject, html));
        
        if (!this.queueRunning) {
            this.queueRunning = true;
            this.sendNext();
        }
    }

    async sendNext() {
        if (this.queue.length === 0) {
            this.queueRunning = false;
            return;
        }

        const item = this.queue.shift();
        await this.sendEmail(item.to, item.subject, item.html);
        this.sendNext();
    }

    async sendEmail(to, subject, html) {
        const mailOptions = {
            from: this.email,
            to,
            subject,
            html
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }
    }
}

const sender = new Sender();

module.exports = {
    sender,
    presets
};


console.log("-------------------")
console.log("Email utils loaded")
console.log("email: " + sender.email)
console.log("-------------------")