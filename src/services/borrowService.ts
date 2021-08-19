import { validate } from 'class-validator'
import { Request, Response } from 'express'
import _ from 'lodash'
import moment = require('moment')
import mailer from 'nodemailer'
import { getConnection, getCustomRepository, getRepository } from 'typeorm'
import {
  HTTPSTATUS_ACCEPT,
  HTTPSTATUS_BADREQUEST,
  HTTPSTATUS_CONFLICT,
  HTTPSTATUS_CREATE,
  HTTPSTATUS_OK
} from '../constants/HttpStatus'
import { Borrow } from '../entities/borrow'
import { BorrowRepository } from '../repositories/BorrowRepository'
import { StatusBorrowRepository } from '../repositories/statusBorrowRepository'
const userDB = 'xxx'

let repository: BorrowRepository
let statusborrowrepository: StatusBorrowRepository
const initialize = () => {
  const connection = getConnection();
  repository = connection.getCustomRepository(BorrowRepository)
  statusborrowrepository = connection.getCustomRepository(StatusBorrowRepository)
}

class BorrowService {

  public static create = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    //  Get parameters from the body
    const data = req.body
    const borrow = new Borrow()
    borrow.number = data.number
    borrow.userID = data.userID
    borrow.userName = data.userName
    borrow.objecttive = data.objecttive
    borrow.reference = data.reference
    borrow.remark = data.remark
    borrow.moneyBorrow = data.moneyBorrow
    // borrow.billNumber = data.billNumber
    borrow.balance = data.moneyBorrow
    borrow.borrowDate = data.borrowDate
    borrow.deadlineDate = data.deadlineDate
    borrow.typeBorrow = data.typeborrow
    borrow.statusBorrow = data.statusborrow
    borrow.created = new Date()
    borrow.updated = new Date()
    borrow.usercreated = data.usercreated
    borrow.userupdated = data.userupdated
    // validate parameters
    const errors = await validate(borrow)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
      return
    }
    // Save Data borrow IF error send code 409
    try {
      const result = await repository.saveBorrow(borrow)
      if (result) {
        BorrowService.sendemailforAdd(result)
      }
      // If all ok, send 201 response
      res.status(HTTPSTATUS_CREATE).send('Borrow created')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('Borrow already in use')
    }
  }

  public static getOne = async (req: Request, res: Response) => {
    // Get Borrows from database
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
    // Get Borrow from database where borrow id
    try {
      // Call repository findOne by id
      const borrow = await repository.getOneBorrow(+params.id)
      // Send the Borrows object
      res.status(HTTPSTATUS_OK).send(borrow)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('Borrow already in use')
    }
  }

  public static getAll = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    const current = moment(new Date())
    const chkDate = moment(`${current.year()}-10-01`)
    let startyearbudget = moment(new Date())
    let endyearbudget = moment(new Date())
    if (current.isSameOrAfter(chkDate) === false) {
      startyearbudget = moment(`${current.year() - 1}-10-01`)
      endyearbudget = moment(`${current.year()}-09-30`)
    } else {
      startyearbudget = moment(`${current.year()}-10-01`)
      endyearbudget = moment(`${current.year() + 1}-09-30`)
    }
    try {
      // Call repository find all
      const borrows = await repository.getAllBorrowByyearBudget(startyearbudget.toDate(), endyearbudget.toDate())
      // Send the Borrows object
      res.status(HTTPSTATUS_OK).send(borrows)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('Borrow already in use')
    }
  }
  public static getAllByDate = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    const { startdate, enddate } = req.body
    try {
      // Call repository find all
      const borrows = await repository.getAllBorrowByyearBudget(startdate, enddate)
      // Send the Borrows object
      res.status(HTTPSTATUS_OK).send(borrows)
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('Borrow already in use')
    }
  }

  public static update = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    // Update Borrow from database
    const dataNew = req.body
    // Get borrow from database where id
    try {
      await repository.updateBorrow(dataNew.id, dataNew)
      res.status(HTTPSTATUS_ACCEPT).send('Success, Update Borrow')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('Borrow already in use')
    }
  }

  public static delete = async (req: Request, res: Response) => {
    if (repository === undefined) {
      initialize()
    }
    // Get parameter from reqbody
    const data = req.body
    // Validate parameters
    const errors = await validate(req.body)
    if (errors.length > 0) {
      res.status(HTTPSTATUS_BADREQUEST).send(errors)
      return
    }
    try {
      const borrow = await repository.getOneBorrow(+req.body.id)
      borrow.removed = true
      borrow.userupdated = req.body.userupdate
      borrow.updated = new Date()
      await repository.updateBorrow(+req.body.id, borrow)
      // IF all ok, Send Http code 200 respons
      res.status(HTTPSTATUS_OK).send('Success, Delete Borrow')
    } catch (e) {
      console.error(e)
      res.status(HTTPSTATUS_CONFLICT).send('Borrow already in use')
    }
  }

  public static findpcuserbyusername = async (req: Request, res: Response) => {
    const mssql = require('mssql')
    let item
    // open connection db mssql and query get userid fullname email by fullname like 'req%'
    try {
      await mssql.close()
      await mssql.connect(userDB)
      item = await mssql.query(
        `select TOP 1 USERID,FULLNAME,EMAIL from PC_USERS where FULLNAME like ('%${req.params.name}%') and REMOVED is null and EMAIL is not null and EMAIL != ''`
      )
      await mssql.close()
    } catch (err) {
      res.status(HTTPSTATUS_BADREQUEST).send(err)
    }
    // IF all ok, Send Http code 200 respons
    res.status(HTTPSTATUS_OK).send(item.recordset[0])
  }

  public static findpcuserbyuserid = async (req: Request, res: Response) => {
    const mssql = require('mssql')
    let item
    // open connection db mssql and query get userid fullname email by userid
    try {
      await mssql.close()
      await mssql.connect(userDB)
      item = await mssql.query(
        `select USERID,FULLNAME,EMAIL from PC_USERS where USERID = '${req.params.id}' and REMOVED is null and EMAIL is not null and EMAIL != ''`
      )
      await mssql.close()
    } catch (err) {
      res.status(HTTPSTATUS_BADREQUEST).send(err)
    }
    // IF all ok, Send Http code 200 respons
    res.status(HTTPSTATUS_OK).send(item.recordset[0])
  }

  public static overtimechangestatus = async () => {
    if (repository === undefined) {
      initialize()
    }
    // getAll dataBorrow
    const dataBorrow = await repository.getAllBorrows()
    // getOne StatusBorrow id 4 [overtime] for set deadlineDate morethan now Date
    const dataStatusBorrow = await statusborrowrepository.getOneStatusBorrow(4)
    // filter dataBorrow is statusBorrow is overtime and finish process
    const item = _.filter(dataBorrow, (value) => {
      return value.statusBorrow.id.toString() !== '3' && value.statusBorrow.id.toString() !== '6' && value.statusBorrow.id.toString() !== '4'
    })
    // loop update statusborrow and send email
    _.forEach(item, async (value) => {
      const endDate = value.deadlineDate
      // call lib moment for diff date
      const datediff = await moment(endDate)
        .startOf('day')
        .diff(moment(Date.now()).startOf('day'), 'days')
      if (datediff < 0) {
        // if datediff less than 0 update statusborrow 3 over date
        value.statusBorrow = dataStatusBorrow
        try {
          // await repository.saveBorrow(value)
        } catch (e) {
          console.error(e)
        }
      }
    })
  }

  public static sendemailforAdd = async (props: any) => {
    const mssql = require('mssql')
    let user
    try {
      await mssql.close()
      await mssql.connect(userDB)
      user = await mssql.query(
        `select USERID,FULLNAME,EMAIL from PC_USERS where USERID = '${props.userID}' and REMOVED is null and EMAIL is not null and EMAIL != ''`
      )
      await mssql.close()
    } catch (err) {
      console.error(err)
      // res.status(HTTPSTATUS_BADREQUEST).send(err)
    }
    const Sendemail = (email: string) => {
      const smtpTransport = mailer.createTransport({
        host: 'mail.ombudsman.go.th',
        port: 2525,
        auth: {
          user: 'pattapee@ombudsman.go.th',
          pass: '0728'
        }
      });
      const mail = {
        from: 'patchrin@ombudsman.go.th',
        to: email,
        cc: 'pattapee@ombudsman.go.th',
        subject: `รายละเอียดการยืมเงินทดรองจ่ายจากสำนักงานผู้ตรวจการแผ่นดิน`,
        html: `<p style="font-size: 24px;">เรียน  คุณ${props.userName} ผู้ยืมเงินทดรองจ่าย</p>
        <p style="font-size: 24px;">ตามที่ท่านได้ยืมเงินทดรองจ่ายจากสำนักงานผู้ตรวจการแผ่นดิน โดยมีรายละเอียดการยืมเงิน ดังนี้</p>
        <p style="font-size: 24px;">ผู้ยืมเงิน : ${props.userName}</p>
        <p style="font-size: 24px;">สัญญาเงินยืมเลขที่ : ${props.number}</p>
        <p style="font-size: 24px;">วันที่ยืมเงิน : ${new Date(props.borrowDate).getDate()}/${new Date(props.borrowDate).getMonth() + 1}/${new Date(props.borrowDate).getFullYear() + 543}</p>
        <p style="font-size: 24px;">วันที่ครบกำหนด : ${new Date(props.deadlineDate).getDate()}/${new Date(props.deadlineDate).getMonth() + 1}/${new Date(props.deadlineDate).getFullYear() + 543}</p>
        <p style="font-size: 24px;">จำนวนเงินยืม : ${props.moneyBorrow} บาท</p>
        <p style="font-size: 24px;">วัตถุประสงค์เพื่อเป็นค่าใช้จ่าย : ${props.objecttive}</p>`
      };
      smtpTransport.sendMail(mail, (error: any, response: any) => {
        smtpTransport.close();
        if (error) {
          console.error(error);
        } else {
          console.log(`Send email to UserID: ${props.id} Success.`);
        }
      });
    }
    await Sendemail(user.recordset[0].EMAIL)
  }

  public static overtimesendemail = async () => {
    if (repository === undefined) {
      initialize()
    }
    // function about checkDeadline and Send Email [schedule]
    // set const connection DB mysql and require lib mssql
    const mssql = require('mssql')
    // getAll dataBorrow
    const dataBorrow = await repository.getAllBorrows()
    // fn query get emailUser
    const getuserEmail = async (id: any) => {
      const pool = new mssql.ConnectionPool(userDB);
      try {
        await pool.connect();
        let result = await pool.query(
          `select EMAIL from PC_USERS where USERID = '${id}'`
        )
        await pool.close()
        return result = _.last(result.recordset)
      } catch (err) {
        console.error('Database connection failed!', err);
        return err;
      }
    }
    // filter dataBorrow is statusBorrow is overtime and finish process
    const item = _.filter(dataBorrow, (value) => {
      return value.statusBorrow.id.toString() !== '3' && value.statusBorrow.id.toString() !== '6' && value.statusBorrow.id.toString() !== '4'
    })
    // fn send email by lib nodemailer
    const Sendemail = (value: any, day: any, email: any) => {
      const smtpTransport = mailer.createTransport({
        host: 'mail.ombudsman.go.th',
        port: 2525,
        auth: {
          user: 'pattapee@ombudsman.go.th',
          pass: '0728'
        }
      });
      const mail = {
        from: 'patchrin@ombudsman.go.th',
        to: email.EMAIL,
        cc: 'pattapee@ombudsman.go.th',
        subject: `แจ้งเตือน เหลือเวลาอีก ${day} วันสำหรับการคืนเงินยืม`,
        html: `<p style="font-size: 24px;">เรียน ผู้ยืมเงินทดรองจ่าย</p>
        <p style="font-size: 24px;">ตามที่ท่านได้ยืมเงินทดรองจ่ายจากสำนักงานผู้ตรวจการแผ่นดิน โดยมีรายละเอียดการยืมเงิน ดังนี้</p>
        <p style="font-size: 24px;">เลขที่สัญญา: ${value.number}</p>
        <p style="font-size: 24px;">ผู้ยืมเงิน: ${value.userName}</p>
        <p style="font-size: 24px;">วันที่ยืมเงิน: ${value.borrowDate.getDate()}/${value.borrowDate.getMonth() + 1}/${value.borrowDate.getFullYear() + 543}</p>
        <p style="font-size: 24px;">วันที่ต้องคืน: ${value.deadlineDate.getDate()}/${value.deadlineDate.getMonth() + 1}/${value.deadlineDate.getFullYear() + 543}</p>
        <p style="font-size: 24px;">วัตถุประสงค์: ${value.objecttive}</p>
        <p style="font-size: 24px;">ใบสำคัญจ่าย: ${value.reference}</p>
        <p style="font-size: 24px;">จำนวนเงินยืม: ${value.moneyBorrow} บาท</p>
        <p style="font-size: 24px;">สถานะการยืมเงิน: ${value.statusBorrow.status}</p>
        <p style="font-size: 24px;">หมายเหตุ: ${value.remark}</p>`
      };
      smtpTransport.sendMail(mail, (error: any, response: any) => {
        smtpTransport.close();
        if (error) {
          console.error(error);
        } else {
          console.log(`Send email to UserID: ${value.userID} Success.`);
        }
      });
    }
    // loop update statusborrow and send email
    _.forEach(item, async (value) => {
      const endDate = value.deadlineDate
      // call lib moment for diff date
      const datediff = await moment(endDate)
        .startOf('day')
        .diff(moment(Date.now()).startOf('day'), 'days')
      const emailUser = await getuserEmail(value.userID)
      if (datediff.toString() === '3') {
        // if date diff === 3 send email alert
        await Sendemail(value, '3', emailUser)
      } else if (datediff.toString() === '10') {
        // if date diff === 10 send email alert
        await Sendemail(value, '10', emailUser)
      }
    })
  }
}
export default BorrowService
