const multer = require('multer');
const validExtensions = ['png', 'jpg', 'jpeg'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const fileName = `${req.params.id}_${Date.now()}.${extension}`;

        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    const isValidExtension = validExtensions.includes(extension);

    cb(null, isValidExtension);
}

const file = multer({ storage, fileFilter });

module.exports = file;