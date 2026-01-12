import { Sequelize } from 'sequelize';
import GLOBALS from './constants.js';

// Create a singleton connection for serverless environments
let sequelize;

if (!sequelize) {
  sequelize = new Sequelize(
    GLOBALS.DB_NAME,
    GLOBALS.DB_USER,
    GLOBALS.DB_PASSWORD,
    {
      host: GLOBALS.DB_HOST,
      dialect: GLOBALS.DB_DIALECT,
      logging: false,
      pool: {
        max: 2,
        min: 0,
        acquire: 3000,
        idle: 0
      },
      dialectOptions: {
        // Vercel serverless function timeout
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000
      }
    }
  );
}

export default sequelize;
