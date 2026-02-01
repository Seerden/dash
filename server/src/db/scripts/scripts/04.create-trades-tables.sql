begin;

create table if not exists trades (
   id bigint generated always as identity primary key,
   account text not null,
   ticker text not null,
   realized numeric(16,6) not null,
   unrealized numeric(16,6),
   duration numeric, -- is null when trade is open
   closed boolean default false,
   created_at timestamptz default now(),
   updated_at timestamptz default now()
);

create table if not exists tickets (
   id bigint generated always as identity primary key,
   account text not null,
   trade_id bigint references trades(id) on delete cascade not null,
   "timestamp" timestamptz not null,
   ticker varchar(10) not null,
   amount numeric not null,
   side varchar(4) not null, -- BC, SS, B, S; use an enum server-side probably?
   price numeric(16,6) not null
);

create table if not exists trades_meta (
   id bigint generated always as identity primary key,
   account text not null,
   ticker varchar(10) not null,
   ticket_id bigint references tickets(id) on delete cascade,
   "timestamp" timestamptz not null,
   "data" jsonb, -- TODO (DAS-58): refine this, do we allow putting anything in here? 
   "stop" numeric,
   target numeric,
   amount numeric,
   created_at timestamptz default now(),
   updated_at timestamptz default now()
);

create index on trades(account);
create index on trades(ticker);
create index on trades(closed);

create index on tickets(account);
create index on tickets(trade_id);
create index on tickets(ticker);
create index on tickets("timestamp");

create index on trades_meta(account);
create index on trades_meta(ticker);
create index on trades_meta("timestamp");

commit;