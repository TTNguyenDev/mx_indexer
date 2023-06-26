var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Must be at top
import "reflect-metadata";
import { createConnection } from "typeorm";
import { typeOrmConfig } from "./config";
import * as Crawler from "./crawler";
// import { ApiConfigService } from "./common/api-config/api.config.service";
// import { ConfigService } from "@nestjs/config";
import { readConfig } from "./../config/configuration";
const TRACKING_ADDRESS = "erd1qqqqqqqqqqqqqpgqv49mkah22xp5eypz78jc3t56yyww59tgjpqsu5lhht";
const TRACKING_EVENTS = ["propose_event"];
(() => __awaiter(void 0, void 0, void 0, function* () {
    // App's main content. For example, this could be an Express or console app.
    const conn = yield createConnection(typeOrmConfig);
    console.log("PG connected. App is ready to do work.");
    readConfig();
    // let config = new ApiConfigService(new ConfigService());
    //
    let crawlerService = new Crawler.DaoCrawlerService(
    // config,
    TRACKING_ADDRESS, TRACKING_EVENTS, conn);
    yield crawlerService.run();
    yield conn.close();
    console.log("PG connection closed.");
}))();
//# sourceMappingURL=index.js.map