import { createClient } from '@supabase/supabase-js'

// These will be injected with your actual credentials
const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

if (SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
  console.warn('Supabase credentials not configured. Using demo mode.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Database helper functions
export const dbHelpers = {
  // Teams
  async createTeam(teamData) {
    const { data, error } = await supabase
      .from('teams_escaperoom_2024')
      .insert([teamData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTeam(teamId, updates) {
    const { data, error } = await supabase
      .from('teams_escaperoom_2024')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getTeam(teamId) {
    const { data, error } = await supabase
      .from('teams_escaperoom_2024')
      .select('*')
      .eq('id', teamId)
      .single()
    
    if (error) throw error
    return data
  },

  async getAllActiveTeams() {
    const { data, error } = await supabase
      .from('teams_escaperoom_2024')
      .select('*')
      .in('game_state', ['playing', 'paused'])
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Game Sessions
  async createGameSession(sessionData) {
    const { data, error } = await supabase
      .from('game_sessions_escaperoom_2024')
      .insert([sessionData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateGameSession(teamId, sessionData) {
    const { data, error } = await supabase
      .from('game_sessions_escaperoom_2024')
      .update({ session_data: sessionData })
      .eq('team_id', teamId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getGameSession(teamId) {
    const { data, error } = await supabase
      .from('game_sessions_escaperoom_2024')
      .select('*')
      .eq('team_id', teamId)
      .single()
    
    if (error) throw error
    return data
  },

  // Puzzle Attempts
  async recordPuzzleAttempt(attemptData) {
    const { data, error } = await supabase
      .from('puzzle_attempts_escaperoom_2024')
      .insert([attemptData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getPuzzleAttempts(teamId, stageIndex = null, puzzleId = null) {
    let query = supabase
      .from('puzzle_attempts_escaperoom_2024')
      .select('*')
      .eq('team_id', teamId)
    
    if (stageIndex !== null) {
      query = query.eq('stage_index', stageIndex)
    }
    
    if (puzzleId !== null) {
      query = query.eq('puzzle_id', puzzleId)
    }
    
    const { data, error } = await query.order('attempt_time', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Admin Settings
  async getAdminSettings(settingKey) {
    const { data, error } = await supabase
      .from('admin_settings_escaperoom_2024')
      .select('setting_value')
      .eq('setting_key', settingKey)
      .single()
    
    if (error) throw error
    return data.setting_value
  },

  async updateAdminSettings(settingKey, settingValue) {
    const { data, error } = await supabase
      .from('admin_settings_escaperoom_2024')
      .upsert([{ setting_key: settingKey, setting_value: settingValue }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Audio Assets
  async getAudioAssets(assetType = null, category = null) {
    let query = supabase
      .from('audio_assets_escaperoom_2024')
      .select('*')
      .eq('is_active', true)
    
    if (assetType) {
      query = query.eq('asset_type', assetType)
    }
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async upsertAudioAsset(assetData) {
    const { data, error } = await supabase
      .from('audio_assets_escaperoom_2024')
      .upsert([assetData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteAudioAsset(assetKey) {
    const { data, error } = await supabase
      .from('audio_assets_escaperoom_2024')
      .delete()
      .eq('asset_key', assetKey)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Game Statistics
  async createGameStatistics(teamId, stats) {
    const { data, error } = await supabase
      .from('game_statistics_escaperoom_2024')
      .insert([{ team_id: teamId, ...stats }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getGameStatistics(teamId) {
    const { data, error } = await supabase
      .from('game_statistics_escaperoom_2024')
      .select('*')
      .eq('team_id', teamId)
      .single()
    
    if (error) throw error
    return data
  },

  // Real-time subscriptions
  subscribeToTeamUpdates(callback) {
    return supabase
      .channel('teams_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'teams_escaperoom_2024' }, 
        callback
      )
      .subscribe()
  },

  subscribeToGameSessions(callback) {
    return supabase
      .channel('game_sessions_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'game_sessions_escaperoom_2024' }, 
        callback
      )
      .subscribe()
  }
}

export default supabase