import express from 'express';
import { createContact, getAllContacts, getContactById, deleteContact } from '../controllers/contactsController.js';

const router = express.Router();

router.post('/', createContact);       // POST /contacts
router.get('/', getAllContacts);       // GET /contacts
router.get('/:id', getContactById);    // GET /contacts/:id
router.delete('/:id', deleteContact);  // DELETE /contacts/:id

export default router;
