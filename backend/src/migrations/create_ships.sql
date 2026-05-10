CREATE TABLE ships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER ships_updated_at
  BEFORE UPDATE ON ships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE ship_crew (
  ship_id UUID REFERENCES ships(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (ship_id, user_id)
);

CREATE INDEX idx_ship_crew_user ON ship_crew(user_id);
CREATE INDEX idx_ship_crew_ship ON ship_crew(ship_id);
CREATE INDEX idx_ship_crew_active ON ship_crew(is_active);