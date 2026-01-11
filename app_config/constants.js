import dotenv from 'dotenv';
dotenv.config();

const GLOBALS = {
    PROJECT_SETUP: process.env.PROJECT_SETUP,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_DIALECT: process.env.DB_DIALECT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: '24h',
    KEY: process.env.API_ENC_KEY,
    IV: process.env.API_ENC_IV,
    API_KEY: process.env.API_KEY,
    PORT: process.env.PORT,
    APP_NAME : process.env.APP_NAME,
    PER_PAGE : 10,

    // cloudinary configs
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_KEY_SECRET: process.env.CLOUDINARY_API_KEY_SECRET,
    CLOUDINARY_BASE_URL: "https://api.cloudinary.com/v1_1/<CLOUD_NAME>/image/upload -X POST --data 'file=<FILE>&timestamp=<TIMESTAMP>&api_key=<API_KEY>&signature=<SIGNATURE>'",

    EDITOR_JS_API_KEY: process.env.EDITOR_JS_API_KEY,
}

export default GLOBALS;