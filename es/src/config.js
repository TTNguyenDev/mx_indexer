// Config that is common to more than one part of the app.
import { ProposeEvent } from "./models/ProposeEvent";
import { VoteEvent } from "./models/VoteEvent";
const typeOrmConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "typeormtest",
    password: "password",
    database: "typeormtest",
    synchronize: true,
    logging: false,
    entities: [ProposeEvent, VoteEvent],
};
export { typeOrmConfig };
//# sourceMappingURL=config.js.map