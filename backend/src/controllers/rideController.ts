import { Request, Response } from 'express';
import { Ride } from '../models';

export const createRide = async (req: Request, res: Response): Promise<void> => {
    try {
        // Grab data from user JSON request
        const { pickupLocation, dropoffLocation, fare, userId } = req.body;

        // Create new row in database
        const newRide = await Ride.create({
            pickupLocation,
            dropoffLocation,
            fare,
            userId
        });

        res.status(201).json({
            message: 'Ride requested successfully!',
            ride: newRide
        });
    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ error: 'Failed to request ride' });
    }
};