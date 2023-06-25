import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VoteEvent {
  /// Default columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txHash: string;

  @Column()
  timestamp: number;

  @Column()
  contractAddress: string;

  /// Event inputs
  @Column()
  voting: number;
}

@Entity()
export class Voting {
  /// Default columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  yes_vote: string; //BigInt

  @Column()
  no_vote: string; //BigInt
}
