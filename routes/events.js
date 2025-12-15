import express from 'express';
import { createEvent, getAllEvents, getEventById, deleteEvent } from '../controllers/eventsController.js';

const router = express.Router();

router.post('/', createEvent);        // POST /api/events
router.get('/', getAllEvents);        // GET /api/events
router.get('/:id', getEventById);     // GET /api/events/:id
router.delete('/:id', deleteEvent);   // DELETE /api/events/:id

export default router;
