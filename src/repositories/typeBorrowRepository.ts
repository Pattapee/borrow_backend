import { EntityRepository, Repository } from 'typeorm'
import TypeBorrow from '../entities/typeBorrow'

@EntityRepository(TypeBorrow)
export class TypeBorrowRepository extends Repository<TypeBorrow> {

  public async saveTypeBorrow(typeBorrow: TypeBorrow): Promise<TypeBorrow> {
    await this.save(typeBorrow)
    return typeBorrow
  }

  public async getAllTypeBorrows(): Promise<TypeBorrow[]> {
    const typeBorrows = await this.find()
    return typeBorrows
  }

  public async getOneTypeBorrow(id: number): Promise<TypeBorrow> {
    const typeBorrows = await this.findOne({
      where: { id }
    })
    return typeBorrows
  }

  public async delTypeBorrow(typeBorrow: TypeBorrow): Promise<TypeBorrow> {
    await this.remove(typeBorrow);
    return typeBorrow
  }

  public async updateTypeBorrow(id: number, typeBorrow: TypeBorrow):
    Promise<TypeBorrow> {
    await this.manager.update(TypeBorrow, id, typeBorrow)
    return typeBorrow
  }

}
