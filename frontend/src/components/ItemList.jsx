import * as React from 'react';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemButton, Tooltip, Card } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import { Modal, Typography, Box, Button, Alert } from '@mui/material';
import { theme } from '../../theme.js';
import { getRequestAuthed, putRequest } from '../util/api';
import { useDispatch } from 'react-redux';
import { deleteItem } from '../store/actions/actions.jsx';
import API_ENDPOINTS from '../constants/apiEndpoints.js';
import { filterActiveSold } from '../util/profile.jsx';

const handleOpenDelete = setter => {
  setter(true);
};
const handleCloseDelete = setter => {
  setter(false);
};

function renderItem({
  item,
  i,
  itemClickHandler,
  handleDelete,
  openDelete,
  setOpenDelete,
  withUpdate,
}) {
  return (
    <Card sx={{ marginBottom: '5px' }}>
      <ListItem
        sx={{ display: 'flex' }}
        key={i}
        secondaryAction={
          withUpdate ? (
            <div>
              {(() => {
                if (withUpdate.delete === true) {
                  return (
                    <>
                      <Tooltip title="Delete">
                        <ListItemButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleOpenDelete(setOpenDelete)}
                        >
                          <DeleteIcon sx={{ color: theme.primary.coolGray }} />
                        </ListItemButton>
                      </Tooltip>
                      <Modal
                        open={openDelete}
                        onClose={() => handleCloseDelete(setOpenDelete)}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'white',
                            border: '2px solid #000',
                            boxShadow: 24,
                            borderRadius: '8px',
                          }}
                        >
                          <Typography
                            id="modal-modal-description"
                            sx={{
                              mt: 2,
                              color: theme.primary.coolGray,
                              textAlign: 'center',
                              marginTop: 5,
                            }}
                          >
                            Are you sure you want to delete? If your listing is
                            active it will be deleted permanently.
                          </Typography>
                          <div
                            className="confirm-delete"
                            style={{
                              display: 'flex',
                              marginBottom: '20px',
                              textAlign: 'center',
                            }}
                          >
                            <Button
                              onClick={() => handleDelete(i)}
                              sx={{
                                background: theme.primary.red,
                                width: '100%',
                                margin: 5,
                                height: '35px',
                                color: 'white',
                              }}
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() => handleCloseDelete(setOpenDelete)}
                              sx={{
                                background: theme.primary.red,
                                width: '100%',
                                margin: 5,
                                height: '35px',
                                color: 'white',
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Box>
                      </Modal>
                    </>
                  );
                }
              })()}
            </div>
          ) : null
        }
      >
        <div>
          <ListItemText
            primary={
              <>
                {item.name}{' '}
                <Chip
                  sx={{ marginLeft: '20px' }}
                  label={item.category}
                  variant="outlined"
                />
              </>
            }
            onClick={() => itemClickHandler(item.id)}
          />
        </div>
      </ListItem>
    </Card>
  );
}
const ItemList = ({ items, withUpdate }) => {
  console.log(items);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [openDelete, setOpenDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDisplay, setErrorDisplay] = useState('none');

  const itemClickHandler = id => {
    navigateTo(`/listings/item-detail/${id}`);
  };

  function mutateStatus(selectedItem, status) {
    var ret = {};
    ret['current_status'] = status;
    return ret;
  }

  const handleDelete = async id => {
    setOpenDelete(false);
    try {
      let selectedItem = items[id - 1];
      let mutated_item = mutateStatus(selectedItem, 'deleted');
      const response = await putRequest(
        API_ENDPOINTS.updateItemStatus + selectedItem.id.toString() + '/',
        mutated_item,
        false
      );
      if (response) {
        try {
          const data = await getRequestAuthed(API_ENDPOINTS.getProfile);
          let new_items = filterActiveSold(data['items']);
          dispatch(deleteItem(new_items));
        } catch (error) {
          console.error('Error in PUT request:', error);
          setErrorMessage(error.toString());
          setErrorDisplay('show');
          return;
        }
      }
      setErrorMessage('');
      setErrorDisplay('none');
    } catch (error) {
      console.error('Error in PUT request:', error);
      setErrorMessage(error.toString());
      setErrorDisplay('show');
    }
  };
  return (
    <>
      <Alert sx={{ display: errorDisplay }} severity="error">
        {errorMessage}
      </Alert>
      <List dense={true} sx={{ backgroundColor: 'white' }}>
        {items.map((item, i) =>
          renderItem({
            item,
            i,
            itemClickHandler,
            handleDelete,
            openDelete,
            setOpenDelete,
            withUpdate,
          })
        )}
      </List>
    </>
  );
};

export default ItemList;
