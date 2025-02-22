import nodemailer from 'nodemailer';

const EMAIL_USERNAME = 'dragonrideshare@gmail.com';
const APP_PASSWORD = 'vhlj svsj ehdx awzz';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USERNAME,
        pass: APP_PASSWORD
    }
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${process.env.BASE_URL}/verify?token=${token}`;
    const mailOptions = {
        from: EMAIL_USERNAME,
        to,
        subject: 'Dragon Rideshare - Verify Your Email',
        html: `
            <h2>Verify Your Email</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <p>This link will expire in 24 hours.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email");
    }
}