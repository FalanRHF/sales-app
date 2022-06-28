import { ArrowBack } from '@mui/icons-material'
import { Stack, Paper, Typography, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Button, IconButton } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import CheckoutDialog from '../components/CheckoutDialog'

const TransactionRecord = () => {

  const navigate = useNavigate()

  const [transactions, setTransactions] = useState([])
  const [orderID, setOrderID] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)

  useEffect(() => {
    getTransactions()
  }, [])

  const getTransactions = async () => {
    console.log("getTransactions()")
    try {
      const res = await axios.get('/transactions')
      console.log(res.data)
      setTransactions(res.data)
    } catch (error) {
      console.log(error)
    }
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

  const toPay = (order_id, grandTotal) => {
    setIsCheckoutDialogOpen(true)
    setOrderID(1 * order_id)
    setGrandTotal(1 * grandTotal)
  }

  const onCheckoutDialogClose = async (newValue) => {
    setIsCheckoutDialogOpen(false)
    setOrderID(0)
    setGrandTotal(0)
    if (newValue) {
      try {
        await onUpdateTransactions(newValue)
      } catch (error) {
        console.log(error)
      }
    }
    getTransactions()
  }

  const onRefund = async (trxn_id) => {
    try {
      const res = await axios.put('/refund', {
        "trxn_id": trxn_id
      })
      getTransactions()
    } catch (error) {
      console.log(error)
    }
  }


  // const dummyTransactionList = [
  //   {
  //     tr_id: 1, tr_orid: 1, tr_pymethod: '', tr_status: 'PENDING', tr_amt: 24.90
  //   },
  //   {
  //     tr_id: 2, tr_orid: 2, tr_pymethod: 'CASH', tr_status: 'PAID', tr_amt: 21.30
  //   },
  // ]
  return (
    <>
      <Stack height={1} direction="column" alignItems="center" spacing={2}>
        <Typography variant="h4"><IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton> TRANSACTION RECORD</Typography>
        <Paper sx={{ width: '100%' }}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">TRANSACTION ID</TableCell>
                  <TableCell align="center">ORDER ID</TableCell>
                  <TableCell align="center">PAYMENT METHOD</TableCell>
                  <TableCell align="center">STATUS</TableCell>
                  <TableCell align="center">AMOUNT (RM)</TableCell>
                  <TableCell align="center">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row) => (
                  <TableRow
                    key={row.trxn_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {row?.trxn_id}
                    </TableCell>
                    <TableCell align="center">
                      {row?.trxn_orid}
                    </TableCell>
                    <TableCell align="center">
                      {row?.trxn_method}
                    </TableCell>
                    <TableCell align="center">
                      {row?.trxn_status}
                    </TableCell>
                    <TableCell align="center">
                      {(1 * row?.trxn_amt).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {row?.trxn_status === 'PENDING' ?
                        <Button variant="contained"
                          aria-haspopup="true"
                          aria-controls="checkout-dialog"
                          onClick={() => toPay(row?.trxn_orid, row?.trxn_amt)}>PAY</Button> : (row?.trxn_status === 'REFUNDED' ? <Button variant="contained" disabled onClick={() => alert('button clicked')}>REFUNDED</Button> : <Button variant="contained" onClick={() => onRefund(row?.trxn_id)}>REFUND</Button>)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </TableContainer>
          <CheckoutDialog
            id="checkout-dialog"
            keepMounted
            open={isCheckoutDialogOpen}
            onClose={onCheckoutDialogClose}
            grandTotal={grandTotal}
          />
        </Paper>
      </Stack>
    </>
  )
}

export default TransactionRecord