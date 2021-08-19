import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cron from 'node-cron'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import routes from './api'
import borrowService from './services/borrowService'
import statusBorrowService from './services/statusBorrowService'
import typeBorrowService from './services/typeBorrowService'

// Connects to the Database -> then starts the express
createConnection()
  .then(async (connection) => {
    // Create a new express application instance
    dotenv.config()
    const port = process.env.SERVER_PORT
    const app = express()

    // Call midlewares
    app.use(cors())
    app.use(helmet())
    app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }))

    // Set all routes from routes folder.
    app.use('/', routes)

    app.listen(port, () => {
      console.log(`Server started on port ${port}`)
    })
    // Call fn Schedule about update statusBorrow condition deadlineDate more than now Date and send Email.
    cron.schedule('10 5 9 * * *', async () => {
      await borrowService.overtimesendemail()
    })

    cron.schedule('10 5 6 * * *', async () => {
      await borrowService.overtimechangestatus()
    })

    // Call fn for first inital project about create Constant data in database system.
    await statusBorrowService.seedsDataStatusBorrow()
    await typeBorrowService.seedsDatatypeBorrow()

  })
  .catch((error) => console.log(error))
