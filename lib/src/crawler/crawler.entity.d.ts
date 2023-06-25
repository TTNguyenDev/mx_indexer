export interface Event {
    txHash?: string;
    timestamp?: number;
    address?: string;
    topics?: string[];
    data?: string;
    eventName?: string;
}
