import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourgmail@gmail.com',
        pass: 'mook hven eqqw ojzw'
    },
});

const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: 'vj92@drexel.edu',
    subject: 'Test Email via Gmail',
    text: 'Hello Vatsal, this is a test email sent through Gmail!',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.error('Error occurred:', error);
    }
    console.log('Email sent:', info.response);
});
