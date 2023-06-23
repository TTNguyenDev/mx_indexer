// Must be at top
import 'reflect-metadata';

import { createConnection } from 'typeorm';

import { typeOrmConfig } from './config';
import { CrawlerService } from './crawler/crawler.service';
import ScEvent from './models/ScEvent';

const TRACKING_ADDRESS =
    'erd1qqqqqqqqqqqqqpgqv49mkah22xp5eypz78jc3t56yyww59tgjpqsu5lhht';
const TRACKING_EVENTS = ['propose_event'];

(async () => {
    // App's main content. For example, this could be an Express or console app.
    const conn = await createConnection(typeOrmConfig);
    console.log('PG connected. App is ready to do work.');

    let crawlerService = new CrawlerService();
    let result = await crawlerService.getTxlist(TRACKING_ADDRESS);

    const scEvent = conn.getRepository(ScEvent);
    for (const r of result) {

        let event = new ScEvent();
        event.txHash = r.txHash;
        event.timestamp = r.timestamp!;
        event.contractAddress = r.address!;
        event.eventName = r.eventName!;
        event = await scEvent.save(event); // re-assign to know assigned id
        console.log(`\nEvent saved: ${JSON.stringify(event)}`);
    }
    await conn.close();
    console.log('PG connection closed.');
})();
