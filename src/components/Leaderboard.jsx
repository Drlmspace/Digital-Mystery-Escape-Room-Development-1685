import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {dbHelpers} from '../lib/supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiTrophy,FiClock,FiUsers,FiTarget,FiHelpCircle,FiHome,FiRefreshCw,FiCalendar,FiFilter,FiAward,FiStar,FiMedal,FiTrash2,FiSettings}=FiIcons;

export default function Leaderboard() {
const navigate=useNavigate();
const [leaderboardData,setLeaderboardData]=useState([]);
const [isLoading,setIsLoading]=useState(true);
const [timeFilter,setTimeFilter]=useState('all'); // all,today,week,month
const [difficultyFilter,setDifficultyFilter]=useState('all');
const [statusFilter,setStatusFilter]=useState('all'); // all,completed,active
const [lastRefresh,setLastRefresh]=useState(new Date());
const [selectedTeams,setSelectedTeams]=useState(new Set());
const [isDeleting,setIsDeleting]=useState(false);
const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);

useEffect(()=> {
loadLeaderboard();
// Auto-refresh every 30 seconds
const interval=setInterval(()=> {
loadLeaderboard();
setLastRefresh(new Date());
},30000);
return ()=> clearInterval(interval);
},[timeFilter,difficultyFilter,statusFilter]);

const loadLeaderboard=async ()=> {
try {
setIsLoading(true);
const data=await dbHelpers.getLeaderboard(timeFilter,difficultyFilter,statusFilter);
setLeaderboardData(data || []);
setSelectedTeams(new Set()); // Clear selection when data refreshes
} catch (error) {
console.error('Failed to load leaderboard:',error);
setLeaderboardData([]);
} finally {
setIsLoading(false);
}
};

const formatTime=(milliseconds)=> {
if (!milliseconds) return '--:--';
const minutes=Math.floor(milliseconds / 60000);
const seconds=Math.floor((milliseconds % 60000) / 1000);
return `${minutes}:${seconds.toString().padStart(2,'0')}`;
};

