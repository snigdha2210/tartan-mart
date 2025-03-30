import electronics from './electronics_2.jpg';
import furniture from './furniture_2.jpg';
import clothing from './clothing_2.jpg';
import home from './home.png';
import beauty from './beauty.png';

export const categories = [
  // {
  //   id: 1,
  //   name: 'Textbooks',
  //   image: 'https://tartan-mart-pictures.s3.us-east-2.amazonaws.com/books.png',
  // },
  {
    id: 2,
    name: 'Electronics',
    image:
      // 'https://img.icons8.com/badges/48/multiple-devices.png'
      electronics,
    // 'https://tartan-mart-pictures.s3.us-east-2.amazonaws.com/monitor.png',
  },
  {
    id: 3,
    name: 'Furniture',
    image: furniture,
    // 'https://tartan-mart-pictures.s3.us-east-2.amazonaws.com/furniture.png',
  },
  {
    id: 4,
    name: 'Clothing',
    image: clothing,
    // 'https://tartan-mart-pictures.s3.us-east-2.amazonaws.com/clothes.png',
  },
  // {
  //   id: 5,
  //   name: 'Home',
  //   image:
  //   // home,
  //   'https://tartan-mart-pictures.s3.us-east-2.amazonaws.com/home.png',
  // },
  // {
  //   id: 6,
  //   name: 'Beauty',
  //   image:
  //   // beauty,
  //     'https://tartan-mart-pictures.s3.us-east-2.amazonaws.com/beauty.png',
  // },
  // {
  //   id: 7,
  //   name: 'Toys',
  //   image: 'https://tartan-mart-pictures.s3.us-east-2.amazonaws.com/toys.png',
  // },
];

const IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/c/cd/Green_and_Black%27s_dark_chocolate_bar_2.jpg';

export const categories_tabs = [
  // 'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Home',
  'Beauty',
  // 'Toys',
];

export const IMAGE_SIZE_LIMIT = 10000000; //10 MB

export const REFRESH_INTERVAL_MILLISECONDS = 10000;
