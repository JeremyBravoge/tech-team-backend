import express from 'express';
import { authentication, loginUser } from '../middlewares/auth.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import usersController from '../controllers/usersController.js'; // ✅ correct import

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/users', usersController.createUser);
router.get('/verify-email', usersController.verifyEmail);

// Protected routes (any logged-in user)
router.use(authentication);
router.get('/users', usersController.getAllUsers); // all authenticated users can view
router.get('/users/:email', usersController.getUserByEmail);
router.put('/users/:email/bio', usersController.updateUserBio);
router.put('/users/:email/password', usersController.updateUserPassword);

// Admin-only routes
router.put('/users/:email/role', adminAuth, usersController.updateUserRole);
router.delete('/users/:email', adminAuth, usersController.deleteUser);

// Overview route
router.get('/overview', authentication, usersController.getUserOverview);

export default router;
