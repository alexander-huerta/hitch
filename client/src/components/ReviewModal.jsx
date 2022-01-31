import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ReviewModal({ handleClose, open, profile }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event)
    handleClose();
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Your review of
          {' '}
          {profile.name}
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div>
            {' '}
            Was
            {' '}
            {profile.name}
            {' '}
            the rider or the driver?
          </div>
          <FormGroup aria-label="position" row required>
            <FormControlLabel control={<Checkbox />} label="Rider" labelPlacement="top" />
            <FormControlLabel control={<Checkbox />} label="Driver" labelPlacement="top" />
          </FormGroup>
          <Rating name="half-rating" defaultValue={0} precision={0.5} size="large" required />
          <TextField
            id="outlined-multiline-static"
            label="Your feedback (optional)"
            multiline
            rows={4}
            fullWidth
            defaultValue=""
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};