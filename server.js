
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './models/index.js';
import routeManager from './modules/v1/routeManager.js';
import GLOBALS from './app_config/constants.js';

const app = express();
app.use(cors({ origin: '*' }));

app.use(cookieParser());
app.use(express.text({ type: 'text/plain' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routeManager);

//  ====================================== end  ======================================

try {
    if (GLOBALS.PROJECT_SETUP == 'local' || GLOBALS.PORT) {
        app.listen(GLOBALS.PORT);
        console.log(`${GLOBALS.APP_NAME} Server start successfully :`, GLOBALS.PORT);
    } else {
        console.log('Failed to start the server ', GLOBALS.PORT);
    }
} catch (err) {
    console.log(err);
    console.log('Failed to connect');
}
