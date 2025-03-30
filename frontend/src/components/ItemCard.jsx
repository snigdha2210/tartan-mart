/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import { CardActionArea } from '@mui/material';
import { getS3Instance } from '../utils/awsUtils';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

// default image URL for the card if no image is provided
const DEFAULT_IMAGE_URL =
  'https://tartan-mart-pictures.s3.us-east-2.amazonaws.com/default-image.png';

// Function to fetch the signed URL from S3
const fetchS3URL = async imageName => {
  const s3Client = getS3Instance();
  const command = new GetObjectCommand({
    Bucket: import.meta.env.VITE_REACT_APP_S3_BUCKET,
    Key: imageName,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('The URL is', url);
    return url;
  } catch (error) {
    console.error('Error fetching signed URL:', error);
    return null;
  }
};

// ItemCard functional component
export default function ItemCard(props) {
  // If props.product is undefined, return null or a fallback UI
  if (!props.product) {
    console.error('Product is undefined or null');
    return <div>Loading...</div>; // Fallback UI or handle it gracefully
  }

  const [imageUrl, setImageUrl] = React.useState(null);

  // Handle the async fetching of the image URL inside useEffect
  React.useEffect(() => {
    const getImageUrl = async () => {
      let url = null;
      if (props.product.image && props.product.image.length > 0) {
        const imageName = props.product.image.split('/').pop();
        url = await fetchS3URL(imageName);
      } else {
        url = DEFAULT_IMAGE_URL;
      }
      setImageUrl(url);
    };

    getImageUrl();
  }, [props.product.image]); // Re-run if product.image changes

  // Handle click event on the card
  const handleCardClick = () => {
    props.onItemClick(props.product);
  };

  // Return the itemcard component, including fallback for imageUrl
  return (
    <Card
      sx={{
        width: 400,
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height={props.height}
          image={imageUrl || DEFAULT_IMAGE_URL} // Fallback to default if imageUrl is still null
          alt={props.product.name}
          sx={{
            objectFit: 'cover',
            width: 'auto',
            textAlign: 'center',
            display: 'block',
            margin: 'auto',
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            $ {props.product.price}
          </Typography>
          <Chip
            style={{ marginTop: 5, marginLeft: -3 }}
            label={props.product.category}
            variant="outlined"
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
