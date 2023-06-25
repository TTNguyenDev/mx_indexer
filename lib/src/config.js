"use strict";
// Config that is common to more than one part of the app.
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
var ProposeEvent_1 = require("./models/ProposeEvent");
var VoteEvent_1 = require("./models/VoteEvent");
var typeOrmConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "typeormtest",
    password: "password",
    database: "typeormtest",
    synchronize: true,
    logging: false,
    entities: [ProposeEvent_1.ProposeEvent, VoteEvent_1.VoteEvent],
};
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=config.js.map