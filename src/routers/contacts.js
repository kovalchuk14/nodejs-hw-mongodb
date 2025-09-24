import { Router } from "express";
import { ctrlWrapper } from "../utils/CtrlWrapper";
import { getContactsController, getContactByIdController, createContactController, patchContactController } from "../controllers/contacts";
const router = Router();


router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));


export default router;
