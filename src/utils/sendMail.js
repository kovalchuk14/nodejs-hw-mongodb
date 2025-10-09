import nodemailer from 'nodemailer';

import { SMTP } from '../constans/index.js';
import { getEnvVar } from './getEnvVar.js';

const transportet = nodemailer.createTransport({
    host: getEnvVar(SMTP.SMTP_HOST),
    port: Number(getEnvVar(SMTP.SMTP_PORT)),
    auth: {
        user: getEnvVar(SMTP.SMTP_USER),
        pass: getEnvVar(SMTP.SMTP_PASSWORD),
    },
})

export const sendEmail = async (options) => {
    return await transportet.sendMail(options);
}
