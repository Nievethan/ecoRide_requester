import { Router } from "express";
import { createRide } from "../controllers/rideController";

const router = Router();

router.post('/', createRide);

export default router;