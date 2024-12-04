import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'qna_tags',
})
export class QnaTag extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('nvarchar', {
    length: 100,
    nullable: false,
  })
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
