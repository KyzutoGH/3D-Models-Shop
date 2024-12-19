import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ColumnEnumOptions } from "typeorm/decorator/options/ColumnEnumOptions";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  name!: string;

  @Column({ nullable: true })
  userName!: string;

  @Column({ nullable: true })
  nomorTelepon!: string;

  @Column({ nullable: true })
  role!: ColumnEnumOptions;

  @Column({ nullable: true })
  alamat!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ nullable: true })
  tgl_register!: Date;
}
