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
import { TypeBorrow } from '../entities/typeBorrow'
import { TypeBorrowRepository } from '../repositories/typeBorrowRepository'

let repository: TypeBorrowRepository
const initialize = () => {
  const connection = getConnection();
  repository = connection.getCustomRepository(TypeBorrowRepository)
}

class TypeBorrowServices {

  public static create = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    //  Get parameters from the body
    const { type, day } = req.body
    const typeborrow = new TypeBorrow()
    typeborrow.type = type
    typeborrow.day = day
    typeborrow.created = new Date()
    typeborrow.updated = new Date()
    // validate parameters
    const errors = await validate(typeborrow)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
      return
    }
    try {
      await repository.saveTypeBorrow(typeborrow)
      // If all ok, send 201 response
      res.status(HTTPSTATUS_CREATE).send('TypeBorrow created')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('TypeBorrow already in use')
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
    // Get TypeBorrow from database where TypeBorrow id
    try {
      // Call repository findOne by id
      const borrow = await repository.getOneTypeBorrow(+params.id)
      // Send the TypeBorrow object
      res.status(HTTPSTATUS_OK).send(borrow)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('TypeBorrow already in use')
    }
  }

  public static getAll = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    try {
      // Call repository find all
      const borrows = await repository.getAllTypeBorrows()
      // Send the TypeBorrow object
      res.status(HTTPSTATUS_OK).send(borrows)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('TypeBorrow already in use')
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
      await repository.updateTypeBorrow(dataNew.id, dataNew)
      res.status(HTTPSTATUS_ACCEPT).send('Success, Update TypeBorrow')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('TypeBorrow already in use')
    }
  }

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
      const typeBorrow = await repository.getOneTypeBorrow(+req.params.id)
      await repository.delTypeBorrow(typeBorrow)
      // IF all ok, Send Http code 200 respons
      res.status(HTTPSTATUS_OK).send('Success, Delete TypeBorrow')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('TypeBorrow already in use')
    }
  }
  public static seedsDatatypeBorrow = async () => {
    if (repository === undefined) {
      initialize()
    }
    const item = [
      {
        type: 'ค่าใช้จ่ายในการเดินทางไปปฏิบัติงานฯ',
        day: 30
      },
      {
        type: 'เพื่อการจัดซื้อจัดจ้างเกี่ยวกับพัสดุ',
        day: 15
      }
    ]
    await _.forEach(item, async (value, key) => {
      const typeborrow = new TypeBorrow()
      typeborrow.id = (key + 1)
      typeborrow.type = value.type
      typeborrow.day = value.day
      typeborrow.created = new Date()
      typeborrow.updated = new Date()
      try {
        await repository.saveTypeBorrow(typeborrow)
        console.log(`[Seeds] Add typeBorrow : ${value.type} Success!!`)
      } catch (e) {
        console.error(e)
      }
    })
  }
}

export default TypeBorrowServices
