const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1'
  // No need for credentials in ECS
});

const validExtensions = ['png', 'jpg', 'jpeg'];

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split('.').pop().toLowerCase();
  if (validExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { userId: req.params.id });
    },
    key: (req, file, cb) => {
      const extension = file.originalname.split('.').pop().toLowerCase();
      const key = `users/${req.params.id}/${uuidv4()}.${extension}`;
      cb(null, key);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;