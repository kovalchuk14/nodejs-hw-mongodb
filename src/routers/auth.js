import { Router } from "express";
import { ctrlWrapper } from "../utils/CtrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginUserSchema, registerUserSchema, resetPasswordSchema, sendResetEmailSchema } from "../validation/user.js";
import { loginUserController, logoutUserSessionController, refreshUserSessionController, registerUserController, requestResetEmailController, resetPasswordController } from "../controllers/auth.js";

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

router.post(
    '/send-reset-email',
    validateBody(sendResetEmailSchema),
    ctrlWrapper(requestResetEmailController),
);

router.post(
    '/reset-pwd',
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController),
)

export default router;
