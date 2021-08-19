import { Router } from 'express'
import BorrowHistoryMoneyborrowService from '../services/borrowHistoryMoneyborrowService'

const router = Router()

// create a Borrow
router.post('/create', BorrowHistoryMoneyborrowService.create)
router.get('/get', BorrowHistoryMoneyborrowService.getAll)
router.get('/get/:id', BorrowHistoryMoneyborrowService.getOne)
router.get('/get/borrow/:id', BorrowHistoryMoneyborrowService.getAllByIdBorrow)
router.delete('/delete/:id', BorrowHistoryMoneyborrowService.delete)
export default router
