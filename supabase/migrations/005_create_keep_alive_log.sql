CREATE TABLE keep_alive_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pinged_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT
);
