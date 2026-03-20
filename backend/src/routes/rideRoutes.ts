import { Router } from "express";
import { createRide, getAllRides } from "../controllers/rideController";
import { body } from 'express-validator';

const router = Router();

router.post('/', [
    body('pickupLocation').isString().withMessage('Pickup location must be a string')
    
    .trim().notEmpty().withMessage('Pickup location is required'),
    body('dropoffLocation').isString().withMessage('Dropoff location must be a string')
    
    .trim().notEmpty().withMessage('Dropoff location is required'),
    
    body('fare').isFloat({ gt: 0 }).withMessage('Fare must be a positive number'),
    
    body('userId').isInt().withMessage('User ID must be a string')
    .trim().notEmpty().withMessage('User ID is required')
], createRide);

router.get('/',getAllRides);

export default router;