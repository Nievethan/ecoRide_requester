import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/userController";
import { body } from 'express-validator';

const router = Router();

router.post('/',[
        body('email').isEmail().withMessage('Email must be valid')
        .trim().notEmpty().withMessage('Email is required'),

        body('name').isString().withMessage('Name must be a string')
        .trim().notEmpty().withMessage('Name is required'),

        body('role').optional().isIn(['Rider', 'Driver']).withMessage('Role must be either Rider or Driver')
], createUser);

router.get('/', getAllUsers);

export default router;