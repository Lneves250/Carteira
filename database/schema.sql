CREATE TABLE IF NOT EXISTS dashboard_snapshot (
  id smallint PRIMARY KEY CHECK (id = 1),
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON TABLE dashboard_snapshot FROM PUBLIC;
