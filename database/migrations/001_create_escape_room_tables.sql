-- Create Teams Table
CREATE TABLE IF NOT EXISTS teams_escaperoom_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT NOT NULL,
    player_names TEXT[] NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    game_state TEXT NOT NULL DEFAULT 'setup' CHECK (game_state IN ('setup', 'playing', 'paused', 'completed')),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_stage INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    stages_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions_escaperoom_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams_escaperoom_2024(id) ON DELETE CASCADE,
    session_data JSONB DEFAULT '{}',
    stage_progress INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    puzzle_states JSONB DEFAULT '{}',
    incorrect_attempts JSONB DEFAULT '{}',
    game_stats JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Puzzle Attempts Table
CREATE TABLE IF NOT EXISTS puzzle_attempts_escaperoom_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams_escaperoom_2024(id) ON DELETE CASCADE,
    stage_index INTEGER NOT NULL,
    puzzle_id TEXT NOT NULL,
    attempt_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    attempt_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings_escaperoom_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Audio Assets Table
CREATE TABLE IF NOT EXISTS audio_assets_escaperoom_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_key TEXT UNIQUE NOT NULL,
    asset_url TEXT NOT NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('music', 'narration', 'sfx')),
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Game Statistics Table
CREATE TABLE IF NOT EXISTS game_statistics_escaperoom_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams_escaperoom_2024(id) ON DELETE CASCADE,
    total_time_seconds INTEGER DEFAULT 0,
    puzzles_solved INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    incorrect_attempts INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    performance_score DECIMAL(8,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE teams_escaperoom_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions_escaperoom_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzle_attempts_escaperoom_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings_escaperoom_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_assets_escaperoom_2024 ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_statistics_escaperoom_2024 ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Teams
CREATE POLICY "Allow all operations on teams" ON teams_escaperoom_2024
    FOR ALL USING (true) WITH CHECK (true);

-- Create RLS Policies for Game Sessions
CREATE POLICY "Allow all operations on game_sessions" ON game_sessions_escaperoom_2024
    FOR ALL USING (true) WITH CHECK (true);

-- Create RLS Policies for Puzzle Attempts
CREATE POLICY "Allow all operations on puzzle_attempts" ON puzzle_attempts_escaperoom_2024
    FOR ALL USING (true) WITH CHECK (true);

-- Create RLS Policies for Admin Settings
CREATE POLICY "Allow all operations on admin_settings" ON admin_settings_escaperoom_2024
    FOR ALL USING (true) WITH CHECK (true);

-- Create RLS Policies for Audio Assets
CREATE POLICY "Allow all operations on audio_assets" ON audio_assets_escaperoom_2024
    FOR ALL USING (true) WITH CHECK (true);

-- Create RLS Policies for Game Statistics
CREATE POLICY "Allow all operations on game_statistics" ON game_statistics_escaperoom_2024
    FOR ALL USING (true) WITH CHECK (true);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_teams_game_state ON teams_escaperoom_2024(game_state);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams_escaperoom_2024(created_at);
CREATE INDEX IF NOT EXISTS idx_teams_difficulty ON teams_escaperoom_2024(difficulty);
CREATE INDEX IF NOT EXISTS idx_teams_current_stage ON teams_escaperoom_2024(current_stage);

CREATE INDEX IF NOT EXISTS idx_game_sessions_team_id ON game_sessions_escaperoom_2024(team_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_team_id ON puzzle_attempts_escaperoom_2024(team_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_stage_puzzle ON puzzle_attempts_escaperoom_2024(stage_index, puzzle_id);

CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings_escaperoom_2024(setting_key);
CREATE INDEX IF NOT EXISTS idx_audio_assets_key ON audio_assets_escaperoom_2024(asset_key);
CREATE INDEX IF NOT EXISTS idx_audio_assets_type ON audio_assets_escaperoom_2024(asset_type);
CREATE INDEX IF NOT EXISTS idx_audio_assets_active ON audio_assets_escaperoom_2024(is_active);

CREATE INDEX IF NOT EXISTS idx_game_statistics_team_id ON game_statistics_escaperoom_2024(team_id);

-- Create Functions for Updated Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers for Updated Timestamps
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams_escaperoom_2024
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions_escaperoom_2024
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings_escaperoom_2024
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_assets_updated_at BEFORE UPDATE ON audio_assets_escaperoom_2024
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_statistics_updated_at BEFORE UPDATE ON game_statistics_escaperoom_2024
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Default Admin Settings
INSERT INTO admin_settings_escaperoom_2024 (setting_key, setting_value) 
VALUES 
    ('game_settings', '{"timeLimit": 3600, "hintsEnabled": true, "audioEnabled": true, "difficulty": "medium"}'),
    ('system_config', '{"maxTeams": 100, "autoSave": true, "realTimeUpdates": true}')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert Default Audio Assets (Examples)
INSERT INTO audio_assets_escaperoom_2024 (asset_key, asset_url, asset_type, category) 
VALUES 
    ('ambient', '/audio/ambient-default.mp3', 'music', 'ambient'),
    ('tension', '/audio/tension-default.mp3', 'music', 'tension'),
    ('success', '/audio/success-default.mp3', 'music', 'success'),
    ('background', '/audio/background-default.mp3', 'music', 'background'),
    ('stage1Intro', '/audio/stage1-intro-default.mp3', 'narration', 'stage_intro'),
    ('stage2Intro', '/audio/stage2-intro-default.mp3', 'narration', 'stage_intro'),
    ('stage3Intro', '/audio/stage3-intro-default.mp3', 'narration', 'stage_intro'),
    ('stage4Intro', '/audio/stage4-intro-default.mp3', 'narration', 'stage_intro'),
    ('stage5Intro', '/audio/stage5-intro-default.mp3', 'narration', 'stage_intro'),
    ('stage6Intro', '/audio/stage6-intro-default.mp3', 'narration', 'stage_intro'),
    ('voiceMessage', '/audio/voice-message-default.mp3', 'narration', 'character'),
    ('drBlackwoodRecording', '/audio/dr-blackwood-default.mp3', 'narration', 'character'),
    ('curatorXMessage', '/audio/curator-x-default.mp3', 'narration', 'character'),
    ('finalMessage', '/audio/final-message-default.mp3', 'narration', 'character'),
    ('hintAudio', '/audio/hint-notification.mp3', 'sfx', 'notification'),
    ('successSound', '/audio/success-sound.mp3', 'sfx', 'notification'),
    ('errorSound', '/audio/error-sound.mp3', 'sfx', 'notification'),
    ('puzzleComplete', '/audio/puzzle-complete.mp3', 'sfx', 'notification')
ON CONFLICT (asset_key) DO NOTHING;