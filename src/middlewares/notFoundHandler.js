import createHttpError from "http-errors";

export const notFoundHandler = (err, req, res, next) => {
    throw createHttpError(404, 'Route not found');
}
