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
import { StatusBorrow } from '../entities/statusBorrow'
import { StatusBorrowRepository } from '../repositories/statusBorrowRepository'

let repository: StatusBorrowRepository
const initialize = () => {
  const connection = getConnection();
  repository = connection.getCustomRepository(StatusBorrowRepository)
}

class StatusBorrowServices {

  public static create = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    //  Get parameters from the body
    const { status } = req.body
    const statusborrow = new StatusBorrow()
    statusborrow.status = status
    statusborrow.created = new Date()
    statusborrow.updated = new Date()
    // validate parameters
    const errors = await validate(statusborrow)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
    }
    // Save Data StatusBorrow IF error send code 409
    try {
      await repository.saveStatusBorrow(statusborrow)
      // If all ok, send 201 response
      res.status(HTTPSTATUS_CREATE).send('StatusBorrow created')
    } catch (e) {
      console.log(e)
      res.status(HTTPSTATUS_CONFLICT).send('StatusBorrow already in use')
    }
  }

  public static getAll = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    try {
      // Call repository find all
      const borrows = await repository.getAllStatusBorrows()
      // Send the StatusBorrow object
      res.status(HTTPSTATUS_OK).send(borrows)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('StatusBorrow already in use')
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
    // Get statusBorrow from database where statusBorrow id
    try {
      // Call repository findOne by id
      const borrow = await repository.getOneStatusBorrow(+params.id)
      // Send the StatusBorrow object
      res.status(HTTPSTATUS_OK).send(borrow)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('StatusBorrow already in use')
    }
  }

  public static update = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    const dataNew = req.body
    // validate parameters
    const errors = await validate(dataNew)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
      return
    }
    try {
      await repository.updateStatusBorrow(dataNew.id, dataNew)
      res.status(HTTPSTATUS_ACCEPT).send('Success, Update StatusBorrow')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('StatusBorrow already in use')
    }
  }

  public static delete = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    // Del StatusBorrow from database
    const connection = getRepository(StatusBorrow)
    // validate parameters
    const errors = await validate(req.query)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
      return
    }
    try {
      const statusBorrow = await repository.getOneStatusBorrow(+req.params.id)
      await repository.delStatusBorrow(statusBorrow)
      // IF all ok, Send Http code 200 respons
      res.status(HTTPSTATUS_OK).send('Success, Delete StatusBorrow')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('StatusBorrow already in use')
    }
  }
  public static seedsDataStatusBorrow = async () => {
    if (repository === undefined) {
      initialize()
    }
    const item = ['รับเอกสารแล้ว', 'รอตรวจสอบเอกสาร', 'ส่งคืนเงินยืมเรียบร้อยแล้ว', 'เกินกำหนดชำระ', 'รอส่งเอกสาร', 'ขอขยายระยะเวลา']
    await _.forEach(item, async (value, key) => {
      const statusborrow = new StatusBorrow()
      statusborrow.id = (key + 1)
      statusborrow.status = value
      statusborrow.created = new Date()
      statusborrow.updated = new Date()
      try {
        await repository.saveStatusBorrow(statusborrow)
        console.log(`[Seeds] Add statusBorrow : ${value} Success!!`)
      } catch (e) {
        console.error(e)
      }
    })
  }
}

export default StatusBorrowServices
