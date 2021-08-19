import { Router } from 'express'
import typeBorrowService from '../services/typeBorrowService'

const router = Router()

// create a typeBorrow
router.post('/create', typeBorrowService.create)
// getOne a typeBorrow
router.get('/get/:id', typeBorrowService.getOne)
// get All a typeBorrow
router.get('/getall', typeBorrowService.getAll)
// update a typeBorrow
router.put('/update', typeBorrowService.update)
// delete a typeBorrow
router.delete('/delete/:id', typeBorrowService.delete)

export default router
