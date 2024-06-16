const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Load email templates
const presets = {
  verify: fs.readFileSync(path.join(__dirname, "../email/verification.html"), "utf8"),
};

// QueueItem class to represent an email item in the queue
class QueueItem {
  constructor(to, subject, html) {
    this.to = to;
    this.subject = subject;
    this.html = html;
  }
}

// Sender class to handle the email sending logic
class Sender {
  constructor() {
    this.queue = [];
    this.queueRunning = false;
    this.email = process.env.EMAIL;
    this.password = process.env.EMAIL_PASSWORD;

    // Create transporter object using nodemailer
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.email,
        pass: this.password,
      },
    });

    // Verify the transporter configuration
    this.transporter.verify((error) => {
      if (error) {
        console.error("Error verifying transporter:", error);
      } else {
        console.log("Server is ready to take messages");
      }
    });
  }

  // Add an email to the queue and start processing if not already running
  addToQueue(to, subject, html) {
    this.queue.push(new QueueItem(to, subject, html));
    if (!this.queueRunning) {
      this.queueRunning = true;
      this.sendNext();
    }
  }

  // Send the next email in the queue
  async sendNext() {
    if (this.queue.length === 0) {
      this.queueRunning = false;
      return;
    }

    const item = this.queue.shift();
    await this.sendEmail(item.to, item.subject, item.html);
    this.sendNext();
  }

  // Send an email using the transporter
  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: this.email,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

// Create an instance of the Sender class
const sender = new Sender();

// Function to send a verification email
const sendVerificationEmail = (to, code, username) => {
  const url = `${process.env.URL || "http://localhost:3000"}/email/verify/${code}`;
  const emailContent = presets.verify
    .replaceAll("{{url}}", url)
    .replaceAll("{{name}}", username);

  sender.addToQueue(to, "Verify your email", emailContent);
};

module.exports = {
  sender,
  presets,
  sendVerificationEmail,
};

// Log information about the email utility initialization
console.log("-------------------");
console.log("Email utils loaded");
console.log("Email: " + sender.email);
console.log("-------------------");
