import express, { Request, Response } from 'express';
import { connectDB } from './database';
import cors from 'cors';
import { User, Ride } from './models';
import sequelize from './database';
import rideRoutes from './routes/rideRoutes';
import userRoutes from './routes/userRoutes';

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Allows server to read JSON data
app.use('/api/rides', rideRoutes); // Use ride routes for /api/rides endpoints
app.use('/api/users', userRoutes); // Use user routes for /api/users endpoints

// A basic test route
app.get('/', (req: Request, res: Response) => {
  res.send('ecoRide backend is successfully running!');
});

// Connect to the database before starting the server
connectDB();

// Sync the models with the database
sequelize.sync({ alter: true }) 
  .then(() => console.log('Database synced successfully!'))
  .catch((err) => console.error('Error syncing database:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});