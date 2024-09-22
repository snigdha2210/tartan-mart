import * as React from 'react';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function renderItem({ item, order, quantity }) {
  return (
    <ListItem key={item.id} sx={{ width: '100%' }}>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="order-item-details"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{item.name}</Typography>
          <Chip
            sx={{ marginLeft: '20px' }}
            label={item.category.toUpperCase()}
            variant="outlined"
          />{' '}
          <Chip
            sx={{ marginLeft: '20px' }}
            label={order.payment_status.toUpperCase()}
            variant="outlined"
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography component={Link} to={`/listings/item-detail/${item.id}`}>
            View Item Details
          </Typography>
          <Typography variant="h6">Buyer's Details</Typography>
          <Typography paragraph>Units purchased: {quantity}</Typography>
          <Typography paragraph>
            Delivery/Pickup Option: {item.delivery_or_pickup}
          </Typography>
          <Typography paragraph>
            Pickup address: {item.pickup_address}
          </Typography>
          <Typography paragraph>
            Delivery address: {order.delivery_address}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}
const OrderList = ({ order_items }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDisplay, setErrorDisplay] = useState('none');

  return (
    <>
      <Alert sx={{ display: errorDisplay }} severity="error">
        {errorMessage}
      </Alert>
      <List dense={true} sx={{ backgroundColor: 'white' }}>
        {order_items.map(item => renderItem(item))}
      </List>
    </>
  );
};

export default OrderList;
