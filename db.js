const knex = require('knex')
require("dotenv").config()



// const devConfig = {
//   host: process.env.PG_HOST,
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   database: process.env.PG_DATABASE,
//   port: process.env.PG_PORT
// }

const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`

// const prodConfig = {
//   connectionString: process.env.DATABASE_URL // from heroku postgres
// }

const prodConfig = process.env.DATABASE_URL

// module.exports = knex({
//   client: 'postgres',
//   connection: {
//     connectionString: process.env.NODE_ENV === "production" ? devConfig : prodConfig 
//   }
// })

module.exports = knex({
  client: 'postgres',
  connectionString: process.env.NODE_ENV === "production" ? devConfig : prodConfig
})

