import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: string;

  @Column({ nullable: true })
  image!: string;
}
