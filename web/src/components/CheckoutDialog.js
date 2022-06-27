import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slide from '@mui/material/Slide';
import { Table, TableContainer, TableBody, TableRow, TableCell, Paper } from '@mui/material'
import { Grid } from '@mui/material';
import NumpadDialog from './NumpadDialog';
import MethodDialog from './MethodDialog';

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CheckoutDialog(props) {
  const { onClose: onCheckoutDialogClose, grandTotal, open, ...other } = props;
  const [paidAmount, setPaidAmount] = React.useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const radioGroupRef = React.useRef(null);
  const [isNumpadDialogOpen, setIsNumpadDialogOpen] = useState(false)
  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false)

  React.useEffect(() => {
    if (!open) {
      setPaidAmount(0);
      setPaymentMethod('Cash')
    }
  }, [open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const onCheckoutCancel = () => {
    onCheckoutDialogClose();
  };

  const onCheckoutSubmit = () => {
    onCheckoutDialogClose(paymentMethod);
  };

  const openNumpad = () => {
    setIsNumpadDialogOpen(true)
  }

  const openMethodDialog = () => {
    setIsMethodDialogOpen(true)
  }

  const onNumpadDialogClose = (newValue) => {
    setIsNumpadDialogOpen(false)
    if (newValue) {
      setPaidAmount(newValue)
    }
  }

  const onMethodDialogClose = (newValue) => {
    setIsMethodDialogOpen(false)
    if (newValue) {
      setPaymentMethod(newValue)
    }
  }

  // const handleChange = (event) => {
  //   setPaidAmount(event.target.value);
  // };

  const ModalStyle = {
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    // width: 400,
    // all above is to center a modal in the middle of the screen/container, but dialog auto centers while modal relies on this CSS
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%' } }}
        maxWidth="xs"
        keepMounted
        TransitionComponent={Transition}
        TransitionProps={{ onEntering: handleEntering }}
        open={open}
        {...other}
      >
        <Box sx={ModalStyle}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableBody>
                <TableRow>
                  <TableCell>Total Paid Amount</TableCell>
                  <TableCell align="right">RM <Button
                    variant="text"
                    sx={{ p: 0, minWidth: '0px', minHeight: '0px' }}
                    aria-haspopup="true"
                    aria-controls="numpad-dialog"
                    onClick={openNumpad}
                  ><u>{paidAmount.toFixed(2)}</u></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">RM {grandTotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payment Method</TableCell>
                  <TableCell align="right"><Button
                    variant="text"
                    sx={{ p: 0, minWidth: '0px', minHeight: '0px' }}
                    onClick={openMethodDialog}
                  ><u>{paymentMethod}</u></Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Change</TableCell>
                  <TableCell align="right">RM {(paidAmount - grandTotal).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2} pr={2}>
            <Grid item xs={6}><Button fullWidth variant="outlined" color="error" onClick={onCheckoutCancel}>Cancel</Button></Grid>
            <Grid item xs={6}><Button fullWidth variant="contained" color="primary" onClick={onCheckoutSubmit}>Submit</Button></Grid>
          </Grid>
        </Box>
      </Dialog>
      <NumpadDialog
        id="numpad-dialog"
        keepMounted
        open={isNumpadDialogOpen}
        onClose={onNumpadDialogClose}
        value={paidAmount}
      />
      <MethodDialog
        selectedValue={paymentMethod}
        open={isMethodDialogOpen}
        onClose={onMethodDialogClose}
      />
    </>
  );
}

CheckoutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  // value: PropTypes.number.isRequired,
  grandTotal: PropTypes.number.isRequired,
};

const CheckoutDialogDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Dione');

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="div" role="group">
        <ListItem button divider disabled>
          <ListItemText primary="Interruptions" />
        </ListItem>
        <ListItem
          button
          divider
          aria-haspopup="true"
          aria-controls="ringtone-menu"
          aria-label="phone ringtone"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Phone ringtone" secondary={value} />
        </ListItem>
        <ListItem button divider disabled>
          <ListItemText primary="Default notification ringtone" secondary="Tethys" />
        </ListItem>
        <CheckoutDialog
          id="ringtone-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
        />
      </List>
    </Box>
  );
}

export default CheckoutDialog