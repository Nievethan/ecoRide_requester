import { Router } from "express";
import { createRide, getAllRides } from "../controllers/rideController";

const router = Router();

router.post('/', createRide);
router.get('/', getAllRides);

export default router;