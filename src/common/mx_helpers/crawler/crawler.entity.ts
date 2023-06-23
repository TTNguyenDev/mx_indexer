// Interfaces
//
export interface EventDetail {
  txHash?: string;
  timestamp?: number;
  events?: SCEvent[];
}

export interface SCEvent {
  address?: string;
  data?: string;
  topics?: string[];
}
