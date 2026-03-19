import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load the .env file
dotenv.config();

// Throw error if the URL is missing
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env file");
}

// Initialize Sequelize using the URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
  logging: false, 
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Cloud Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;