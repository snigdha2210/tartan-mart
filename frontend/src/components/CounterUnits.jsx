// import necessary libraries and objects
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import { useTheme } from '@emotion/react';
// import { addToCart, removeFromCart } from '../store/actions/actions';
import { useDispatch } from 'react-redux';

// defines the counterunits functional component with 'selectedItem' as a prop
const CounterUnits = ({ selectedItem }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // state variables
  const [counter, updateCounter] = useState(selectedItem.quantity);
  const [isAddDisabled, setIsAddDisabled] = useState(false);

  // accessing the item details from selectedItem
  const item = selectedItem.item;

  // effect to disable the add button based on item quantity
  useEffect(() => {
    if (item.quantity < counter + 1) {
      setIsAddDisabled(true);
    }
  }, [counter]);

  // function to handle increment action
  const handleIncrement = () => {
    if (item.quantity < counter + 1) {
      setIsAddDisabled(true);
      return;
    }
    // dispatch(addToCart(selectedItem));
    updateCounter(counter + 1);
  };

  // function to handle decrement action
  const handleDecrement = () => {
    if (counter - 1 < 1) {
      dispatch(removeFromCart(item.id));
      return;
    }
    setIsAddDisabled(false);
    // dispatch(addToCart(selectedItem, -1));
    updateCounter(counter - 1);
  };

  // returns the CounterUnits component
  return (
    <ButtonGroup size='small' aria-label='small outlined button group'>
      <Button
        style={{
          color: isAddDisabled ? theme.primary.gray : theme.primary.red,
          borderColor: isAddDisabled ? theme.primary.gray : theme.primary.red,
        }}
        onClick={handleIncrement}
        disabled={isAddDisabled}
      >
        +
      </Button>
      <Button
        style={{ color: theme.primary.red, borderColor: theme.primary.red }}
      >
        {counter}
      </Button>
      <Button
        style={{ color: theme.primary.red, borderColor: theme.primary.red }}
        onClick={handleDecrement}
      >
        -
      </Button>
    </ButtonGroup>
  );
};

// exports the counterunits component
export default CounterUnits;
