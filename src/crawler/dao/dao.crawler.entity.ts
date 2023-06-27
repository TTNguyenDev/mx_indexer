import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProposeEvent {
  /// Default columns
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txHash: string;

  @Column({ nullable: true })
  timestamp: number;

  @Column()
  contractAddress: string;

  /// Event inputs
  @Column()
  proposal_id: number;

  @Column()
  caller: string;

  /// Proposal
  @Column()
  proposal__proposer: string;

  @Column({ nullable: true })
  proposal__metadata: string;

  /// Proposal Action
  @Column()
  proposal__action__dest_address: string;

  @Column({ nullable: true })
  proposal__action__function_name: string;

  @Column({
    type: "text",
    array: true,
    nullable: true,
    default: "{}",
  })
  proposal__action__arguments: string[];

  /// Proposal config
  @Column() // Assuming maximum value of BigUint as 10^40-1
  proposal__config__min_power_for_propose: string;

  @Column()
  proposal__config__min_time_for_propose: string;

  @Column()
  proposal__config__min_support_pct: string;

  @Column()
  proposal__config__min_quorum_pct: string;

  @Column()
  proposal__config__voting_time_limit: string;

  @Column()
  proposal__config__queue_time_limit: string;

  @Column()
  proposal__config__execute_time_limit: string;

  @Column()
  proposal__created_at: number;

  @Column()
  proposal__total_supply: string; //BigInt

  @Column()
  proposal__yes_vote: string; //BigInt

  @Column()
  proposal__no_vote: string; //BigInt

  @Column()
  proposal__executed_at: number;

  @Column()
  proposal__executed_by: string;
}

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
  proposal_id: number;

  @Column()
  caller: string;

  @Column()
  voting__yes_vote: string; //BigInt

  @Column()
  voting__no_vote: string; //BigInt
}
