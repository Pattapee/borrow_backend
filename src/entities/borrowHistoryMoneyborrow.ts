import { Column, Double, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Borrow } from './borrow'

@Entity()
export class BorrowHistoryMoneyborrow {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public billNumber: string = '';

  @Column({ type: 'float' })
  public moneyBorrow: number = 0;

  @Column({ readonly: true })
  public created: Date;

  @Column()
  public usercreated: string = '';

  @ManyToOne((type) => Borrow, (borrow) => borrow.borrowHistoryMoneyborrows)
  public borrow: Borrow;

}

export default BorrowHistoryMoneyborrow;
