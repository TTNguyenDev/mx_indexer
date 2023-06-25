import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProposeEvent {
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
  proposal_id: number;

  @Column()
  caller: string;

  @Column()
  proposal: number; // Actutally the DAOProposal id
}

@Entity()
export class DAOProposal {
  /// Default columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proposer: string;

  @Column()
  metadata: Buffer;

  //  {
  //   "name": "action",
  //     "type": "DAOAction"
  // },
  // {
  //   "name": "config",
  //     "type": "DAOConfig"
  // },

  @Column()
  created_at: number;

  @Column()
  total_supply: string; //BigInt

  @Column()
  yes_vote: string; //BigInt

  @Column()
  no_vote: string; //BigInt

  @Column()
  executed_at: number;

  @Column()
  executed_by: string;
}
