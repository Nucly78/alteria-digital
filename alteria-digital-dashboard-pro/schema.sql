CREATE TABLE IF NOT EXISTS leads (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 company TEXT,
 email TEXT NOT NULL,
 phone TEXT,
 activity TEXT,
 message TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'nouveau',
 estimated_value REAL NOT NULL DEFAULT 0,
 next_follow_up TEXT,
 next_action TEXT,
 notes TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(next_follow_up);