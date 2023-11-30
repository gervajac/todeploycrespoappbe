import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.WORD,
    },
});

transporter.verify((err, success) => {
    err
        ? console.log(err)
        : console.log("Conexión con servidor establecida: ${success}");
});

const sendActivateEmailToken = (email, token) => {
    const mailOptions = {
        from: "concursocrespoapp@gmail.com",
        to: email,
        subject: "Activación de Cuenta CrespoApp",
        text: `Para activar tu cuenta, haz clic en el siguiente enlace: http://localhost:3000/activar-cuenta/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el correo de activación:", error);
        } else {
            console.log("Correo de activación enviado:", info.response);
        }
    });
};

const sendRestorePasswordToken = (email, token) => {
    const mailOptions = {
        from: "concursocrespoapp@gmail.com",
        to: email,
        subject: "Restauración de contraseña CrespoApp",
        text: `Para cambiar la contraseña, haz clic en el siguiente enlace: http://localhost:3000/restaurar-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(
                "Error al enviar el correo de cambio de contraseña:",
                error
            );
        } else {
            console.log(
                "Correo de restauración de contraseña enviado:",
                info.response
            );
        }
    });
};
export default transporter;
export { sendActivateEmailToken, sendRestorePasswordToken };
