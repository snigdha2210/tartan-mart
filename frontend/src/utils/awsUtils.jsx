import AWS from 'aws-sdk';

export function getS3Instance() {
  // Initialize AWS S3 instance with environment variables
  const s3 = new AWS.S3({
    accessKeyId: import.meta.env.VITE_REACT_APP_S3_ACCESS_ID,
    secretAccessKey: import.meta.env.VITE_REACT_APP_S3_SECRET_KEY,
    // region: import.meta.env.VITE_REACT_APP_S3_REGION, // Example: 'us-east-1'
  });

  return s3;
}
