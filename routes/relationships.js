import express from 'express';
import { getRelationships, deleteRelationship, addRelationship, followSelf } from '../controllers/relationship.js';

const router = express.Router()

router.get("/", getRelationships)
router.post("/", addRelationship)
router.post("/self", followSelf)
router.delete("/", deleteRelationship)

export default router