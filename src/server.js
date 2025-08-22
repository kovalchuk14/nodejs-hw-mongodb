import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import { getEnvVar } from "./utils/getEnvVar.js";
import { getAllContacts, getContact } from "./services/contacts.js";

dotenv.config();

export function setupServer() {
  const app = express();
  const PORT = getEnvVar('PORT', 3000);

  app.use(express.json());;
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status:200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContact(contactId);

    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }
    res.status(200).json({
      status:200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });


  app.use((req, res) => {
    res.status(404).json({
      message: "not found",
    });
  });
  app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}
