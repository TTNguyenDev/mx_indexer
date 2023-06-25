// Must be at top
import "reflect-metadata";

import { createConnection } from "typeorm";

import { typeOrmConfig } from "./config";
import * as Crawler from "./crawler";

const TRACKING_ADDRESS =
    "erd1qqqqqqqqqqqqqpgqv49mkah22xp5eypz78jc3t56yyww59tgjpqsu5lhht";
const TRACKING_EVENTS = ["propose_event", "vote_event"];

(async () => {
    // App's main content. For example, this could be an Express or console app.
    const conn = await createConnection(typeOrmConfig);
    console.log("PG connected. App is ready to do work.");

    let crawlerService = new Crawler.DaoCrawlerService(
        TRACKING_ADDRESS,
        TRACKING_EVENTS,
        conn
    );
    await crawlerService.run();
    await conn.close();
    console.log("PG connection closed.");
})();
