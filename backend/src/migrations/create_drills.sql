CREATE TABLE safety_drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id UUID NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  drill_type VARCHAR(50) NOT NULL
    CHECK (drill_type IN ('fire', 'evacuation', 'man_overboard', 'abandon_ship', 'medical')),
  scheduled_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'missed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER drills_updated_at
  BEFORE UPDATE ON safety_drills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE drill_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drill_id UUID NOT NULL REFERENCES safety_drills(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(drill_id, user_id),

  CONSTRAINT attendance_consistency
    CHECK (
      (attended = TRUE AND submitted_at IS NOT NULL) OR
      (attended = FALSE AND submitted_at IS NULL)
    )
);

CREATE INDEX idx_drills_ship ON safety_drills(ship_id);
CREATE INDEX idx_drills_status ON safety_drills(status);
CREATE INDEX idx_drills_scheduled ON safety_drills(scheduled_date);
CREATE INDEX idx_attendance_drill ON drill_attendance(drill_id);
CREATE INDEX idx_attendance_user ON drill_attendance(user_id);