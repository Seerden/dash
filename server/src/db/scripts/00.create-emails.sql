-- this table mirrors the shape of the email object returned by the Resend API
CREATE TABLE if NOT EXISTS emails (
   id text NOT NULL PRIMARY KEY,
   object text NOT NULL,
   reply_to text[],
   from text NOT NULL,
   last_event text NOT NULL,
   to text[] NOT NULL,
   cc text[],
   bcc text[],
   subject text NOT NULL,
   text text,
   html text,
   scheduled_at text ,
   created_at text NOT NULL
)