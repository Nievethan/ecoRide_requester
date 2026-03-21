import express, { Request, Response } from 'express';
import cors from 'cors';
import rideRoutes from './routes/rideRoutes';
import userRoutes from './routes/userRoutes';

// Initialize Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rides', rideRoutes);
app.use('/api/users', userRoutes);

// A basic test route
app.get('/', (req: Request, res: Response) => {
  res.send('ecoRide backend is successfully running!');
});

export default app;