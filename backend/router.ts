import { Router } from 'express';
import { auth } from './middlewares/authMiddleweare.js';
import DIRequest from './di/DIRequest.js';
import { IAuthController } from './controllers/authController.js';
import { INoteController } from './controllers/noteController.js';

export const router = Router();

router.post('/sign-in', async (req, res) => await (await (req as DIRequest).di.get<IAuthController>('IAuthController')).signIn(req, res));

router.post('/sign-up', async (req, res) => await (await (req as DIRequest).di.get<IAuthController>('IAuthController')).signUp(req, res));

router.get('/notes', auth, async (req, res) => await (await (req as DIRequest).di.get<INoteController>('INoteController')).getNotes(req, res));

router.get('/notes/:noteId', auth, async (req, res) => await (await (req as DIRequest).di.get<INoteController>('INoteController')).getNote(req, res));

router.post('/notes', auth, async (req, res) => await (await (req as DIRequest).di.get<INoteController>('INoteController')).createNote(req, res));

router.put('/notes', auth, async (req, res) => await (await (req as DIRequest).di.get<INoteController>('INoteController')).updateNote(req, res));

router.delete('/notes/:noteId', auth, async (req, res) => await (await (req as DIRequest).di.get<INoteController>('INoteController')).deleteNote(req, res));