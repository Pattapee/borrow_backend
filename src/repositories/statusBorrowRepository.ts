import { EntityRepository, Repository } from 'typeorm'
import StatusBorrow from '../entities/statusBorrow'

@EntityRepository(StatusBorrow)
export class StatusBorrowRepository extends Repository<StatusBorrow> {

  public async saveStatusBorrow(statusBorrow: StatusBorrow): Promise<StatusBorrow> {
    await this.save(statusBorrow)
    return statusBorrow
  }

  public async getAllStatusBorrows(): Promise<StatusBorrow[]> {
    const statusBorrows = await this.find()
    return statusBorrows
  }

  public async getOneStatusBorrow(id: number): Promise<StatusBorrow> {
    const statusBorrows = await this.findOne({
      where: { id }
    })
    return statusBorrows
  }

  public async delStatusBorrow(statusBorrow: StatusBorrow): Promise<StatusBorrow> {
    await this.remove(statusBorrow);
    return statusBorrow
  }

  public async updateStatusBorrow(id: number, statusBorrow: StatusBorrow):
    Promise<StatusBorrow> {
    await this.manager.update(StatusBorrow, id, statusBorrow)
    return statusBorrow
  }

}
