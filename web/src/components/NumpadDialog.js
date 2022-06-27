import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import { Box, Grid } from '@mui/material'
import { Button } from '@mui/material'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'

const NumpadDialog = (props) => {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const NumpadButtonProps = {
    variant: 'outlined',
    size: 'large',
    fullWidth: true,
    sx: {
      borderRadius: 5,
      height: '100%'
    }
  }

  const handleCancel = () => {
    setValue(Math.floor(value * 10) / 100);
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(value * 10 + (event / 100));
  };
  // console.log("NumpadDialog.value:", value)

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%' } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogContent>
        <Box>
          <Grid container>
            <Grid item xs={12} p={1}>
              <Typography align='right' fontSize={50}>
                <u>{value.toFixed(2)}</u>
              </Typography>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(7)}>7</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(8)}>8</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(9)}>9</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(4)}>4</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(5)}>5</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(6)}>6</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(1)}>1</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(2)}>2</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(3)}>3</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={handleCancel} variant="contained" color="error">{'<'}</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={() => handleChange(0)}>0</Button>
            </Grid>
            <Grid item xs={4} p={0.5}>
              <Button {...NumpadButtonProps} onClick={handleOk} variant="contained" color="success">ENTER</Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

NumpadDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
}

export default NumpadDialog