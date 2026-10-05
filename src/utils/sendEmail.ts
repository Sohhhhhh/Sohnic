import pug from 'pug';
import env from '../config/env';
import { convert } from 'html-to-text';
import { transporter } from '../config/nodemailer';
import { BranchReport } from '../types/app.types';

const sendEmail = async (
  email: string,
  subject: string,
  template: string,
  data: Record<string, unknown>,
) => {
  try {
    const html = pug.renderFile(
      `${__dirname}/../templates/${template}.pug`,
      data,
    );

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
  await sendEmail(email, 'Sohnic', 'setPassword', {
    link: env.BASE_URL,
    token,
  });
};

export const sendReportEmail = async (
  email: string,
  label: string,
  reports: BranchReport[],
) => {
  const total =
    reports.length > 1
      ? reports.reduce(
          (acc, r) => ({
            revenue: acc.revenue + r.revenue,
            cogs: acc.cogs + r.cogs,
            grossProfit: acc.grossProfit + r.grossProfit,
            expenses: acc.expenses + r.expenses,
          }),
          { revenue: 0, cogs: 0, grossProfit: 0, expenses: 0 },
        )
      : null;

  await sendEmail(email, label, 'sendReport', {
    label,
    reports,
    total,
    fmt: (n: number | string | null) => Number(n ?? 0).toFixed(2),
  });
};
