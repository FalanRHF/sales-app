import React from 'react'
import { Button, Card, CardContent, Stack } from '@mui/material'
import { Navigate, useNavigate } from 'react-router'

const Home = () => {


  const navigate = useNavigate()

  const toNewTransaction = () => {
    navigate('/new', { replace: false })
  }

  const toTransactionRecord = () => {
    navigate('/record', { replace: false })
  }

  return (
    <>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        height={1}
        px={50}
      >
        <Button variant="contained" onClick={toNewTransaction} fullWidth>
          New Transaction
        </Button>
        <Button variant="contained" onClick={toTransactionRecord} fullWidth>
          Transactions Record
        </Button>
      </Stack>
    </>
  )
}

export default Home 