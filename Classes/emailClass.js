const sgMail = require("@sendgrid/mail");

class Email {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.sender = "odionjulius7@gmail.com";
    // this.sender = process.env.SENDGRID_SENDER_EMAIL;
  }

  createHtmlTemplate(data) {
    // Create an HTML email template using the provided data.
    // This can be a string of HTML code or a template engine like EJS or Handlebars.
    // Return the compiled HTML template as a string.
    return `
      <html>
        <head></head>
        <body>
          <h1>${data.subject}</h1>
          <p>${data.message}</p>
        </body>
      </html>
    `;
  }

  async sendMail(data) {
    const html = this.createHtmlTemplate(data);

    const msg = {
      to: data.to,
      from: this.sender,
      subject: data.subject,
      html: html,
    };

    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Email;

{
  /* <div>
    <p>Hello ${newData.firstName}, your new account has been created with the following login details:<br /> Email: ${newData.email}, Password: ${newData.password}</p>
    <a href="https://client.thekeona.com/">Click here to login</a>
    </div> */
}
