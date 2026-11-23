-- À exécuter UNIQUEMENT si la table leads existe déjà avec l'ancien schéma.
ALTER TABLE leads ADD COLUMN estimated_value REAL NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN next_follow_up TEXT;
ALTER TABLE leads ADD COLUMN next_action TEXT;
ALTER TABLE leads ADD COLUMN notes TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads(next_follow_up);