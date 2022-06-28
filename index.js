require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./db')
const path = require("path")

const PORT = process.env.PORT || 5000 //default port: 5000

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "web/build")))
}

app.get('/', (req, res) => res.send('API connected!'))

app.get('/users', async (req, res) => {
  const users = await db.select().from('users')
  res.json(users)
})

app.get('/products', async (req, res) => {
  const products = await db.select().from('products')
  res.json(products)
})

app.get('/transactions', async (req, res) => {
  const transactions = await db.select().from('transactions').orderBy('trxn_id', 'desc')
  res.json(transactions)
})

app.post('/checkout/orders', async (req, res) => {
  try {
    console.log("original URL:", req.originalUrl)
    const { tax, sv_charge, total_amt } = req.body
    const result = await db('orders').insert({
      order_tax: tax,
      order_svcharge: sv_charge,
      order_amt: total_amt
    }).returning('order_id')
    console.log("order_id", result[0].order_id)
    res.json(result[0].order_id)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.post('/checkout/orderitems', async (req, res) => {
  try {
    console.log("original URL:", req.originalUrl)
    const { cart, order_id } = req.body
    const items = cart.map((product) => ({
      item_prid: product.product_id,
      item_orid: order_id,
      item_quantity: product.quantity,
      item_price: product.product_price
    }))
    const result = await db('order_items').insert(items).returning('*')
    console.log(result)
    res.json(result)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.post('/checkout/transactions', async (req, res) => {
  try {
    console.log("original URL:", req.originalUrl)
    const { order_id, total_amt } = req.body
    const result = await db('transactions').insert({
      trxn_orid: order_id,
      trxn_amt: total_amt
    }).returning('*')
    console.log(result)
    res.json(result)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.put('/checkout/method', async (req, res) => {
  try {
    console.log("original URL:", req.originalUrl)
    const { order_id, payment_method } = req.body
    const result = await db('transactions').where('trxn_orid', order_id).update({
      trxn_method: payment_method,
      trxn_status: 'COMPLETED'
    })
    console.log(result)
    res.json(result)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.put('/refund', async (req, res) => {
  try {
    console.log("original URL:", req.originalUrl)
    const { trxn_id } = req.body
    const result = await db('transactions').where('trxn_id', trxn_id).update({
      trxn_status: 'REFUNDED'
    })
    console.log(result)
    res.json(result)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.post('/users', async (req, res) => {
  const user = await db('users').insert({ name: req.body.name }).returning('*')
  res.json(user)
})

app.listen(PORT, () => console.log(`Server up at port ${PORT}`))