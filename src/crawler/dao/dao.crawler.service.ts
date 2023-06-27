import fetch from "node-fetch";
import { DataSource } from "typeorm";
import * as mxApis from "./../../common/mx-apis/";
import * as codec from "../../common/codec/";

import {
  AbiRegistry,
  BinaryCodec,
  U32Type,
  AddressType,
} from "@multiversx/sdk-core/out";
import * as fs from "fs";
import { ProposeEvent, VoteEvent } from "./dao.crawler.entity";
import { Config } from "src/common/config";
import { CrawledTransactions } from "../entity";
import { json } from "stream/consumers";

export class DaoCrawlerService {
  address: string;
  events: string[];
  dataSource: DataSource;
  abi: AbiRegistry;
  config: Config;

  constructor(
    config: Config,
    address: string,
    events: string[],
    dataSource: DataSource
  ) {
    const abiPath = config.getContractAbiPath("dao");
    const abi = this.getAbiRegistry(abiPath);
    if (abi != undefined) {
      this.abi = abi;
    }

    this.address = address;
    this.events = events;
    this.dataSource = dataSource;
    this.config = config;
  }

  getAbiRegistry(path: string): AbiRegistry | undefined {
    const data = fs.readFileSync(path, { encoding: "utf-8" });
    return AbiRegistry.create(JSON.parse(data));
  }

  async saveToDb(events: mxApis.Event[]) {
    for (const e of events) {
      switch (e.eventName) {
        case this.events[0]: {
          let proposeEvent = this.dataSource.getRepository(ProposeEvent);
          let event = new ProposeEvent();
          event.txHash = e.txHash;
          event.timestamp = e.timestamp;
          event.contractAddress = e.address;

          //TODO: Parse datas and map to ProposeEvent
          event.proposal_id = codec.decodeU32(e.topics[1]);
          event.caller = codec.decodeAddress(e.topics[2]);

          let decodedValue = new BinaryCodec()
            .decodeTopLevel(e.data, this.abi.getStruct("DAOProposal"))
            .valueOf();

          //Proposal action
          event.proposal__action__dest_address =
            decodedValue.action.dest_address.bech32();
          event.proposal__action__function_name =
            codec.encodeBytes(decodedValue.action.function_name);
          event.proposal__action__arguments = codec.encodeArrayBytes(decodedValue.action.arguments);
          event.proposal__config__min_time_for_propose =
            decodedValue.config.min_time_for_propose.valueOf();

          event.proposal__config__min_support_pct =
            event.proposal__config__min_power_for_propose =
            decodedValue.config.min_power_for_propose.valueOf();
          decodedValue.config.min_support_pct.valueOf();
          event.proposal__config__min_quorum_pct =
            decodedValue.config.min_quorum_pct.valueOf();
          event.proposal__config__voting_time_limit =
            decodedValue.config.voting_time_limit.valueOf();
          event.proposal__config__queue_time_limit =
            decodedValue.config.queue_time_limit.valueOf();
          event.proposal__config__execute_time_limit =
            decodedValue.config.execute_time_limit.valueOf();

          event.proposal__proposer = decodedValue.proposer.bech32();
          event.proposal__metadata = codec.encodeBytes(decodedValue.metadata);
          event.proposal__created_at = decodedValue.created_at.valueOf();
          event.proposal__total_supply = decodedValue.total_supply.valueOf();
          event.proposal__yes_vote = decodedValue.yes_vote.valueOf();
          event.proposal__no_vote = decodedValue.no_vote.valueOf();
          event.proposal__executed_at = decodedValue.executed_at.valueOf();
          event.proposal__executed_by = decodedValue.executed_by.bech32();

          event = await proposeEvent.save(event);
          console.log(`\nPropose Event saved: ${JSON.stringify(event)}`);
          break;
        }
        case this.events[1]: {
          let voteEvent = this.dataSource.getRepository(VoteEvent);
          let event = new VoteEvent();
          event.txHash = e.txHash;
          event.timestamp = e.timestamp;
          event.contractAddress = e.address;

          //TODO: Parse datas and map to ProposeEvent
          event.proposal_id = codec.decodeU32(e.topics[1]);
          event.caller = codec.decodeAddress(e.topics[2]);

          let decodedValue = new BinaryCodec().decodeTopLevel(
            e.data,
            this.abi.getStruct("Voting")
          );
          event.voting__yes_vote = decodedValue
            .valueOf()
            .voting.yes_vote.valueOf();
          event.voting__no_vote = decodedValue
            .valueOf()
            .voting.no_vote.valueOf();
          event = await voteEvent.save(event);
          console.log(`\nVote Event saved: ${JSON.stringify(event)}`);
          break;
        }
      }
    }
  }

  async getCheckpoint(): Promise<number> {
    let repository = this.dataSource.getRepository(CrawledTransactions);
    const entity = await repository.findOne({ where: { abiName: "dao" } });

    if (entity) {
      // The entity with the specified name was found
      console.log(entity);
      return entity.count;
    } else {
      // No entity with the specified name was found
      console.log('No entity found.');
      return 0;
    }

  }
  async saveCheckpoint(value: number) {
    let repository = this.dataSource.getRepository(CrawledTransactions);
    let entity = await repository.findOne({ where: { abiName: "dao" } });

    if (entity) {
      // The entity with the specified name was found
      console.log(entity);
      entity.count += value;
      await repository.save(entity);
    } else {
      // No entity with the specified name was found
      console.log('No entity found.');
      let newEntity = new CrawledTransactions();
      newEntity.abiName = 'dao';
      newEntity.count = value;
      await repository.save(newEntity);
    }
    console.log("New checkpoint saved");
  }

  async run() {
    while (true) {
      const txCount = await mxApis.txCount(this.address);
      let begin = await this.getCheckpoint();

      console.log(txCount);
      if (txCount <= begin + 1 /*Because checkpoint starts from zero*/) {
        console.log("All txs were crawled");
        await sleep(3000);
        continue;
      }
      const size = this.config.getBatchSize();

      for (let from = begin; from < txCount; from += size) {
        const txHashes = await mxApis.TxHashes(this.address, from, size);
        let acceptedEvents: mxApis.Event[] = [];
        for (const hash of txHashes) {
          let txDetails = await mxApis.getTransactionDetail(hash);
          const event = await mxApis.filterEvent(this.events, txDetails);
          acceptedEvents = [...acceptedEvents, ...event];
        }

        //saveToDb will be call after crawling each batch
        //TODO: checkpoint need to be saved
        await this.saveToDb(acceptedEvents);
        await this.saveCheckpoint(txHashes.length);
      }
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
