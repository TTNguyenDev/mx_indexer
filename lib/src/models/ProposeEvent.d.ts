/// <reference types="node" />
export declare class ProposeEvent {
    id: number;
    txHash: string;
    timestamp: number;
    contractAddress: string;
    data: string;
}
export declare class DAOProposal {
    id: number;
    proposer: string;
    metadata: Buffer;
    created_at: number;
    total_supply: string;
    yes_vote: string;
    no_vote: string;
    executed_at: number;
    executed_by: string;
}
