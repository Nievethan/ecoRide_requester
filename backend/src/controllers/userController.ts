import { Request, Response } from "express";
import { User } from "../models";
import { validationResult } from "express-validator";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; 
    }
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
        if (process.env.NODE_ENV !== 'test') {
            console.error('Error creating user:', error);
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find users and attach user data to each user
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role']
        });

        // Send "OK" status and user data as JSON response
        res.status(200).json(users);

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};