import { Event } from "./../crawler.entity";
import { DataSource } from "typeorm";
import { AbiRegistry } from "@multiversx/sdk-core/out";
export declare class DaoCrawlerService {
    address: string;
    events: string[];
    dataSource: DataSource;
    provider: any;
    sm: any;
    abi: AbiRegistry;
    constructor(address: string, events: string[], dataSource: DataSource);
    getAbiRegistry(path: string): AbiRegistry | undefined;
    txCount(): Promise<number>;
    TxHashes(from: number, size: number): Promise<string[]>;
    getTransactionDetail(transactionHash: string): Promise<any>;
    filterEvent(data: any): Promise<Event[] | undefined>;
    saveToDb(events: Event[]): Promise<void>;
    run(): Promise<void>;
}
