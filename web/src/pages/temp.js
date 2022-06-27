import React, { useState, useEffect, useRef } from 'react'
import { Typography, Paper, IconButton, Button, Dialog, DialogContent } from '@mui/material'
import { Modal, Menu } from '@mui/material' // MUI Utils
import { Box, Grid, Stack } from '@mui/material' // MUI Layout 
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material' // MUI Table
import { ArrowCircleUp, ArrowCircleDown } from '@mui/icons-material'
import { useNavigate } from 'react-router'
import NumpadDialog from '../components/NumpadDialog'
import TestDialog from './Dialog'

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
]

const NewTransaction = () => {

  const dummyproductList = [
    { name: 'kopi', price: 5 },
    { name: 'milo', price: 4 },
    { name: 'teh', price: 6 }
  ]

  const tax = 6
  const sv_charge = 0

  const [cart, setCart] = useState([])
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isNumpadDialogOpen, setIsNumpadDialogOpen] = useState(false)
  const [paidAmount, setPaidAmount] = useState(0.0)
  const navigate = useNavigate()

  //dialog test [S]
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Dione');

  const handleClickListItem = () => {
    setOpen(true)
  }

  const handleClose = (newValue) => {
    setOpen(false)

    if (newValue) {
      setValue(newValue)
    }
  }
  //dialog test [E]



  const addToCart = (product) => {
    console.log("Adding", product.name, "to cart...")
    let localCart = [...cart]
    let index = localCart.findIndex(row => row.name === product.name)
    if (index < 0) {
      console.log("Pushing", product.name, "...")
      product = {
        ...product,
        quantity: 1
      }
      localCart.push(product)
      setCart(localCart)
    }
  }

  const removeFromCart = (product) => {
    let localCart = [...cart]
    let index = localCart.indexOf(product)
    if (index !== -1) {
      localCart.splice(index, 1)
      setCart(localCart)
    }
  }

  const updateQuantity = (product, type) => {
    let localCart = [...cart]
    let index = localCart.indexOf(product)

    const update = (num) => {
      product.quantity = product.quantity + num
      localCart[index] = product
      setCart(localCart)
    }

    type === "add" ? update(1) : (product.quantity > 1 ? update(-1) : removeFromCart(product))
  }

  const onSubmitPayment = () => {
    navigate('/', { replace: true })
  }

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false)
    setPaidAmount(0.0)
  }

  const closeNumpadDialog = (value) => {
    setIsNumpadDialogOpen(false)
    setPaidAmount(value)
  }

  const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  const CheckoutModal = () => {
    console.log("CheckoutModal()")
    return (
      <>
        <Modal
          open={isCheckoutModalOpen}
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
                      aria-controls="paid-amount"
                      onClick={setIsNumpadDialogOpen}
                    ><u>{paidAmount.toFixed(2)}</u></Button>
                      <NumpadDialog
                        id="paid-amount"
                        keepMounted
                        open={isNumpadDialogOpen}
                        onClose={closeNumpadDialog}
                        value={paidAmount} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">RM {(cart.reduce((sum, product) => sum + product.price * product.quantity, 0) * (100 + tax + sv_charge) / 100).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Payment Method</TableCell>
                    <TableCell align="right">Cash</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Change</TableCell>
                    <TableCell align="right">RM {(paidAmount - cart.reduce((sum, product) => sum + product.price * product.quantity, 0) * (100 + tax + sv_charge) / 100).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container spacing={2} pr={2}>
              <Grid item xs={6}><Button fullWidth variant="outlined" color="error" onClick={closeCheckoutModal}>Cancel</Button></Grid>
              <Grid item xs={6}><Button fullWidth variant="contained" color="primary" onClick={onSubmitPayment}>Submit</Button></Grid>
            </Grid>
          </Box>
        </Modal>
      </>
    )
  }

  const ProductSection = () => {
    return (
      <Grid item xs={12} lg={6} p={3} borderRight={1}>
        <Stack height={1} direction="column" alignItems="center" spacing={1}>
          <Typography variant="h4">
            PRODUCTS
          </Typography>
          <Grid container spacing={3} pr={3} pb={3} component={Paper}>
            {dummyproductList.map(
              (product) => {
                return (
                  <Grid item xs={12} sm={6} key={product.name}>
                    <Button fullWidth variant="contained" onClick={() => addToCart(product)}>
                      {product.name} (RM{product.price})
                    </Button>
                  </Grid>
                )
              }
            )}
          </Grid>
        </Stack>
      </Grid>
    )
  }

  const CashierSection = () => {
    return (
      <Grid item xs={12} lg={6} p={1}>
        <Stack height={1} direction="column" alignItems="center" spacing={2}>
          <Typography variant="h4">
            CASHIER
          </Typography>
          <CashierTable />
          <CashierCheckout />
          <Grid container spacing={2} pr={2}>
            <Grid item xs={6}><Button fullWidth variant="outlined" color="error">Cancel</Button></Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary"
                aria-haspopup="true"
                aria-controls="ringtone-menu"
                aria-label="phone ringtone"
                onClick={handleClickListItem}>{value}</Button></Grid>
          </Grid>
        </Stack>
      </Grid>
    )
  }

  const CashierCheckout = () => {
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableBody>
            <TableRow>
              <TableCell>
                Subtotal
              </TableCell>
              <TableCell align="right">RM{(cart.reduce((sum, product) => sum + product.price * product.quantity, 0)).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                No. of items
              </TableCell>
              <TableCell align="right">{cart.reduce((sum, product) => sum + product.quantity, 0)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Tax
              </TableCell>
              <TableCell align="right">{tax}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Service Charge
              </TableCell>
              <TableCell align="right">{sv_charge}%</TableCell>
            </TableRow>
            <TableRow sx={{ fontWeight: 'bold' }}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="right">RM{(cart.reduce((sum, product) => sum + product.price * product.quantity, 0) * (100 + tax + sv_charge) / 100).toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const CashierTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price (RM)</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Cost (RM)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{(row.price).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => updateQuantity(row, 'remove')}><ArrowCircleDown /></IconButton>
                  {row.quantity}
                  <IconButton onClick={() => updateQuantity(row, 'add')}><ArrowCircleUp /></IconButton>
                </TableCell>
                <TableCell align="right">{(row.price * row.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <>
      <Grid container height={1}>
        <ProductSection />
        <CashierSection />
        <TestDialog
          id="ringtone-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
        />
      </Grid>
    </>
  )
}


export default NewTransaction