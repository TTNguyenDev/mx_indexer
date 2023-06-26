var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
// import { ApiConfigService } from "src/common/api-config/api.config.service";
import { AbiRegistry, Address, SmartContract, BinaryCodec, } from "@multiversx/sdk-core/out";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import * as fs from "fs";
import { ProposeEvent } from "./../../models/ProposeEvent";
import { VoteEvent } from "./../../models/VoteEvent";
// Defaults
const BASE_URL = "https://devnet-api.multiversx.com";
export class DaoCrawlerService {
    constructor(
    // private readonly apiConfigService: ApiConfigService,
    address, events, dataSource) {
        const abiPath = "./src/abi/dao.abi.json";
        const contractAddress = "erd1qqqqqqqqqqqqqpgqw9623l42csqht9apczzg7xr0x3nhgxt0jpqsyupewg";
        const provider = "https://devnet-api.multiversx.com";
        const abi = this.getAbiRegistry(abiPath);
        if (abi != undefined) {
            this.abi = abi;
            this.sm = new SmartContract({
                address: new Address(contractAddress),
                abi: this.getAbiRegistry(abiPath),
            });
            this.provider = new ApiNetworkProvider(provider);
        }
        this.address = address;
        this.events = events;
        this.dataSource = dataSource;
    }
    getAbiRegistry(path) {
        const data = fs.readFileSync(path, { encoding: "utf-8" });
        return AbiRegistry.create(JSON.parse(data));
    }
    txCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = yield fetch(`${BASE_URL}/accounts/${this.address}/transfers/count`);
            return yield req.json();
        });
    }
    TxHashes(from, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const req = `${BASE_URL}/accounts/${this.address}/transfers?from=${from}&size=${size}`;
            const txResponse = yield fetch(req);
            return (yield txResponse.json())
                .map((tx) => {
                if (tx.status == "success") {
                    if (tx.type == "SmartContractResult") {
                        return tx.originalTxHash;
                    }
                    else {
                        return tx.txHash;
                    }
                }
                else {
                    return undefined;
                }
            })
                .filter((v) => v !== undefined);
        });
    }
    getTransactionDetail(transactionHash) {
        return __awaiter(this, void 0, void 0, function* () {
            this.abi;
            return yield this.provider.getTransaction(transactionHash);
        });
    }
    filterEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.logs.events != undefined) {
                let events = data.logs.events;
                events = events.filter((v) => {
                    let topic = Buffer.from(v.topics[0], "base64").toString("utf8");
                    if (this.events.includes(topic)) {
                        return true;
                    }
                    return false;
                });
                events = events.map((item) => {
                    console.log(typeof item.data);
                    console.log(Buffer.from(item.data));
                    let decodedValue = new BinaryCodec().decodeTopLevel(Buffer.from(item.data), this.abi.getStruct("ProposeEvent"));
                    console.log("\n\n ");
                    console.log(`${JSON.stringify(decodedValue)}`);
                    const event = {
                        address: item.address.value,
                        topics: item.topics,
                        txHash: data.hash,
                        timestamp: data.timestamp,
                        data: item.data,
                        eventName: item.topics[0].toString(), // Decoded topic is stored in eventName
                    };
                    return event;
                });
                return events;
            }
            else {
                return undefined;
            }
        });
    }
    saveToDb(events) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const e of events) {
                switch (e.eventName) {
                    case this.events[0]: {
                        let proposeEvent = this.dataSource.getRepository(ProposeEvent);
                        let event = new ProposeEvent();
                        event.txHash = e.txHash;
                        event.timestamp = e.timestamp;
                        event.contractAddress = e.address;
                        //TODO: Parse datas and map to ProposeEvent
                        event = yield proposeEvent.save(event);
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
                        event = yield voteEvent.save(event);
                        console.log(`\nEvent saved: ${JSON.stringify(event)}`);
                        break;
                    }
                }
            }
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const txCount = yield this.txCount();
            const size = 1000;
            for (let from = 0; from < txCount; from += size) {
                const txHashes = yield this.TxHashes(from, size);
                let acceptedEvents = [];
                for (const hash of txHashes) {
                    let txDetails = yield this.getTransactionDetail(hash);
                    const event = yield this.filterEvent(txDetails);
                    acceptedEvents = [...acceptedEvents, ...event];
                }
                //saveToDb will be call after crawling each batch
                //TODO: checkpoint need to be saved
                // await this.saveToDb(acceptedEvents);
            }
        });
    }
}
//# sourceMappingURL=dao.crawler.service.js.map