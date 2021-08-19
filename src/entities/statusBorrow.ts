import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Borrow } from './borrow';

@Entity()
export class StatusBorrow {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public status: string = '';

  @Column({ readonly: true })
  public created: Date;

  @Column()
  public updated: Date;

  @OneToMany((type) => Borrow, (borrow) => borrow.statusBorrow)
  public borrows: Borrow[];
}

export default StatusBorrow;
