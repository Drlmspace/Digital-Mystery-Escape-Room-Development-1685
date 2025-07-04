# The Vanishing Curator - Digital Mystery Escape Room

A comprehensive digital escape room experience built with React and Supabase.

## Database Setup Instructions

### 1. Run the Database Migration

Copy and paste the SQL from `database/migrations/001_create_escape_room_tables.sql` into your Supabase SQL editor and run it. This will create all necessary tables:

- `teams_escaperoom_2024` - Stores team information and game progress
- `game_sessions_escaperoom_2024` - Stores detailed game session data
- `puzzle_attempts_escaperoom_2024` - Tracks all puzzle attempts
- `admin_settings_escaperoom_2024` - Stores admin configuration
- `audio_assets_escaperoom_2024` - Manages audio/video URLs
- `game_statistics_escaperoom_2024` - Stores performance metrics

### 2. Verify Row Level Security

The migration automatically enables RLS and creates policies that allow all operations. For production, you may want to restrict these policies based on your security requirements.

### 3. Test Database Connection

The app includes a health check function that you can use to verify the database connection:

```javascript
import { dbHelpers } from './src/lib/supabase';

// Test the connection
const health = await dbHelpers.healthCheck();
console.log('Database healthy:', health.healthy);
```

## Features Connected to Database

### Team Management
- ✅ Create teams with player information
- ✅ Track game progress and state
- ✅ Real-time team monitoring
- ✅ Bulk team management

### Game Sessions
- ✅ Auto-save game progress every 10 seconds
- ✅ Store puzzle states and attempts
- ✅ Resume games from any point
- ✅ Cross-device synchronization

### Leaderboard
- ✅ Real-time ranking system
- ✅ Performance metrics calculation
- ✅ Filtering by time period, difficulty, status
- ✅ Team deletion and management

### Admin Dashboard
- ✅ Real-time team monitoring
- ✅ Audio asset management
- ✅ Game settings configuration
- ✅ Puzzle answers and hints
- ✅ Export functionality

### Audio Management
- ✅ Upload and manage audio URLs
- ✅ Stage narration support
- ✅ Character voice messages
- ✅ Sound effects library

## Environment Variables

Make sure your Supabase credentials are correctly set in `src/lib/supabase.js`:

```javascript
const SUPABASE_URL = 'your-supabase-url'
const SUPABASE_ANON_KEY = 'your-anon-key'
```

## Real-time Features

The app uses Supabase real-time subscriptions for:
- Live team updates in admin dashboard
- Leaderboard changes
- Game session synchronization

## Performance Optimizations

- Indexed database queries for fast lookups
- Batch operations for bulk updates
- Local storage backup for offline resilience
- Optimistic updates with database sync

## Security Notes

- All tables use Row Level Security (RLS)
- Current policies allow full access (suitable for game environment)
- Consider restricting policies for production use
- Admin authentication uses local storage (consider JWT for production)

## Troubleshooting

### Database Connection Issues
1. Verify Supabase URL and API key
2. Check if tables exist using the SQL editor
3. Run the health check function
4. Ensure RLS policies are correctly configured

### Missing Data
1. Check browser console for errors
2. Verify table schema matches the migration
3. Ensure all required columns exist
4. Check if indexes are created properly

### Performance Issues
1. Monitor Supabase dashboard for slow queries
2. Check if indexes are being used
3. Consider adding more specific indexes for your use case
4. Review RLS policy complexity