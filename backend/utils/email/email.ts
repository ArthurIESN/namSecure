import { transporter } from './transporter.js';
import { SendMailOptions } from 'nodemailer';

//@todo check for htmlContent type !!!IMPORTANT
export async function sendEmail(to: string, subject: string, text: string | undefined, html: string | undefined): Promise<void>
{
    const mailOptions: SendMailOptions =
        {
            from: `${process.env.SMTP_MAIL_FROM_NAME} <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html
        };

    console.info("Sending email to", to, "with subject", subject);

    try
    {
        await transporter.sendMail(mailOptions);
        console.info("Email has been sent to", to);
    }
    catch(error: unknown)
    {
        console.error("Error sending email to", to, ":", error);
        throw error;
    }
}