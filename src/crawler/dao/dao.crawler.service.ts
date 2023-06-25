import fetch from "node-fetch";
import { Event } from "./../crawler.entity";
import { DataSource, Repository } from "typeorm";
import { ProposeEvent } from "src/models/ProposeEvent";
import { VoteEvent } from "src/models/VoteEvent";

// Defaults
const BASE_URL = "https://devnet-api.multiversx.com";

export class DaoCrawlerService {
  address: string;
  events: string[];
  dataSource: DataSource;
  constructor(address: string, events: string[], dataSource: DataSource) {
    this.address = address;
    this.events = events;
    this.dataSource = dataSource;
  }

  async txCount(): Promise<number> {
    const req = await fetch(
      `${BASE_URL}/accounts/${this.address}/transfers/count`
    );
    return await req.json();
  }

  async TxHashes(from: number, size: number): Promise<string[]> {
    const req = `${BASE_URL}/accounts/${this.address}/transfers?from=${from}&size=${size}`;
    const txResponse = await fetch(req);
    return ((await txResponse.json()) as any[])
      .map((tx: any) => {
        if (tx.status == "success") {
          if (tx.type == "SmartContractResult") {
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

  async filterEvent(data: any): Promise<Event[] | undefined> {
    if (data.logs.events != undefined) {
      let events = data.logs.events;

      events = events.filter((v: any) => {
        let topic = Buffer.from(v.topics[0], "base64").toString("utf8");
        if (this.events.includes(topic)) {
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
          eventName: item.topics[0], // Decoded topic is stored in eventName
        };
        return event;
      });

      return events;
    } else {
      return undefined;
    }
  }

  async saveToDb(events: Event[]) {
    for (const e of events) {
      switch (e.eventName) {
        case this.events[0]: {
          let proposeEvent = this.dataSource.getRepository(ProposeEvent);
          let event = new ProposeEvent();
          event.txHash = e.txHash;
          event.timestamp = e.timestamp;
          event.contractAddress = e.address;

          //TODO: Parse datas and map to ProposeEvent
          event = await proposeEvent.save(event);
          console.log(`\nEvent saved: ${JSON.stringify(event)}`);
          break;
        }
        case this.events[1]: {
          let voteEvent = this.dataSource.getRepository(VoteEvent);
          let event = new VoteEvent();
          event.txHash = e.txHash;
          event.timestamp = e.timestamp;
          event.contractAddress = e.address;

          //TODO: Parse datas and map to ProposeEvent
          event = await voteEvent.save(event);
          console.log(`\nEvent saved: ${JSON.stringify(event)}`);
          break;
        }
      }
    }
  }

  async run() {
    const txCount = await this.txCount();

    const size = 1000;

    for (let from = 0; from < txCount; from += size) {
      const txHashes = await this.TxHashes(from, size);
      let acceptedEvents: Event[] = [];
      for (const hash of txHashes) {
        let txDetails = await this.getTransactionDetail(hash);
        const event = await this.filterEvent(txDetails);
        acceptedEvents = [...acceptedEvents, ...event];
      }

      //saveToDb will be call after crawling each batch
      //TODO: checkpoint need to be saved
      await this.saveToDb(acceptedEvents);
    }
  }
}
