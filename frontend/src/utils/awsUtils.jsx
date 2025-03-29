import { S3Client } from '@aws-sdk/client-s3';

export function getS3Instance() {
  // Initialize AWS S3 instance with environment variables
  const s3Client = new S3Client({
    region: 'eu-north-1', // Stockholm region
    credentials: {
      accessKeyId: import.meta.env.VITE_REACT_APP_S3_ACCESS_ID,
      secretAccessKey: import.meta.env.VITE_REACT_APP_S3_SECRET_KEY,
    },
  });

  return s3Client;
}
