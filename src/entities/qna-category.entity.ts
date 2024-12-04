import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'qna_categories',
})
export class QnACategory extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('nvarchar', {
    length: 255,
    nullable: false,
  })
  name: string;

  @Column('text', {
    nullable: true,
  })
  description: string;

  constructor(name: string, description: string) {
    super();
    this.name = name;
    this.description = description;
  }
}
