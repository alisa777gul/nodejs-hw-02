import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  sendResetEmailSchema,
} from '../validation/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
