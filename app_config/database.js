import { Sequelize } from 'sequelize';
import GLOBALS from './constants.js';

const sequelize = new Sequelize(
  GLOBALS.DB_NAME,
  GLOBALS.DB_USER,
  GLOBALS.DB_PASSWORD,
  {
    host: GLOBALS.DB_HOST,
    dialect: GLOBALS.DB_DIALECT,
    logging: false
  }
);

export default sequelize;
