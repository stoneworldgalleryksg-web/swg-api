import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const db = {};

// Load config.js (using .env variables)
import configFile from "../config/config.js";

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

// Create sequelize instance
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Sequize Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// Dynamically import all models
const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"));

for (const file of modelFiles) {
  const filePath = path.join(__dirname, file);

  // Convert Windows path → file:// URL
  const fileURL = pathToFileURL(filePath).href;

  const module = await import(fileURL);
  const model = module.default;

  db[model.name] = model;
}

// Setup associations
Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
