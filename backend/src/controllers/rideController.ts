import { Request, Response } from 'express';
import { Ride, User } from '../models';

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
    } 
    catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ error: 'Failed to request ride' });
    }
};

export const getAllRides = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find rides and attach user data to each ride
        const rides = await Ride.findAll({
            include: [
                {
                    model: User,
                    as: 'rider',
                    attributes: ['name', 'email']
                }
            ]
        });

        // Send "OK" status and rides data as JSON response
        res.status(200).json(rides);

    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({ error: 'Failed to fetch rides' });
    }
};