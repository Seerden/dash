CREATE TABLE IF NOT EXISTS price_action_1d (
   ticker         varchar(16) NOT NULL,
   "timestamp"    timestamptz NOT NULL,
   open           numeric(16,6) NOT NULL,
   "close"        numeric(16,6) NOT NULL,
   high           numeric(16,6) NOT NULL,
   low            numeric(16,6) NOT NULL,
   volume         numeric(14,2) NOT NULL,
   updated_at     timestamptz DEFAULT now(), -- this is here in case we need to adjust for splits etc. after insertion.
   PRIMARY KEY (ticker, "timestamp")
);

CREATE INDEX IF NOT EXISTS price_action_1d_ticker_idx ON price_action_1d(ticker);
CREATE INDEX IF NOT EXISTS price_action_1d_timestamp_idx ON price_action_1d USING brin("timestamp");
CREATE INDEX IF NOT EXISTS price_action_1d_ticker_timestamp_idx ON price_action_1d(ticker, "timestamp");
CREATE INDEX IF NOT EXISTS price_action_1d_volume_idx ON price_action_1d(volume);
CREATE INDEX IF NOT EXISTS price_action_1d_timestamp_volume_idx ON price_action_1d("timestamp", volume);
CREATE INDEX IF NOT EXISTS price_action_1d_timestamp_volume_ticker_idx ON price_action_1d("timestamp", volume, ticker);