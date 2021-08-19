import { validate } from 'class-validator'
import { Request, Response } from 'express'
import _ from 'lodash'
import { getConnection, getRepository } from 'typeorm'
import {
  HTTPSTATUS_ACCEPT,
  HTTPSTATUS_BADREQUEST,
  HTTPSTATUS_CONFLICT,
  HTTPSTATUS_CREATE,
  HTTPSTATUS_OK
} from '../constants/HttpStatus'
import { BorrowHistoryMoneyborrow } from '../entities/borrowHistoryMoneyborrow'
import { BorrowHistoryMoneyborrowRepository } from '../repositories/BorrowHistoryMoneyborrowRepository'
import { BorrowRepository } from '../repositories/BorrowRepository'

let repository: BorrowHistoryMoneyborrowRepository
let repository2: BorrowRepository

const initialize = () => {
  const connection = getConnection();
  repository = connection.getCustomRepository(BorrowHistoryMoneyborrowRepository)
  repository2 = connection.getCustomRepository(BorrowRepository)
}

class BorrowHistoryMoneyborrowService {

  public static create = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }

    //  Get parameters from the body
    const { billNumber, moneyBorrow, usercreated, borrowid } = req.body
    const bhm = new BorrowHistoryMoneyborrow()
    bhm.billNumber = billNumber
    bhm.moneyBorrow = moneyBorrow
    bhm.usercreated = usercreated
    bhm.borrow = await repository2.getOneBorrow(borrowid)
    bhm.created = new Date()
    // validate parameters
    const errors = await validate(bhm)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
    }
    // Save Data BorrowHistoryMoneyborrow IF error send code 409
    try {
      await repository.saveBorrowHistoryMoneyborrow(bhm)
      // If all ok, send 201 response
      res.status(HTTPSTATUS_CREATE).send('BorrowHistoryMoneyborrow created')
    } catch (e) {
      console.log(e)
      res.status(HTTPSTATUS_CONFLICT).send('BorrowHistoryMoneyborrow already in use')
    }
  }

  public static getAll = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    try {
      // Call repository find all
      const bhm = await repository.getAllBorrowHistoryMoneyborrows()
      // Send the BorrowHistoryMoneyborrow object
      res.status(HTTPSTATUS_OK).send(bhm)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('BorrowHistoryMoneyborrow already in use')
    }
  }

  public static getOne = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    // Get parameter from params
    const params = req.params
    // Validate parameters
    const errors = await validate(params)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
      return
    }
    // Get BorrowHistoryMoneyborrow from database where BorrowHistoryMoneyborrow id
    try {
      // Call repository findOne by id
      const borrow = await repository.getOneByIdBorrowHistoryMoneyborrow(+params.id)
      // Send the BorrowHistoryMoneyborrow object
      res.status(HTTPSTATUS_OK).send(borrow)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('BorrowHistoryMoneyborrow already in use')
    }
  }

  public static getAllByIdBorrow = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    // Get parameter from params
    const params = req.params
    // Validate parameters
    const errors = await validate(params)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
      return
    }
    // Get BorrowHistoryMoneyborrow from database where BorrowHistoryMoneyborrow id
    try {
      // Call repository findOne by id
      const borrow = await repository.getAllByIdBorrow(+params.id)
      // Send the BorrowHistoryMoneyborrow object
      res.status(HTTPSTATUS_OK).send(borrow)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('BorrowHistoryMoneyborrow already in use')
    }
  }

  // public static update = async (req: Request, res: Response) => {
  //   if (repository === undefined) {
  //     initialize()
  //   }
  //   const dataNew = req.body
  //   // validate parameters
  //   const errors = await validate(dataNew)
  //   if (errors.length > 0) {
  //     res.status(HTTPSTATUS_BADREQUEST).send(errors)
  //     return
  //   }
  //   try {
  //     await repository.updateStatusBorrow(dataNew.id, dataNew)
  //     res.status(HTTPSTATUS_ACCEPT).send('Success, Update StatusBorrow')
  //   } catch (e) {
  //     console.error(e)
  //     res.status(HTTPSTATUS_CONFLICT).send('StatusBorrow already in use')
  //   }
  // }

  public static delete = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    // validate parameters
    const errors = await validate(req.query)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
      return
    }
    try {
      const bhm = await repository.getOneByIdBorrowHistoryMoneyborrow(+req.params.id)
      // fn delete historyMoneyBorrow
      await repository.delBorrowHistoryMoneyborrow(bhm)
      // IF all ok, Send Http code 200 respons
      res.status(HTTPSTATUS_OK).send('Success, Delete BorrowHistoryMoneyborrow')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('BorrowHistoryMoneyborrow already in use')
    }
  }
}

export default BorrowHistoryMoneyborrowService
