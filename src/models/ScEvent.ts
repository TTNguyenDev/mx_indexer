import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export default class ScEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txHash: string;

  @Column()
  contractAddress: string;

  @Column()
  eventName: string;

  @Column()
  timestamp: number;

}
