import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BorrowHistoryMoneyborrow } from './borrowHistoryMoneyborrow'
import { StatusBorrow } from './statusBorrow';
import { TypeBorrow } from './typeBorrow';

@Entity()
export class Borrow {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public number: string = '';

  @Column()
  public userID: string = '';

  @Column()
  public userName: string = '';

  @Column()
  public borrowDate: Date;

  @Column()
  public deadlineDate: Date;

  @Column()
  public returnDate: Date;

  @Column()
  public objecttive: string = '';

  @Column({ type: 'float' })
  public reference: number = 0;

  @Column()
  public billNumber: string = '';

  @Column({ type: 'float' })
  public moneyBorrow: number = 0;

  @Column({ type: 'float' })
  public balance: number = 0;

  @Column()
  public remark: string = '';

  @Column({ readonly: true })
  public created: Date;

  @Column()
  public updated: Date;

  @Column()
  public usercreated: string = '';

  @Column()
  public userupdated: string = '';

  @Column()
  public removed: boolean = false

  @ManyToOne((type) => StatusBorrow, (status) => status.borrows)
  public statusBorrow: StatusBorrow;

  @ManyToOne((type) => TypeBorrow, (type) => type.borrows)
  public typeBorrow: TypeBorrow;

  @OneToMany((type) => BorrowHistoryMoneyborrow, (bhm) => bhm.borrow)
  public borrowHistoryMoneyborrows: BorrowHistoryMoneyborrow[];

}

export default Borrow;
