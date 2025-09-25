import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import contactsRouter from "./routers/contacts.js"
import { getEnvVar } from "./utils/getEnvVar.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";


dotenv.config();

export function setupServer() {
  const app = express();
  const PORT = getEnvVar('PORT', 3000);

  app.use(express.json({
    type: ['application/json', 'application/vnd.api+json'],
    limit: '100kb',
  }),);

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );


  app.use('/',contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);


  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}
