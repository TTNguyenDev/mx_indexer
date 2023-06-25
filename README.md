### TODO:

- Scan ABIs, convert event to Postgres Entities
  - Postgres table name will be "AshDepositor.EventA"
  - If Event properties contains a custom model, we need to create another table, and link the id
- Get from 0 to current block https://devnet-api.multiversx.com/accounts/erd1qqqqqqqqqqqqqpgqv49mkah22xp5eypz78jc3t56yyww59tgjpqsu5lhht/transfers?from=0&size=1&order=asc
  - For each batch (50), we count the return length array, update to db
  - For each batch (50), we update this batch into db
