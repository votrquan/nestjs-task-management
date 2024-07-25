// api-key.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  apiKey: string;

  @Column()
  secretKey: string;

  @Column()
  clientName: string; // Tên bên thứ ba sử dụng API
}
