-- users table
CREATE TABLE if NOT EXISTS users (
   user_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   username text UNIQUE NOT NULL,
   is_active boolean DEFAULT false,
   email text UNIQUE NOT NULL,
   password_hash text NOT NULL,
   created_at timestamptz DEFAULT now()
);

-- verification emails. we send an account verification email to each new user
CREATE TABLE if NOT EXISTS verification_emails (
   email_id text references emails ON DELETE CASCADE PRIMARY KEY,
   user_id bigint references users ON DELETE CASCADE,
   token text NOT NULL,
   created_at timestamptz DEFAULT now()
);