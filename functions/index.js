const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { ExportBundleInfo } = require("firebase-functions/v1/analytics");

admin.initializeApp();


// configure gmail settings and how it looks 
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: "tattedbycamie@gmail.com",
    pass:"pjim fwca hopi xuzv"
  }
});

exports.sendEmailOnNewForm = functions.firestore.document('clients/{docId}').onCreate(async (snap,context) => {
  const data = snap.data(); 
  const clientEmail = data.email; 
  const mailOptions = {
    from: clientEmail,
    replyTo: clientEmail, 
    to: "tattedbycamie@gmail.com",
    subject: "New Tattoo Consent Submission",
    html: `
    
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent!"); 
   } catch (error) {
    console.log("Error:", error);
   }
});
