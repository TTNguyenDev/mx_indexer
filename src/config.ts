// Config that is common to more than one part of the app.

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { ProposeEvent, VoteEvent } from "./crawler/dao/dao.crawler.entity";
import { CrawledTransactions } from "./crawler/entity";
import { Config } from "./common/config";

let config = new Config("./config/config.devnet.alpha.yaml");
const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: config.getDbConfig("host"),
    port: config.getDbConfig("port") as number,
    username: config.getDbConfig("username"),
    password: config.getDbConfig("password"),
    database: config.getDbConfig("name"),
    synchronize: true,
    logging: false,
    entities: [ProposeEvent, VoteEvent, CrawledTransactions],
};

export { typeOrmConfig };
