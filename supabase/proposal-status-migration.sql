-- Orbit Forum — Add status column to posts for proposal workflow
-- Run in Supabase SQL Editor

alter table posts add column if not exists status text not null default 'Discussion';

-- Valid values: Discussion | Voting | Approved | Rejected
-- Only posts with type = 'Proposal' use this column meaningfully.
