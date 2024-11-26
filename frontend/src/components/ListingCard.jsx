import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import { CardActionArea } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DEFAULT_IMAGE_URL =
  'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg';

export default function ListingCard(props) {
  console.log('LISTING:', props.listing);

  // Function to handle click event on the card
  const handleCardClick = () => {
    console.log('CARD CLICKED:');
  };

  // Check if there are images provided, use default if not
  const images =
    props.listing.images && props.listing.images.length > 0
      ? props.listing.images
      : [DEFAULT_IMAGE_URL];

  const theme = useTheme();
  const navigate = useNavigate();
  const handleManageListingClick = () => {
    navigate(`/listing/${props.listing.id}`); // Navigate to /listing/{id}
  };

  return (
    <Card
      sx={{
        display: 'flex', // Make the card content horizontal
        width: '600px', // Adjust width to fit both carousel and details
        margin: '20px auto', // Center the card and add some margin
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
        borderRadius: '10px', // Rounded corners for a modern look
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        sx={{ display: 'flex', alignItems: 'stretch' }}
      >
        {/* Carousel on the left side */}
        <Box sx={{ width: '50%', overflow: 'hidden' }}>
          <Carousel
            autoPlay={true}
            indicators={true}
            // navButtonsAlwaysVisible={true}
            cycleNavigation={true}
            navButtonsProps={{
              style: {
                backgroundColor: theme.primary.red,
                borderRadius: 0,
              },
            }}
          >
            {props.listing.listing_item.map((item, index) => (
              <img
                key={index}
                src={item.image || DEFAULT_IMAGE_URL}
                alt={`Image ${index + 1}`}
                style={{
                  height: '300px',
                  objectFit: 'contain',
                  width: '100%',
                }}
              />
            ))}
          </Carousel>
        </Box>
        {/* Listing details on the right side */}
        <CardContent
          sx={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5', // Light grey background for details
            padding: '20px',
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {props.listing.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: '10px', wordWrap: 'break-word' }}
          >
            {props.listing.description}
          </Typography>
          <div
            className="save-input"
            style={{ textAlign: 'center', marginTop: 10 }}
          >
            <Button
              variant="contained"
              style={{ background: theme.primary.red }}
              // onClick={handleEditSaveClick}
              onClick={handleManageListingClick}
            >
              Manage Listing
            </Button>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
