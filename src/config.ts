// Config that is common to more than one part of the app.

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { DAOAction, DAOConfig, DAOProposal, ProposeEvent } from "./models/ProposeEvent";
import { VoteEvent } from "./models/VoteEvent";

const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "typeormtest",
    password: "password",
    database: "typeormtest",
    synchronize: true,
    logging: false,
    entities: [ProposeEvent, VoteEvent, DAOProposal, DAOAction, DAOConfig],
};

export { typeOrmConfig };
