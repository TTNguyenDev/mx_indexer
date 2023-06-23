import fetch from 'node-fetch';
import { Event } from './crawler.entity';

// Defaults
const BASE_URL = 'https://devnet-api.multiversx.com';

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

  async getTransactionDetail(transactionHash: string): Promise<any> {
    const requestUrl = `${BASE_URL}/transactions/${transactionHash}`;
    const transactionResponse = await fetch(requestUrl);
    const transactionData = await transactionResponse.json();
    return transactionData;
  }

  async filterEvent(data: any, trackedTopics: string[]): Promise<Event[] | undefined> {
    if (data.logs.events != undefined) {
      let events = data.logs.events;

      events = events.filter((v: any) => {
        let topic = Buffer.from(v.topics[0], 'base64').toString('utf8');
        if (trackedTopics.includes(topic)) {
          v.topics[0] = topic;
          return true;
        }
        return false;
      });

      events = events.map((item: any) => {
        const event: Event = {
          address: item.address ?? "",
          topics: item.topics ?? "",
          txHash: data.txHash ?? "",
          timestamp: data.timestamp ?? 12,
          data: data.data ?? "",
          eventName: item.topics[0] // Decoded topic is stored in eventName
        };
        return event;
      });

      return events;
    } else {
      return undefined;
    }
  }

  async getTxlist(address: string): Promise<Event[]> {
    const txCount = await this.txCount(address);

    let txHashes: string[] = [];
    const size = 1000;

    for (let from = 0; from < txCount; from += size) {
      const txBatch = await this.TxHashes(address, from, size);
      txHashes = [...txHashes, ...txBatch];
    }

    let events: Event[] = [];
    for (const hash of txHashes) {
      const event = await this.filterEvent(await this.getTransactionDetail(hash), ['propose_event']);
      events = [...events, ...event];
    }
    return events;
  }
}
