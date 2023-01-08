import express from 'express';
import { getRelationships, deleteRelationship, addRelationship, followSelf, deleteSelf } from '../controllers/relationship.js';

const router = express.Router()

router.get("/", getRelationships)
router.post("/", addRelationship)
router.post("/self", followSelf)
router.delete("/self", deleteSelf)
router.delete("/", deleteRelationship)

export default router