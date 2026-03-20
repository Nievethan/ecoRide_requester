import { Request, Response } from "express";
import { User } from "../models";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Grab data from user JSON request
        const { name, email } = req.body;
        
        // Create new row in database
        const newUser = await User.create({
            name,
            email
        });

        res.status(201).json({
            message: 'User created successfully!',
            user: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};