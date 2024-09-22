import * as React from 'react';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useNavigate } from 'react-router-dom';
import { Chip, Card } from '@mui/material';
import { Typography, Alert } from '@mui/material';
import FormattedDate from '../components/FormattedDate.jsx';

function renderItem({ purchase, itemClickHandler }) {
  console.log(purchase);
  return (
    <ListItem key={purchase.id} onClick={() => itemClickHandler(purchase.id)}>
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: '5px',
        }}
      >
        <FormattedDate date={purchase.order_date} />
        <Typography variant="body1">
          # of Items: {purchase.items.length}
        </Typography>
        <Typography variant="body1">Total: ${purchase.total_price}</Typography>
        <Chip label={purchase.payment_status} variant="outlined" />
      </Card>
    </ListItem>
  );
}
const PurchasesList = ({ purchases, withUpdate }) => {
  console.log(purchases);
  purchases.map(purchase => console.log(purchase));
  const navigateTo = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [errorDisplay, setErrorDisplay] = useState('none');

  const itemClickHandler = id => {
    navigateTo(`/order-details/${id}`);
  };
  console.log(purchases);
  return (
    <>
      <Alert sx={{ display: errorDisplay }} severity="error">
        {errorMessage}
      </Alert>
      <List dense={true} sx={{ backgroundColor: 'white' }}>
        {purchases.map(purchase =>
          renderItem({
            purchase,
            itemClickHandler,
          })
        )}
      </List>
    </>
  );
};

export default PurchasesList;
