import { EntityRepository, Repository } from 'typeorm'
import BorrowHistoryMoneyborrow from '../entities/borrowHistoryMoneyborrow'

@EntityRepository(BorrowHistoryMoneyborrow)
export class BorrowHistoryMoneyborrowRepository extends Repository<BorrowHistoryMoneyborrow> {

  public async saveBorrowHistoryMoneyborrow(bhm: BorrowHistoryMoneyborrow): Promise<BorrowHistoryMoneyborrow> {
    await this.save(bhm)
    return bhm
  }

  public async getAllBorrowHistoryMoneyborrows(): Promise<BorrowHistoryMoneyborrow[]> {
    const bhms = await this.find({
      relations: ['borrow']
    })
    return bhms
  }

  public async getOneByIdBorrowHistoryMoneyborrow(id: number): Promise<BorrowHistoryMoneyborrow> {
    const bhm = await this.findOne({
      relations: ['borrow'],
      where: { id }
    })
    return bhm
  }

  public async getAllByIdBorrow(id: number): Promise<BorrowHistoryMoneyborrow[]> {
    const bhms = await this.find({
      relations: ['borrow'],
      where: { borrow: id }
    })
    return bhms
  }

  public async delBorrowHistoryMoneyborrow(bhm: BorrowHistoryMoneyborrow): Promise<BorrowHistoryMoneyborrow> {
    await this.remove(bhm);
    return bhm
  }

  public async updateBorrowHistoryMoneyborrow(id: number, bhm: BorrowHistoryMoneyborrow):
    Promise<BorrowHistoryMoneyborrow> {
    await this.manager.update(BorrowHistoryMoneyborrow, id, bhm)
    return bhm
  }

}
