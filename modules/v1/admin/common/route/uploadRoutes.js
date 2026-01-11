import express from 'express';
import uploadController from '../controller/uploadController.js';
import uploadLarge from '../../../../../utils/multerLarge.js';

const router = express.Router();

router.post('/upload-static-files', uploadLarge.array('files', 10), uploadController.uploadStaticFiles);
router.post('/list-static-files', uploadController.listStaticFiles);

export default router;