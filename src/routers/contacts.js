import { Router } from "express";
import { ctrlWrapper } from "../utils/CtrlWrapper.js";
import { getContactsController, getContactByIdController, createContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contact.js";
import { IsVaildId } from "../middlewares/IsValidId.js";
const router = Router();


router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId',IsVaildId, ctrlWrapper(getContactByIdController));

router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch('/contacts/:contactId',IsVaildId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

router.delete('/contacts/:contactId',IsVaildId, ctrlWrapper(deleteContactController));

export default router;
