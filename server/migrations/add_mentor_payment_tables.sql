-- Migration: Add Mentorship Sessions and Payment Requests tables
-- Created: 2025-01-10

-- Create mentorship_sessions table
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id),
  client_id INTEGER NOT NULL REFERENCES users(id),
  session_type TEXT NOT NULL, -- 'career_guidance', 'interview_prep', 'skill_development'
  duration INTEGER NOT NULL, -- in minutes
  rate TEXT NOT NULL, -- session fee
  scheduled_at TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payment_requests table
CREATE TABLE IF NOT EXISTS payment_requests (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id),
  client_phone TEXT NOT NULL,
  client_name TEXT,
  amount TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'paid', 'failed'
  transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_mentor_id ON mentorship_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_client_id ON mentorship_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_status ON mentorship_sessions(status);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_payment_status ON mentorship_sessions(payment_status);
CREATE INDEX IF NOT EXISTS idx_mentorship_sessions_scheduled_at ON mentorship_sessions(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_payment_requests_mentor_id ON payment_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_transaction_id ON payment_requests(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_created_at ON payment_requests(created_at);

-- Insert sample data for testing
INSERT INTO mentorship_sessions (mentor_id, client_id, session_type, duration, rate, scheduled_at, status, payment_status, notes)
VALUES 
  (1, 2, 'career_guidance', 60, '150.00', NOW() - INTERVAL '1 day', 'completed', 'pending', 'Career guidance session focused on tech industry'),
  (1, 3, 'interview_prep', 45, '120.00', NOW() + INTERVAL '2 days', 'scheduled', 'pending', 'Interview preparation for software engineering role'),
  (1, 2, 'skill_development', 90, '200.00', NOW() - INTERVAL '3 days', 'completed', 'paid', 'Python programming skills development session');

INSERT INTO payment_requests (mentor_id, client_phone, client_name, amount, description, status)
VALUES 
  (1, '+27123456789', 'John Doe', '150.00', 'Career guidance session payment', 'sent'),
  (1, '+27987654321', 'Jane Smith', '300.00', 'Monthly mentorship package', 'pending');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mentorship_sessions_updated_at 
    BEFORE UPDATE ON mentorship_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_requests_updated_at 
    BEFORE UPDATE ON payment_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
