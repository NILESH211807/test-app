const mailConfig = require("../config/mail.config");

module.exports.sendMail = async (sendTo, subject, message) => {
  const info = await mailConfig.sendMail({
    from: "nileshkumar0815@gmail.com",
    to: sendTo,
    subject: subject,
    text: message,
  });

  console.log("Message sent:", info.messageId);
};
