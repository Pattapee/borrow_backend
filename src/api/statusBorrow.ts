import { Router } from 'express'
import statusBorrowService from '../services/statusBorrowService'

const router = Router()

// create a statusBorrow
router.post('/create', statusBorrowService.create)
// getOne a statusBorrow
router.get('/get/:id', statusBorrowService.getOne)
// get All a statusBorrow
router.get('/getall', statusBorrowService.getAll)
// update a statusBorrow
router.put('/update', statusBorrowService.update)
// delete a statusBorrow
router.delete('/delete/:id', statusBorrowService.delete)

export default router
