import { Router } from 'express'
import borrow from './borrow'
import borrowHistoryMoneyborrow from './borrowHistoryMoneyborrow'
import statusBorrow from './statusBorrow'
import typeBorrow from './typeBorrow'
const routes = Router()

routes.use('/borrow', borrow)
routes.use('/statusBorrow', statusBorrow)
routes.use('/typeBorrow', typeBorrow)
routes.use('/borrowHistoryMoneyborrow', borrowHistoryMoneyborrow)

export default routes
