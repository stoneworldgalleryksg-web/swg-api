import multer from 'multer';

const storage = multer.memoryStorage();

const uploadLarge = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 10
    }
});

export default uploadLarge;9