// import necessary libraries and objects
import * as React from 'react';
import Typography from '@mui/material/Typography';
import '../assets/CategoryCard.css';

// defines the categorycard functional component, takes props as input
export default function CategoryCard(props) {
  // function to handle click events on the card
  const handleCardClick = () => {
    props.onItemClick(props.category);
  };

  // retrieves the image url from the category prop
  const imageUrl = props.category.image;

  // returns the category card component
  return (
    <div onClick={handleCardClick} className='category-list'>
      <div className='div-category-image'>
        <img
          src={imageUrl}
          className='category-image'
          alt={props.category.name}
        />
      </div>
      <div className='category-text'>
        <Typography gutterBottom variant='h6' component='div'>
          {props.category.name}
        </Typography>
      </div>
    </div>
  );
}
