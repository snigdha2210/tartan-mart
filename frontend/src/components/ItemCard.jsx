// import necessary libraries and object
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import { CardActionArea } from '@mui/material';

// default image URL for the card if no image is provided
const DEFAULT_IMAGE_URL =
  'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg';

// defines the itemcard functional component with 'props' as a parameter
export default function ItemCard(props) {
  // function to handle click event on the card
  const handleCardClick = () => {
    props.onItemClick(props.product);
  };

  // determine the image URL to use, defaulting to DEFAULT_IMAGE_URL if none provided
  const imageUrl =
    props.product.image && props.product.image.length > 0
      ? props.product.image
      : DEFAULT_IMAGE_URL;

  // returns the itemcard component
  return (
    <Card
      sx={{
        maxWidth: 400,
        minWidth: 400,
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component='img'
          height={props.height}
          image={imageUrl}
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
          <Typography gutterBottom variant='h5' component='div'>
            {props.product.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            $ {props.product.price}
          </Typography>
          <Chip style={{marginTop:5, marginLeft:-3}}label={props.product.category} variant='outlined' />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
