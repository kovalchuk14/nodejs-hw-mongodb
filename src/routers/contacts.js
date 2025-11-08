import { Router } from "express";
import { ctrlWrapper } from "../utils/CtrlWrapper.js";
import { getContactsController, getContactByIdController, createContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contact.js";
import { IsVaildId } from "../middlewares/IsValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', IsVaildId, ctrlWrapper(getContactByIdController));

router.post('/',
    upload.single('photo'),
    validateBody(createContactSchema),
    ctrlWrapper(createContactController));

router.patch('/:contactId', IsVaildId,
    upload.single('photo'),
    validateBody(updateContactSchema),
    ctrlWrapper(patchContactController));

router.delete('/:contactId',IsVaildId, ctrlWrapper(deleteContactController));

export default router;
