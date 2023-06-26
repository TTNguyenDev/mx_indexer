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
export class DAOAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dest_address: string;

  @Column({
    type: 'bytea',
    nullable: true,
    default: () => "'\\x'",
  })
  function_name: Buffer | null;

  @Column({
    type: 'bytea',
    nullable: true
  })
  arguments: ArrayBuffer | null;

  // @Column()
  // arguments: ArrayBuffer;
}

@Entity()
export class DAOConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()  // Assuming maximum value of BigUint as 10^40-1
  min_power_for_propose: string;

  @Column()
  min_time_for_propose: string;

  @Column()
  min_support_pct: string;

  @Column()
  min_quorum_pct: string;

  @Column()
  voting_time_limit: string;

  @Column()
  queue_time_limit: string;

  @Column()
  execute_time_limit: string;
}

@Entity()
export class DAOProposal {
  /// Default columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proposer: string;

  @Column({
    type: 'bytea',
    nullable: true,
    default: () => "'\\x'",
  })
  metadata: Buffer | null;

  @Column()
  action: number;

  @Column()
  config: number;

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
