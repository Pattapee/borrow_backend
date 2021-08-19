import { Router } from 'express'
import BorrowService from '../services/borrowService'

const router = Router()

// create a Borrow
router.post('/create', BorrowService.create)
// getOne a Borrow
router.get('/get/:id', BorrowService.getOne)
// get All a Borrow
router.get('/getall', BorrowService.getAll)
router.post('/getAllByDate', BorrowService.getAllByDate)
// update a Borrow
router.put('/update', BorrowService.update)
// delete a Borrow
router.post('/delete', BorrowService.delete)
// findUser by USERNAME
router.get('/finduserbyname/:name', BorrowService.findpcuserbyusername)
// findUser by USERNAME
router.get('/finduserbyid/:id', BorrowService.findpcuserbyuserid)

export default router
