import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ default: false, nullable: true })
  isDeleted: boolean;

  constructor(createdAt?: Date, updatedAt?: Date) {
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
