import { Between, EntityRepository, MoreThan, Repository } from 'typeorm'
import Borrow from '../entities/borrow'

@EntityRepository(Borrow)
export class BorrowRepository extends Repository<Borrow> {

  public async saveBorrow(borrow: Borrow): Promise<Borrow> {
    await this.save(borrow)
    return borrow
  }

  public async getAllBorrows(): Promise<Borrow[]> {
    const borrows = await this.find({
      relations: ['statusBorrow', 'typeBorrow', 'borrowHistoryMoneyborrows'],
      where: { removed: false }
    })
    return borrows
  }

  public async getAllBorrowByyearBudget(start: Date, end: Date): Promise<Borrow[]> {
    const borrows = await this.find({
      relations: ['statusBorrow', 'typeBorrow', 'borrowHistoryMoneyborrows'],
      where: {
        removed: false,
        borrowDate: Between(start, end)
      }
    })
    return borrows
  }

  public async getOneBorrow(id: number): Promise<Borrow> {
    const borrows = await this.findOne({
      relations: ['statusBorrow', 'typeBorrow'],
      where: { removed: false, id }
    })
    return borrows
  }

  public async delBorrow(borrow: Borrow): Promise<Borrow> {
    await this.remove(borrow);
    return borrow
  }

  public async updateBorrow(id: number, borrow: Borrow):
    Promise<Borrow> {
    await this.manager.update(Borrow, id, borrow)
    return borrow
  }

}
