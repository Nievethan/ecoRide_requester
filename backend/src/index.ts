import { connectDB } from './database';
import sequelize from './database';
import app from './app';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to the database before starting the server
    await connectDB();
    // Sync models with database
    sequelize.sync({ alter: true }) 
  .then(() => console.log('Database synced successfully!'))
  .catch((err) => console.error('Error syncing database:', err));

    // Start the server
  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();