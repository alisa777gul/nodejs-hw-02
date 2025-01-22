import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';

const router = Router();

//GET
router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

//POST
router.post('/contacts', ctrlWrapper(createContactController));

//PATCH
router.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

export default router;
