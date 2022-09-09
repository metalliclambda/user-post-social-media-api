const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, link) => {
    try {
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "your username",
              pass: "your password"
            }
          });

        const mailOptions = {
            from: 'mehdi@mohammadi.com',
            to: email,
            subject: subject,
            html: `   <h1>Your Reset Password Link</h1>
                <h3>Click link button below and reset your password</h3>    
                <a style="text-align: center;" href="${link}"><h2>Reset Pass</h2></a>
                <h3>If you didn't register in our app, Don't click on the link.</h3>`
        };
        
        await transport.sendMail(mailOptions);

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;
