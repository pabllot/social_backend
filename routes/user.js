import express from 'express';
import { getUser, getUsers, ping } from '../controllers/user.js';

const router = express.Router()

router.get("/", getUsers)
router.get("/find/:userId", getUser)
router.get("/ping", ping)

export default router