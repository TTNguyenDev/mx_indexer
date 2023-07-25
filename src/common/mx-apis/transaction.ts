import { Config } from "../config";

let config = new Config("./config/config.yaml");

// Common Event Interface
export interface Event {
  id: string;
  txHash?: string;
  timestamp?: number;
  address?: string;
  topics?: string[];
  data?: any;
  eventName?: string;
}

export async function txCount(address: string): Promise<number> {
  const req = await fetch(
    `${config.getApiUrl()}/accounts/${address}/transfers/count`,
  );
  return await req.json();
}

export async function TxHashes(
  address: string,
  from: number,
  size: number,
): Promise<[string[], number]> {
  const req = `${config.getApiUrl()}/accounts/${address}/transfers?from=${from}&size=${size}`;
  console.log(req);
  const txResponse = await fetch(req);
  const jsonResponse = (await txResponse.json()) as any[];
  return [
    jsonResponse
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
      .filter((v) => v !== undefined),
    jsonResponse.length,
  ];
}

export async function getTransactionDetail(hash: string): Promise<any> {
  const req = `${config.getApiUrl()}/transactions/${hash}`;
  const txResponse = await fetch(req);
  return (await txResponse.json()) as any[];
}

export async function filterEvent(
  trackingEvent: string[],
  data: any,
): Promise<Event[] | undefined> {
  if (data.logs.events != undefined) {
    let events = data.logs.events;

    events = events.filter((v: any) => {
      let topic = Buffer.from(v.topics[0], "base64").toString("utf8");
      if (trackingEvent.includes(topic)) {
        return true;
      }
      return false;
    });

    events = events.map((item: any) => {
      const event: Event = {
        id: `${data.txHash}_${item.order}`,
        address: item.address,
        topics: item.topics,
        txHash: data.txHash,
        timestamp: data.timestamp,
        data: Buffer.from(item.data, "base64"),
        eventName: atob(item.topics[0].toString()), // Decoded topic is stored in eventName
      };
      return event;
    });
    return events;
  } else {
    return undefined;
  }
}
