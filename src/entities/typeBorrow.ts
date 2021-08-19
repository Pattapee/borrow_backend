import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Borrow } from './borrow';

@Entity()
export class TypeBorrow {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public type: string = '';

  @Column()
  public day: number = 1;

  @Column({ readonly: true })
  public created: Date;

  @Column()
  public updated: Date;

  @OneToMany((type) => Borrow, (borrow) => borrow.typeBorrow)
  public borrows: Borrow[];
}

export default TypeBorrow;
