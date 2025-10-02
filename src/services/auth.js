import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UserCollection } from "../db/models/user.js";
import { FIFTEEN_MINUTES,THIRTY_DAYS } from '../constans/index.js';
import { SessionCollection } from '../db/models/session.js';

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
