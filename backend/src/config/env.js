const path = require('path');
// Load environment variables from the backend/.env file.
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
};
