
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

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const time = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | ` +
      `Status: ${res.statusCode} | ${time}ms`
    );
  });

  next();
});

app.use('/api/v1', routeManager);



//  ====================================== end  ======================================

// Listen to port for Training app
try {
    if (GLOBALS.PROJECT_SETUP == 'local' || GLOBALS.PORT) {
        app.listen(GLOBALS.PORT);
        console.log(`${GLOBALS.APP_NAME} Server start successfully :`, GLOBALS.PORT);
    } else {
        console.log('Failed to start the server ', 8080);
    }
} catch (err) {
    console.log(err);
    console.log('Failed to connect');
}
