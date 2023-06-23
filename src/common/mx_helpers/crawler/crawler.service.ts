import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { EventDetail, SCEvent } from './crawler.entity';

// Defaults
const BASE_URL = 'https://devnet-api.multiversx.com';
const TRACKING_ADDRESS =
  'erd1qqqqqqqqqqqqqpgqv49mkah22xp5eypz78jc3t56yyww59tgjpqsu5lhht';
const TRACKING_EVENTS = ['propose_event'];

@Injectable()
export class CrawlerService {
  async txCount(address: string): Promise<number> {
    const req = await fetch(`${BASE_URL}/accounts/${address}/transfers/count`);
    return await req.json();
  }

  async TxHashes(
    address: string,
    from: number,
    size: number,
  ): Promise<string[]> {
    const req = `${BASE_URL}/accounts/${address}/transfers?from=${from}&size=${size}`;
    const txResponse = await fetch(req);
    return ((await txResponse.json()) as any[])
      .map((tx: any) => {
        if (tx.status == 'success') {
          if (tx.type == 'SmartContractResult') {
            return tx.originalTxHash;
          } else {
            return tx.txHash;
          }
        } else {
          return undefined;
        }
      })
      .filter((v) => v !== undefined);
  }

  async getTransactionDetail(transactionHash: string): Promise<EventDetail> {
    const requestUrl = `${BASE_URL}/transactions/${transactionHash}`;
    const transactionResponse = await fetch(requestUrl);
    const transactionData = await transactionResponse.json();

    const detailedEvent: EventDetail = {
      txHash: transactionHash,
      timestamp: transactionData.timestamp,
      events: transactionData.logs.events.map((transactionEvent) => {
        const smartContractEvent: SCEvent = {
          address: transactionEvent.address,
          data: transactionEvent.data,
          topics: transactionEvent.topics,
        };
        return smartContractEvent;
      }),
    };
    return detailedEvent;
  }

  async getTxlist(): Promise<EventDetail[]> {
    const txCount = await this.txCount(TRACKING_ADDRESS);

    let txHashes = [];
    const size = 1000;

    for (let from = 0; from < txCount; from += size) {
      const txBatch = await this.TxHashes(TRACKING_ADDRESS, from, size);
      txHashes = [...txHashes, ...txBatch];
    }

    const events = [];
    for (const hash of txHashes) {
      const event = await this.getTransactionDetail(hash);
      events.push(event);
    }
    return events;
  }
}
