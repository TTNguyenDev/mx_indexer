import fetch from "node-fetch";
import { Event } from "./../crawler.entity";
import { DataSource, Repository } from "typeorm";
import * as toHex from 'to-hex';

// import { ApiConfigService } from "src/common/api-config/api.config.service";
import {
  AbiRegistry,
  Address,
  SmartContract,
  ResultsParser,
  BinaryCodec,
  BigUIntType,
  CustomType,
  StructType,
  U32Type,
  AddressType,
} from "@multiversx/sdk-core/out";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import * as fs from "fs";
import { DAOAction, DAOConfig, DAOProposal, ProposeEvent } from "./../../models/ProposeEvent";
import { VoteEvent } from "./../../models/VoteEvent";

// Defaults
const BASE_URL = "https://devnet-api.multiversx.com";

export class DaoCrawlerService {
  address: string;
  events: string[];
  dataSource: DataSource;
  provider: any;
  sm: any;
  abi: AbiRegistry;

  constructor(
    // private readonly apiConfigService: ApiConfigService,
    address: string,
    events: string[],
    dataSource: DataSource
  ) {
    const abiPath = "./src/abi/dao.abi.json";
    const contractAddress =
      "erd1qqqqqqqqqqqqqpgqw9623l42csqht9apczzg7xr0x3nhgxt0jpqsyupewg";
    const provider = "https://devnet-api.multiversx.com";
    const abi = this.getAbiRegistry(abiPath);
    if (abi != undefined) {
      this.abi = abi;
      this.sm = new SmartContract({
        address: new Address(contractAddress),
        abi: this.getAbiRegistry(abiPath) as AbiRegistry,
      });
      this.provider = new ApiNetworkProvider(provider);
    }

    this.address = address;
    this.events = events;
    this.dataSource = dataSource;
  }

  getAbiRegistry(path: string): AbiRegistry | undefined {
    const data = fs.readFileSync(path, { encoding: "utf-8" });
    return AbiRegistry.create(JSON.parse(data));
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

  async getTransactionDetail(hash: string): Promise<any> {
    const req = `${BASE_URL}/transactions/${hash}`;
    const txResponse = await fetch(req);
    return ((await txResponse.json()) as any[])
  }

  async filterEvent(data: any): Promise<Event[] | undefined> {
    if (data.logs.events != undefined) {
      let events = data.logs.events;

      events = events.filter((v: any) => {
        let topic = Buffer.from(v.topics[0], "base64").toString("utf8");
        if (this.events.includes(topic)) {
          return true;
        }
        return false;
      });

      events = events.map((item: any) => {
        const event: Event = {
          address: item.address,
          topics: item.topics,
          txHash: data.txHash,
          timestamp: data.timestamp,
          data: Buffer.from(item.data, "base64"),
          eventName: atob(item.topics[0].toString()), // Decoded topic is stored in eventName
        };

        // console.log(event);
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
          let u32type = new BinaryCodec().decodeTopLevel(Buffer.from(e.topics[1], "base64"), new U32Type());
          let address = new BinaryCodec().decodeTopLevel(Buffer.from(e.topics[2], "base64"), new AddressType());
          event.proposal_id = u32type.valueOf().toFixed(0);
          event.caller = address.valueOf().bech32();

          let daoProposal = new DAOProposal();
          let decodedValue = new BinaryCodec().decodeTopLevel(e.data, this.abi.getStruct("DAOProposal"));

          let daoAction = new DAOAction();
          daoAction.dest_address = decodedValue.valueOf().action.dest_address.bech32();
          daoAction.function_name = decodedValue.valueOf().action.function_name.valueOf();
          let daoActionRep = this.dataSource.getRepository(DAOAction);
          daoAction = await daoActionRep.save(daoAction);
          daoProposal.action = daoAction.id;

          let daoConfig = new DAOConfig();
          daoConfig.min_power_for_propose = decodedValue.valueOf().config.min_power_for_propose.valueOf();
          daoConfig.min_time_for_propose = decodedValue.valueOf().config.min_time_for_propose.valueOf();

          daoConfig.min_support_pct = decodedValue.valueOf().config.min_support_pct.valueOf();
          daoConfig.min_quorum_pct = decodedValue.valueOf().config.min_quorum_pct.valueOf();
          daoConfig.voting_time_limit = decodedValue.valueOf().config.voting_time_limit.valueOf();
          daoConfig.queue_time_limit = decodedValue.valueOf().config.queue_time_limit.valueOf();
          daoConfig.execute_time_limit = decodedValue.valueOf().config.execute_time_limit.valueOf();
          let daoConfigRep = this.dataSource.getRepository(DAOConfig);
          daoConfig = await daoConfigRep.save(daoConfig);
          daoProposal.config = daoConfig.id;

          daoProposal.proposer = decodedValue.valueOf().proposer.bech32();
          daoProposal.metadata = decodedValue.valueOf().metadata.valueOf();
          daoProposal.created_at = decodedValue.valueOf().created_at.valueOf();
          daoProposal.total_supply = decodedValue.valueOf().total_supply.valueOf();
          daoProposal.yes_vote = decodedValue.valueOf().yes_vote.valueOf();
          daoProposal.no_vote = decodedValue.valueOf().no_vote.valueOf();
          daoProposal.executed_at = decodedValue.valueOf().executed_at.valueOf();
          daoProposal.executed_by = decodedValue.valueOf().executed_by.bech32();
          let daoProposalRep = this.dataSource.getRepository(DAOProposal);
          daoProposal = await daoProposalRep.save(daoProposal);

          event.proposal = daoProposal.id;
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

function base64ToInt(base64String: string): number {
  const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
  const result = parseInt(decodedString, 10);
  if (isNaN(result)) {
    throw new Error('Decoded base64 string could not be converted to an integer');
  }
  return result;
}
