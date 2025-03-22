const nodemailer = require("nodemailer");
const { HOST_EMAIL, APP_PASSWORD } = require("../constants/emailservice");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: HOST_EMAIL,
    pass: APP_PASSWORD,
  },
});

const sendEmailOtp = async (emailAddress, otp) => {
  try {
    if (!emailAddress || !otp) {
      return false;
    }

    await transporter.sendMail({
      from: HOST_EMAIL,
      to: emailAddress,
      subject: "Verify your E-mail Address",
      text: `The OTP for for your email address verification is ${otp}`,
    });

    return true;
  } catch (error) {
    console.log(
      "Error occured at emailServiceController's sendEmailOtp: " + error
    );
    return false;
  }
};

const sendEmail = async (emailAddress, title, content) => {
  try {
    if (!emailAddress || !title || !content) {
      return false;
    }

    await transporter.sendMail({
      from: HOST_EMAIL,
      to: emailAddress,
      subject: title,
      text: content,
    });

    return true;
  } catch (error) {
    console.log(
      "Error occured at emailServiceController's sendEmail: " + error
    );
    return false;
  }
};

module.exports = { sendEmailOtp, sendEmail };
