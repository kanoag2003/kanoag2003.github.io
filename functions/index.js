const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();


// configure gmail settings and how it looks 
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: "tattedbycam@gmail.com",
    pass:""
  }
});
