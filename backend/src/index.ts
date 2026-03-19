import express, { Request, Response } from 'express';
import cors from 'cors';

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Allows server to read JSON data

// A basic test route
app.get('/', (req: Request, res: Response) => {
  res.send('ecoRide backend is successfully running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});