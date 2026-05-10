CREATE TABLE compliance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id UUID NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  maintenance_compliance_pct NUMERIC(5,2) NOT NULL,
  drill_compliance_pct NUMERIC(5,2) NOT NULL,
  overall_compliance_pct NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(ship_id, snapshot_date)
);

CREATE INDEX idx_snapshots_ship ON compliance_snapshots(ship_id);
CREATE INDEX idx_snapshots_date ON compliance_snapshots(snapshot_date);