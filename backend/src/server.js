import dotenv from 'dotenv';
import app from './app.js';
import { connectDb } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is required');
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDb(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
