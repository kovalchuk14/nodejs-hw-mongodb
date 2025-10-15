import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UserCollection } from "../db/models/user.js";
import { FIFTEEN_MINUTES,SMTP,TEMPLATES_DIR,THIRTY_DAYS } from '../constans/index.js';
import { SessionCollection } from '../db/models/session.js';
import jwt from "jsonwebtoken";
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    }
}

export const registerUser = async (payload) => {
    const user = await UserCollection.findOne({ email: payload.email });

    if (user) {
        throw createHttpError(409, 'email in use');
    }

    const ecryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UserCollection.create({
        ...payload,
        password: ecryptedPassword,
    });
}

export const loginUser = async (payload) => {
    const user = await UserCollection.findOne({
        email: payload.email,
    });
    if (!user) throw createHttpError(401, "User not found");

    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) throw createHttpError(401, "Unautorized");

    await SessionCollection.deleteOne({
        userId: user._id,
    });

    const newSession = createSession();

    return await SessionCollection.create({
        userId: user._id,
        ...newSession
    });

}

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionCollection.findOne({
        _id: sessionId,
        refreshToken,
    });
    if (!session) throw createHttpError(401, 'Session not found');
    const isSessionTokenExpired = new Date().now > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) throw createHttpError(401, 'Session token expired');

    const newSession = createSession();
    await SessionCollection.deleteOne({
        _id: sessionId,
        refreshToken,
    });

    return await SessionCollection.create({
        userId: session.userId,
        ...newSession,
    });
}

export const logoutUserSession = async ({ sessionId, refreshToken }) => {
    await SessionCollection.deleteOne({
        _id: sessionId,
        refreshToken,
    });
}

export const requestResetToken = async (email) => {
    const user = await UserCollection.findOne({email});
    if (!user) throw createHttpError(404, 'User not found');

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        getEnvVar('JWT_SECRET'),
        {
            expiresIn: '15m',
        },
    );

    const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/auth/reset-pwd?token=${resetToken}`,
    });

    await sendEmail({
        from: getEnvVar(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
}

export const resetPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, "Token is expired or invalid.");
        throw err;
    }

    const user = await UserCollection.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const ecryptedPassword = await bcrypt.hash(payload.password, 10);

    await UserCollection.updateOne(
        { _id: user._id },
        {password: ecryptedPassword},
    );

    await SessionCollection.deleteMany({
        userId: user._id,
    });
}
