const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize S3 client with the same configuration as file middleware
const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
  forcePathStyle: true, // Required for LocalStack
};

// Add endpoint and credentials for local development
if (process.env.ENVIRONMENT === 'local' && process.env.AWS_ENDPOINT_URL_S3) {
  s3Config.endpoint = process.env.AWS_ENDPOINT_URL_S3;
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const s3Client = new S3Client(s3Config);

/**
 * Generate a pre-signed URL for accessing an S3 object
 * @param {string} key - The S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default: 24 hours)
 * @returns {Promise<string>} - The pre-signed URL
 */
async function generatePresignedUrl(key, expiresIn = 86400) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  let presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });

  // For local development: Replace 'localstack' hostname with 'localhost'
  // so the URL is accessible from the browser (host machine)
  if (process.env.ENVIRONMENT === 'local' && process.env.AWS_ENDPOINT_URL_S3) {
    presignedUrl = presignedUrl.replace('localstack:4566', 'localhost:4566');
  }

  return presignedUrl;
}

module.exports = {
  generatePresignedUrl,
  s3Client,
};
