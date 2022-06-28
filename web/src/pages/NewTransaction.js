import React, { useState, useEffect, useRef } from 'react'
import { Typography, Paper, IconButton, Button, Dialog, DialogContent } from '@mui/material'
import { Modal, Menu } from '@mui/material' // MUI Utils
import { Box, Grid, Stack } from '@mui/material' // MUI Layout 
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material' // MUI Table
import { ArrowCircleUp, ArrowCircleDown, ErrorOutlineTwoTone } from '@mui/icons-material'
import { useNavigate } from 'react-router'
// import NumpadDialog from '../components/NumpadDialog'
import CheckoutDialog from '../components/CheckoutDialog'
import axios from 'axios'

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

  const tax = 0
  const sv_charge = 0

  const [cart, setCart] = useState([])
  // const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  // const [isNumpadDialogOpen, setIsNumpadDialogOpen] = useState(false)
  const navigate = useNavigate()

  const [grandTotal, setGrandTotal] = useState(0)
  const [products, setProducts] = useState([])
  const [orderID, setOrderID] = useState(0)


  //dialog test [S]
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('Cash');


  useEffect(() => {
    getProductsArray()
    setGrandTotal(cart.reduce((sum, product) => sum + product.product_price * product.quantity, 0) * (100 + tax + sv_charge) / 100)
    console.log("process.env.REACT_APP_LOCALHOST:", process.env.REACT_APP_LOCALHOST)
    return () => {
      setGrandTotal(0)
    }
  }, [cart])

  const getProductsArray = async () => {
    try {
      const products = await axios.get(`/products`)
      setProducts(products.data)
    } catch (error) {
      console.log(error)
    }
  }

  const toCheckout = async () => {
    try {
      const order_id = await onPostOrders()
      // const order_id = 1
      setOrderID(order_id)
      const res1 = await onPostOrderItems(order_id)
      const res2 = await onPostTransactions(order_id)
      setIsCheckoutDialogOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  const onPostOrders = () => {
    console.log("onPostOrders")
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post('/checkout/orders', {
          "tax": tax,
          "sv_charge": sv_charge,
          "total_amt": grandTotal
        })
        console.log("res:", res)
        resolve(res.data)
      } catch (error) {
        reject(error)
      }
    })
  }

  const onPostOrderItems = (order_id) => {
    console.log("onPostOrderItems")
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post('/checkout/orderitems', {
          "cart": cart,
          "order_id": order_id
        })
        resolve(res)
      } catch (error) {
        reject(error)
      }
    })
  }

  const onPostTransactions = (order_id) => {
    console.log("onPostTransactions")
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post('/checkout/transactions', {
          "order_id": order_id,
          "total_amt": grandTotal
        })
        resolve(res)
      } catch (error) {
        reject(error)
      }
    })
  }

  const onUpdateTransactions = (newValue) => {
    console.log("onPostTransactions")
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.put('/checkout/method', {
          "order_id": orderID,
          "payment_method": newValue
        })
        resolve(res)
      } catch (error) {
        reject(error)
      }
    })
  }

  const onCheckoutDialogClose = async (newValue) => {
    setIsCheckoutDialogOpen(false)
    if (newValue) {
      setPaymentMethod(newValue)
      try {
        await onUpdateTransactions(newValue)
      } catch (error) {
        console.log(error)
      }
    }
    navigate('/', { replace: true })
  }

  //dialog test [E]



  const addToCart = (product) => {
    console.log("Adding", product.product_name, "to cart...")
    let localCart = [...cart]
    let index = localCart.findIndex(row => row.product_name === product.product_name)
    if (index < 0) {
      console.log("Pushing", product.product_name, "...")
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

  const ProductSection = () => {
    return (
      <Grid item xs={12} md={6} p={3} sx={{
        borderRight: {
          xs: 0,
          md: 1
        },
        borderBottom: {
          xs: 1,
          md: 0
        }
      }}>
        <Stack height={1} direction="column" alignItems="center" spacing={1}>
          <Typography variant="h4">
            PRODUCTS
          </Typography>
          <Grid container spacing={3} pr={3} pb={3} component={Paper}>
            {products.map(
              (product) => {
                return (
                  <Grid item xs={12} sm={6} key={product.product_id}>
                    <Button fullWidth variant="contained" onClick={() => addToCart(product)}>
                      {product?.product_name} (RM{product?.product_price})
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
      <Grid item xs={12} md={6} p={1}>
        <Stack height={1} direction="column" alignItems="center" spacing={2}>
          <Typography variant="h4">
            CASHIER
          </Typography>
          <CashierTable />
          <CashierCheckout />
          <Grid container spacing={2} pr={2}>
            <Grid item xs={6}><Button fullWidth variant="outlined" color="error" onClick={() =>
              navigate('/', { replace: true })}>Cancel</Button></Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary"
                aria-haspopup="true"
                aria-controls="checkout-dialog"
                aria-label="phone ringtone"
                disabled={cart.length < 1}
                onClick={toCheckout}>CHECKOUT</Button></Grid>
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
              <TableCell align="right">RM{(cart.reduce((sum, product) => sum + product.product_price * product.quantity, 0)).toFixed(2)}</TableCell>
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
              <TableCell sx={{ fontWeight: 'bold', fontSize: 16 }} align="right">RM{grandTotal.toFixed(2)}</TableCell>
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
                key={row.product_name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.product_name}
                </TableCell>
                <TableCell align="right">{(1 * row.product_price)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" edge={false} onClick={() => updateQuantity(row, 'remove')}><ArrowCircleDown /></IconButton>
                  {row.quantity}
                  <IconButton size="small" edge={false} onClick={() => updateQuantity(row, 'add')}><ArrowCircleUp /></IconButton>
                </TableCell>
                <TableCell align="right">{(row.product_price * row.quantity)}</TableCell>
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
        <CheckoutDialog
          id="checkout-dialog"
          keepMounted
          open={isCheckoutDialogOpen}
          onClose={onCheckoutDialogClose}
          grandTotal={grandTotal}
        />
      </Grid>
    </>
  )
}


export default NewTransaction