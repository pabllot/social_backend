import express from 'express';
import { getUser, getUsers } from '../controllers/user.js';

const router = express.Router()

router.get("/", getUsers)
router.get("/find/:userId", getUser)

export default router