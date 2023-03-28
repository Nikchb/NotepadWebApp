import { Router } from 'express';
import { authController } from './controllers/authController';
import { auth } from './middlewares/authMiddleweare';
import { noteController } from './controllers/noteController';

export const router = Router();

router.post('/sign-in', authController.signIn);

router.post('/sign-up', authController.signUp);

router.get('/notes', auth, noteController.getNotes);

router.get('/notes/:noteId', auth, noteController.getNote);

router.post('/notes', auth, noteController.createNote);

router.put('/notes', auth, noteController.updateNote);

router.delete('/notes/:noteId', auth, noteController.deleteNote);