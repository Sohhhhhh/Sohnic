import pug from 'pug';
import env from '../config/env';
import { convert } from 'html-to-text';
import { transporter } from '../config/nodemailer';

const sendEmail = async (
  link: string,
  email: string,
  subject: string,
  template: string,
  token?: string,
) => {
  try {
    const html = pug.renderFile(`${__dirname}/../templates/${template}.pug`, {
      link,
      token,
    });

    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject,
      html,
      text: convert(html, {
        wordwrap: false,
      }),
    });

    console.log(`Email sent successfully.\nid: ${info.messageId}\n${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error}`);
  }
};

export const sendSetPasswordEmail = async (email: string, token: string) => {
  await sendEmail(env.BASE_URL, email, 'Sohnic', 'setPassword', token);
};