const formatTimeSeconds=(seconds)=> {
if (!seconds) return '--:--';
const hours=Math.floor(seconds / 3600);
const minutes=Math.floor((seconds % 3600) / 60);
const secs=seconds % 60;
if (hours > 0) {
return `${hours}:${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}
return `${minutes}:${secs.toString().padStart(2,'0')}`;
};

const getPerformanceRating=(team)=> {
const completionRate=(team.stages_completed / 6) * 100;
const timeScore=team.game_state==='completed' ? Math.max(0,100 - (team.total_time_seconds / 3600) * 100) : 0;
const hintPenalty=team.hints_used * 5;
const score=completionRate + timeScore - hintPenalty;

if (score >=180) return {rating: 'Legendary',color: 'text-purple-400',icon: '👑'};
if (score >=150) return {rating: 'Master',color: 'text-gold-400',icon: '🏆'};
if (score >=120) return {rating: 'Expert',color: 'text-blue-400',icon: '⭐'};
if (score >=90) return {rating: 'Skilled',color: 'text-green-400',icon: '🎯'};
if (score >=60) return {rating: 'Good',color: 'text-yellow-400',icon: '👍'};
return {rating: 'Novice',color: 'text-gray-400',icon: '🔰'};
};

const getRankIcon=(position)=> {
if (position===1) return {icon: FiTrophy,color: 'text-gold-400',bg: 'bg-gold-400/20'};
if (position===2) return {icon: FiMedal,color: 'text-gray-300',bg: 'bg-gray-300/20'};
if (position===3) return {icon: FiAward,color: 'text-amber-600',bg: 'bg-amber-600/20'};
return {icon: FiStar,color: 'text-mystery-400',bg: 'bg-mystery-400/20'};
};

const getCompletionBadge=(stagesCompleted)=> {
if (stagesCompleted===6) return {text: 'COMPLETE',color: 'bg-green-600'};
if (stagesCompleted >=4) return {text: 'ADVANCED',color: 'bg-blue-600'};
if (stagesCompleted >=2) return {text: 'PROGRESS',color: 'bg-yellow-600'};
return {text: 'STARTED',color: 'bg-gray-600'};
};

const refreshData=()=> {
loadLeaderboard();
setLastRefresh(new Date());
};

const getFilteredStats=()=> {
if (leaderboardData.length===0) return {total: 0,completed: 0,avgTime: 0,bestTime: 0};

const completed=leaderboardData.filter(team=> team.game_state==='completed');
const avgTime=completed.length > 0 ? completed.reduce((acc,team)=> acc + team.total_time_seconds,0) / completed.length : 0;
const bestTime=completed.length > 0 ? Math.min(...completed.map(team=> team.total_time_seconds)) : 0;

return {
total: leaderboardData.length,
completed: completed.length,
avgTime: avgTime,
bestTime: bestTime
};
};

const handleTeamSelection=(teamId,isSelected)=> {
const newSelection=new Set(selectedTeams);
if (isSelected) {
newSelection.add(teamId);
} else {
newSelection.delete(teamId);
}
setSelectedTeams(newSelection);
};

const handleSelectAll=()=> {
if (selectedTeams.size === leaderboardData.length) {
setSelectedTeams(new Set()); // Deselect all
} else {
setSelectedTeams(new Set(leaderboardData.map(team => team.id))); // Select all
}
};

const handleDeleteSelected=()=> {
if (selectedTeams.size === 0) return;
setShowDeleteConfirm(true);
};

const confirmDelete=async ()=> {
if (selectedTeams.size === 0) return;
setIsDeleting(true);
try {
const teamIds=Array.from(selectedTeams);
if (teamIds.length === 1) {
await dbHelpers.deleteTeam(teamIds[0]);
} else {
await dbHelpers.bulkDeleteTeams(teamIds);
}
await loadLeaderboard(); // Refresh data
setSelectedTeams(new Set()); // Clear selection
setShowDeleteConfirm(false);
} catch (error) {
console.error('Failed to delete teams:',error);
alert('Failed to delete selected teams. Please try again.');
} finally {
setIsDeleting(false);
}
};

const stats=getFilteredStats();

return (
<div className="min-h-screen mystery-gradient">
{/* Header */}
<div className="bg-mystery-900/95 backdrop-blur-sm border-b border-mystery-700">
<div className="max-w-6xl mx-auto px-4 py-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<h1 className="text-2xl font-serif font-bold text-gold-400">
🏆 Leaderboard
</h1>
<div className="text-sm text-mystery-300">
The Vanishing Curator
</div>
</div>
<div className="flex items-center gap-3">
<button
onClick={refreshData}
className="flex items-center gap-2 px-3 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors"
title="Refresh leaderboard"
>
<SafeIcon icon={FiRefreshCw} className="text-lg" />
<span className="text-sm">Last: {lastRefresh.toLocaleTimeString()}</span>
</button>
<button
onClick={()=> navigate('/admin')}
className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors accessibility-focus font-semibold"
>
<SafeIcon icon={FiSettings} className="text-lg" />
Admin
</button>
<button
onClick={()=> navigate('/')}
className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
>
<SafeIcon icon={FiHome} className="text-lg" />
Back to Game
</button>
</div>
</div>
</div>
</div>

<div className="max-w-6xl mx-auto px-4 py-8">
{/* Stats Overview */}
<div className="grid md:grid-cols-4 gap-6 mb-8">
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="glass-effect rounded-2xl p-6"
>
<div className="flex items-center gap-3 mb-2">
<SafeIcon icon={FiUsers} className="text-2xl text-gold-400" />
<h3 className="text-lg font-semibold text-gold-400">Total Teams</h3>
</div>
<div className="text-3xl font-bold text-white">{stats.total}</div>
</motion.div>

<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.1}}
className="glass-effect rounded-2xl p-6"
>
<div className="flex items-center gap-3 mb-2">
<SafeIcon icon={FiTarget} className="text-2xl text-green-400" />
<h3 className="text-lg font-semibold text-gold-400">Completed</h3>
</div>
<div className="text-3xl font-bold text-green-400">{stats.completed}</div>
</motion.div>

<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.2}}
className="glass-effect rounded-2xl p-6"
>
<div className="flex items-center gap-3 mb-2">
<SafeIcon icon={FiClock} className="text-2xl text-blue-400" />
<h3 className="text-lg font-semibold text-gold-400">Best Time</h3>
</div>
<div className="text-3xl font-bold text-blue-400">
{formatTimeSeconds(stats.bestTime)}
</div>
</motion.div>

<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.3}}
className="glass-effect rounded-2xl p-6"
>
<div className="flex items-center gap-3 mb-2">
<SafeIcon icon={FiTrophy} className="text-2xl text-purple-400" />
<h3 className="text-lg font-semibold text-gold-400">Avg Time</h3>
</div>
<div className="text-3xl font-bold text-purple-400">
{formatTimeSeconds(Math.round(stats.avgTime))}
</div>
</motion.div>
</div>

{/* Filters */}
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.4}}
className="glass-effect rounded-2xl p-6 mb-8"
>
<div className="flex items-center gap-3 mb-4">
<SafeIcon icon={FiFilter} className="text-xl text-gold-400" />
<h3 className="text-lg font-semibold text-gold-400">Filters</h3>
</div>
<div className="grid md:grid-cols-3 gap-4">
<div>
<label className="block text-mystery-200 text-sm font-medium mb-2">
Time Period
</label>
<select
value={timeFilter}
onChange={(e)=> setTimeFilter(e.target.value)}
className="w-full px-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
>
<option value="all">All Time</option>
<option value="today">Today</option>
<option value="week">This Week</option>
<option value="month">This Month</option>
</select>
</div>
<div>
<label className="block text-mystery-200 text-sm font-medium mb-2">
Difficulty
</label>
<select
value={difficultyFilter}
onChange={(e)=> setDifficultyFilter(e.target.value)}
className="w-full px-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
>
<option value="all">All Difficulties</option>
<option value="easy">Easy</option>
<option value="medium">Medium</option>
<option value="hard">Hard</option>
</select>
</div>
<div>
<label className="block text-mystery-200 text-sm font-medium mb-2">
Status
</label>
<select
value={statusFilter}
onChange={(e)=> setStatusFilter(e.target.value)}
className="w-full px-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
>
<option value="all">All Teams</option>
<option value="completed">Completed Only</option>
<option value="active">Active Only</option>
</select>
</div>
</div>
</motion.div>

{/* Team Management Controls */}
{leaderboardData.length > 0 && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.5}}
className="glass-effect rounded-2xl p-6 mb-8"
>
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<button
onClick={handleSelectAll}
className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors"
>
{selectedTeams.size === leaderboardData.length ? 'Deselect All' : 'Select All'}
</button>
{selectedTeams.size > 0 && (
<span className="text-mystery-300 text-sm">
{selectedTeams.size} team{selectedTeams.size !== 1 ? 's' : ''} selected
</span>
)}
</div>
{selectedTeams.size > 0 && (
<button
onClick={handleDeleteSelected}
disabled={isDeleting}
className="flex items-center gap-2 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
<SafeIcon icon={FiTrash2} className="text-lg" />
{isDeleting ? 'Deleting...' : `Delete Selected (${selectedTeams.size})`}
</button>
)}
</div>
</motion.div>
)}

{/* Leaderboard */}
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.6}}
className="glass-effect rounded-2xl p-6"
>
<div className="flex items-center gap-3 mb-6">
<SafeIcon icon={FiTrophy} className="text-2xl text-gold-400" />
<h3 className="text-xl font-semibold text-gold-400">Team Rankings</h3>
</div>

{isLoading ? (
<div className="text-center py-12">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
<p className="text-mystery-300">Loading leaderboard...</p>
</div>
) : leaderboardData.length===0 ? (
<div className="text-center py-12">
<SafeIcon icon={FiTrophy} className="text-6xl text-mystery-400 mb-4 mx-auto" />
<p className="text-mystery-300 text-lg">No teams found</p>
<p className="text-mystery-400 text-sm mt-2">Teams will appear here once they start playing</p>
</div>
) : (
<div className="space-y-4">
{leaderboardData.map((team,index)=> {
const rankInfo=getRankIcon(index + 1);
const performance=getPerformanceRating(team);
const completionBadge=getCompletionBadge(team.stages_completed);
const isSelected=selectedTeams.has(team.id);

return (
<motion.div
key={team.id}
initial={{opacity: 0,x: -20}}
animate={{opacity: 1,x: 0}}
transition={{delay: index * 0.1}}
className={`bg-mystery-800 rounded-lg p-6 border-l-4 transition-all duration-200 ${
isSelected 
? 'border-danger-500 bg-danger-900/20' 
: index===0 
? 'border-gold-400' 
: index===1 
? 'border-gray-300' 
: index===2 
? 'border-amber-600' 
: 'border-mystery-600'
}`}
>
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
{/* Selection Checkbox */}
<input
type="checkbox"
checked={isSelected}
onChange={(e)=> handleTeamSelection(team.id,e.target.checked)}
className="w-4 h-4 text-danger-600 bg-mystery-700 border-mystery-600 rounded focus:ring-danger-500 focus:ring-2"
/>

{/* Rank */}
<div className={`flex items-center justify-center w-12 h-12 ${rankInfo.bg} rounded-full`}>
<SafeIcon icon={rankInfo.icon} className={`text-xl ${rankInfo.color}`} />
</div>

{/* Team Info */}
<div>
<div className="flex items-center gap-3 mb-1">
<h4 className="text-xl font-bold text-white">{team.team_name}</h4>
<span className={`px-2 py-1 ${completionBadge.color} text-white rounded-full text-xs font-semibold`}>
{completionBadge.text}
</span>
<span className="text-lg">{performance.icon}</span>
</div>
<div className="flex items-center gap-4 text-sm text-mystery-300">
<span>Players: {team.player_names.join(', ')}</span>
<span>•</span>
<span className="capitalize">{team.difficulty}</span>
<span>•</span>
<span>{new Date(team.start_time).toLocaleDateString()}</span>
</div>
</div>
</div>

{/* Stats */}
<div className="text-right">
<div className="grid grid-cols-2 gap-4 mb-2">
<div>
<div className="text-sm text-mystery-400">Stages</div>
<div className="font-semibold text-white">
{team.stages_completed}/6
</div>
</div>
<div>
<div className="text-sm text-mystery-400">Time</div>
<div className="font-semibold text-white">
{formatTimeSeconds(team.total_time_seconds)}
</div>
</div>
<div>
<div className="text-sm text-mystery-400">Hints</div>
<div className="font-semibold text-white">
{team.hints_used}
</div>
</div>
<div>
<div className="text-sm text-mystery-400">Rating</div>
<div className={`font-semibold ${performance.color}`}>
{performance.rating}
</div>
</div>
</div>
{/* Rank Number */}
<div className="text-2xl font-bold text-gold-400">
#{index + 1}
</div>
</div>
</div>

{/* Progress Bar */}
<div className="mt-4">
<div className="flex justify-between text-xs text-mystery-400 mb-1">
<span>Progress</span>
<span>{Math.round((team.stages_completed / 6) * 100)}%</span>
</div>
<div className="w-full bg-mystery-700 rounded-full h-2">
<div
className="bg-gradient-to-r from-gold-500 to-gold-400 h-2 rounded-full transition-all duration-300"
style={{width: `${(team.stages_completed / 6) * 100}%`}}
></div>
</div>
</div>
</motion.div>
);
})}
</div>
)}
</motion.div>

{/* Achievement Legends */}
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.8}}
className="grid md:grid-cols-2 gap-6 mt-8"
>
<div className="glass-effect rounded-2xl p-6">
<h4 className="text-lg font-semibold text-gold-400 mb-4">Performance Ratings</h4>
<div className="space-y-2 text-sm">
<div className="flex items-center gap-3">
<span className="text-purple-400">👑 Legendary</span>
<span className="text-mystery-300">Perfect completion under 45 min, minimal hints</span>
</div>
<div className="flex items-center gap-3">
<span className="text-gold-400">🏆 Master</span>
<span className="text-mystery-300">Excellent completion time and efficiency</span>
</div>
<div className="flex items-center gap-3">
<span className="text-blue-400">⭐ Expert</span>
<span className="text-mystery-300">Good completion with reasonable time</span>
</div>
<div className="flex items-center gap-3">
<span className="text-green-400">🎯 Skilled</span>
<span className="text-mystery-300">Solid performance, most stages completed</span>
</div>
</div>
</div>

<div className="glass-effect rounded-2xl p-6">
<h4 className="text-lg font-semibold text-gold-400 mb-4">Completion Badges</h4>
<div className="space-y-2 text-sm">
<div className="flex items-center gap-3">
<span className="px-2 py-1 bg-green-600 text-white rounded text-xs">COMPLETE</span>
<span className="text-mystery-300">All 6 stages solved</span>
</div>
<div className="flex items-center gap-3">
<span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">ADVANCED</span>
<span className="text-mystery-300">4-5 stages completed</span>
</div>
<div className="flex items-center gap-3">
<span className="px-2 py-1 bg-yellow-600 text-white rounded text-xs">PROGRESS</span>
<span className="text-mystery-300">2-3 stages completed</span>
</div>
<div className="flex items-center gap-3">
<span className="px-2 py-1 bg-gray-600 text-white rounded text-xs">STARTED</span>
<span className="text-mystery-300">Just beginning the journey</span>
</div>
</div>
</div>
</motion.div>
</div>

{/* Delete Confirmation Modal */}
{showDeleteConfirm && (
<motion.div
initial={{opacity: 0}}
animate={{opacity: 1}}
exit={{opacity: 0}}
className="fixed inset-0 bg-mystery-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
>
<motion.div
initial={{scale: 0.9,opacity: 0}}
animate={{scale: 1,opacity: 1}}
exit={{scale: 0.9,opacity: 0}}
className="bg-mystery-800 border border-danger-600 rounded-2xl p-8 max-w-md w-full"
>
<div className="text-center">
<div className="text-5xl mb-4">⚠️</div>
<h3 className="text-xl font-bold text-danger-400 mb-4">
Confirm Deletion
</h3>
<p className="text-mystery-200 mb-6">
Are you sure you want to delete {selectedTeams.size} selected team{selectedTeams.size !== 1 ? 's' : ''}? 
This action cannot be undone and will also delete all related game data.
</p>
<div className="flex gap-3">
<button
onClick={()=> setShowDeleteConfirm(false)}
disabled={isDeleting}
className="flex-1 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors disabled:opacity-50"
>
Cancel
</button>
<button
onClick={confirmDelete}
disabled={isDeleting}
className="flex-1 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors disabled:opacity-50 font-semibold"
>
{isDeleting ? 'Deleting...' : 'Delete'}
</button>
</div>
</div>
</motion.div>
</motion.div>
)}
</div>
);
}