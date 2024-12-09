import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

function DeleteDialog({ open, onClose, onConfirm, itemId, text }) {
  return (
    <Dialog open={open} onClose={onClose} sx={{ borderRadius: '40px' }}>
      <DialogTitle>Delete {text} ?</DialogTitle>
      <DialogContent sx={{ color: '#A7A7A7' }}>Are you sure you want to delete this item?</DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ width: '50%', color: 'black', border: '1px solid #D3D3D3', borderRadius: '10px' }}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm(itemId);
            onClose();
          }}
          sx={{ width: '50%', backgroundColor: '#E74C3C', color: 'white', borderRadius: '10px' }}
          color="secondary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
