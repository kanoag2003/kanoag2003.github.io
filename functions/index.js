require('dotenv').config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();


// configure gmail settings and how it looks 
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmailOnNewForm = functions.firestore.document('clients/{docId}').onCreate(async (snap,context) => {
  const data = snap.data(); 
  const clientEmail = data.email; 
  const mailOptions = {
    from: clientEmail,
    replyTo: clientEmail, 
    to: process.env.EMAIL_USER,
    subject: "New Tattoo Consent Submission",
    html: `
    <h3>New Tattoo Consent Form Submitted</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Birth Date:</strong> ${data.birthDate}</p>
        <p><strong>Phone Number:</strong> ${data.phoneNumber}</p>
        <p><strong>ID Number:</strong> ${data.idNumber}</p>
        <p><strong>Emergency Contact:</strong> ${data.emergencyContact.name} (${data.emergencyContact.relationship}) - ${data.emergencyContact.phoneNumber}</p>
        <p><strong>Consent:</strong> Under Influence: ${data.consent.underInfluence}, At Least 18: ${data.consent.atLeast18}</p>
        <p><strong>Explanation:</strong> ${data.explanation || "None"}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Signature:</strong> <img src="${data.signaturer}" alt="Signature"/></p>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent!"); 
   } catch (error) {
    console.log("Error:", error);
   }
});
