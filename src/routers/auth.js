import { Router } from "express";
import { ctrlWrapper } from "../utils/CtrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../validation/user.js";
import { loginUserController, logoutUserSessionController, refreshUserSessionController, registerUserController } from "../controllers/auth.js";

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController)
);

router.post(
    '/login',
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController)
);

router.post(
    '/refresh',
    ctrlWrapper(refreshUserSessionController),
);

router.post(
    '/logout',
    ctrlWrapper(logoutUserSessionController),
);

export default router;
