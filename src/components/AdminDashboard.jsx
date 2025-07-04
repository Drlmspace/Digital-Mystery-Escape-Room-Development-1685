import React,{useState,useEffect} from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {useAudio} from '../contexts/AudioContext';
import {dbHelpers} from '../lib/supabase';
import {gameData} from '../data/gameData';
import AdminLogin from './AdminLogin';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiSettings,FiUsers,FiClock,FiVolumeX,FiVolume2,FiHome,FiDownload,FiUpload,FiMusic,FiPlay,FiPause,FiTrash2,FiCheck,FiMic,FiHeadphones,FiRefreshCw,FiDatabase,FiHelpCircle,FiKey,FiEye,FiEyeOff,FiSearch,FiFilter,FiTrophy,FiLogOut,FiShield,FiVideo,FiImage,FiSave,FiFileText}=FiIcons;

export default function AdminDashboard() {
const navigate=useNavigate();
const {playTrack,audioTracks}=useAudio();
const [isAuthenticated,setIsAuthenticated]=useState(false);
const [isCheckingAuth,setIsCheckingAuth]=useState(true);
const [activeTab,setActiveTab]=useState('overview');
const [gameSettings,setGameSettings]=useState({
timeLimit: 3600,
hintsEnabled: true,
audioEnabled: true,
difficulty: 'medium'
});

// Real-time data states
const [activeTeams,setActiveTeams]=useState([]);
const [isLoadingTeams,setIsLoadingTeams]=useState(true);
const [lastRefresh,setLastRefresh]=useState(new Date());

// Music upload states
const [musicUrls,setMusicUrls]=useState({
ambient: '',
tension: '',
success: '',
background: ''
});
const [isTestingAudio,setIsTestingAudio]=useState({});
const [audioValidation,setAudioValidation]=useState({});

// Audio messages states
const [audioMessages,setAudioMessages]=useState({
stage1Intro: '',
stage2Intro: '',
stage3Intro: '',
stage4Intro: '',
stage5Intro: '',
stage6Intro: '',
voiceMessage: '',
drBlackwoodRecording: '',
curatorXMessage: '',
finalMessage: '',
hintAudio: '',
successSound: '',
errorSound: '',
puzzleComplete: ''
});
const [isTestingMessage,setIsTestingMessage]=useState({});
const [messageValidation,setMessageValidation]=useState({});
const [isSavingIndividual,setIsSavingIndividual]=useState({});

// Answers section states
const [selectedStage,setSelectedStage]=useState(0);
const [searchTerm,setSearchTerm]=useState('');
const [selectedPuzzleType,setSelectedPuzzleType]=useState('all');
const [showAnswers,setShowAnswers]=useState({});
const [showHints,setShowHints]=useState({});

// Check authentication on mount
useEffect(()=> {
checkAuthentication();
},[]);

const checkAuthentication=()=> {
try {
const authData=localStorage.getItem('adminAuth');
if (authData) {
const parsed=JSON.parse(authData);
const now=Date.now();
// Check if authentication is still valid (24 hours)
if (parsed.authenticated && (now - parsed.timestamp) < parsed.expiresIn) {
setIsAuthenticated(true);
} else {
// Clean up expired authentication
localStorage.removeItem('adminAuth');
setIsAuthenticated(false);
}
} else {
setIsAuthenticated(false);
}
} catch (error) {
console.error('Error checking authentication:',error);
setIsAuthenticated(false);
} finally {
setIsCheckingAuth(false);
}
};

const handleLogin=(success)=> {
setIsAuthenticated(success);
};

const handleLogout=()=> {
localStorage.removeItem('adminAuth');
setIsAuthenticated(false);
navigate('/');
};

// Load real-time data (only if authenticated)
useEffect(()=> {
if (!isAuthenticated) return;

loadActiveTeams();
loadAdminSettings();
loadAudioAssets();

// Set up real-time updates
const subscription=dbHelpers.subscribeToTeamUpdates(()=> {
loadActiveTeams();
});

// Refresh every 30 seconds
const interval=setInterval(()=> {
loadActiveTeams();
setLastRefresh(new Date());
},30000);

return ()=> {
subscription?.unsubscribe();
clearInterval(interval);
};
},[isAuthenticated]);

// Show loading screen while checking authentication
if (isCheckingAuth) {
return (
<div className="min-h-screen mystery-gradient flex items-center justify-center">
<div className="text-center">
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
<p className="text-mystery-200">Checking authentication...</p>
</div>
</div>
);
}

// Show login form if not authenticated
if (!isAuthenticated) {
return <AdminLogin onLogin={handleLogin} />;
}

const loadActiveTeams=async ()=> {
try {
setIsLoadingTeams(true);
const teams=await dbHelpers.getAllActiveTeams();
setActiveTeams(teams || []);
} catch (error) {
console.error('Failed to load active teams:',error);
setActiveTeams([]);
} finally {
setIsLoadingTeams(false);
}
};

const loadAdminSettings=async ()=> {
try {
const settings=await dbHelpers.getAdminSettings('game_settings');
if (settings) {
setGameSettings(settings);
}
} catch (error) {
console.error('Failed to load admin settings:',error);
}
};

const loadAudioAssets=async ()=> {
try {
const assets=await dbHelpers.getAudioAssets();

// Organize assets by type
const musicAssets=assets.filter(asset=> asset.asset_type==='music');
const narrationAssets=assets.filter(asset=> asset.asset_type==='narration');

// Update state with loaded assets
const loadedMusicUrls={};
const loadedAudioMessages={};

musicAssets.forEach(asset=> {
loadedMusicUrls[asset.category]=asset.asset_url;
});

narrationAssets.forEach(asset=> {
loadedAudioMessages[asset.asset_key]=asset.asset_url;
});

setMusicUrls(prev=> ({...prev,...loadedMusicUrls}));
setAudioMessages(prev=> ({...prev,...loadedAudioMessages}));
} catch (error) {
console.error('Failed to load audio assets:',error);
}
};

const saveGameSettings=async ()=> {
try {
await dbHelpers.updateAdminSettings('game_settings',gameSettings);
alert('Game settings saved successfully!');
} catch (error) {
console.error('Failed to save game settings:',error);
alert('Failed to save game settings. Please try again.');
}
};

const supportedFormats=[
'mp3','wav','ogg','aac','m4a','flac','wma','webm','mp4'
];

const musicCategories=[
{
key: 'ambient',
label: 'Ambient Music',
description: 'Background music for exploration and puzzle solving',
icon: '🎵'
},
{
key: 'tension',
label: 'Tension Music',
description: 'Dramatic music for intense moments and discoveries',
icon: '🎭'
},
{
key: 'success',
label: 'Success Music',
description: 'Victory music for puzzle completion and achievements',
icon: '🏆'
},
{
key: 'background',
label: 'Background Music',
description: 'General background music for menu and transitions',
icon: '🎶'
}
];

const audioMessageCategories=[
{
category: 'Stage Narrations',
icon: '📖',
messages: [
{
key: 'stage1Intro',
label: 'Stage 1 - The Locked Office',
description: 'Opening narration for the first stage'
},
{
key: 'stage2Intro',
label: 'Stage 2 - Digital Forensics Lab',
description: 'Introduction to the digital investigation'
},
{
key: 'stage3Intro',
label: 'Stage 3 - The Restricted Archives',
description: 'Narration for the archives exploration'
},
{
key: 'stage4Intro',
label: 'Stage 4 - Security System Investigation',
description: 'Introduction to security footage analysis'
},
{
key: 'stage5Intro',
label: 'Stage 5 - The Exhibition Hall',
description: 'Narration for the art authentication stage'
},
{
key: 'stage6Intro',
label: 'Stage 6 - The Final Confrontation',
description: 'Final stage dramatic introduction'
}
]
},
{
category: 'Character Voice Messages',
icon: '🎭',
messages: [
{
key: 'voiceMessage',
label: 'Dr. Blackwood\'s Voice Message',
description: 'Hidden voice message with cipher clues'
},
{
key: 'drBlackwoodRecording',
label: 'Dr. Blackwood\'s Recording',
description: 'Audio recording found in the archives'
},
{
key: 'curatorXMessage',
label: 'Curator X Message',
description: 'Mysterious message from the anonymous contact'
},
{
key: 'finalMessage',
label: 'Final Message',
description: 'Dr. Blackwood\'s final message to players'
}
]
},
{
category: 'Sound Effects',
icon: '🔊',
messages: [
{
key: 'hintAudio',
label: 'Hint Notification',
description: 'Sound played when a hint is used'
},
{
key: 'successSound',
label: 'Success Sound',
description: 'Sound for puzzle completion'
},
{
key: 'errorSound',
label: 'Error Sound',
description: 'Sound for incorrect attempts'
},
{
key: 'puzzleComplete',
label: 'Puzzle Complete',
description: 'Sound when all puzzles in a stage are solved'
}
]
}
];

const validateAudioUrl=(url)=> {
if (!url) return {valid: false,message: 'URL is required'};

try {
const urlObj=new URL(url);
const pathname=urlObj.pathname.toLowerCase();
const hasValidExtension=supportedFormats.some(format=> 
pathname.endsWith(`.${format}`)
);

if (!hasValidExtension) {
return {
valid: false,
message: `Unsupported format. Supported: ${supportedFormats.join(',')}`
};
}

return {valid: true,message: 'Valid audio URL'};
} catch (error) {
return {valid: false,message: 'Invalid URL format'};
}
};

const handleMusicUrlChange=(category,url)=> {
setMusicUrls(prev=> ({...prev,[category]: url}));

// Validate URL
const validation=validateAudioUrl(url);
setAudioValidation(prev=> ({...prev,[category]: validation}));
};

const handleAudioMessageChange=(messageKey,url)=> {
setAudioMessages(prev=> ({...prev,[messageKey]: url}));

// Validate URL
const validation=validateAudioUrl(url);
setMessageValidation(prev=> ({...prev,[messageKey]: validation}));
};

const testAudioUrl=async (category,url)=> {
if (!url) return;

setIsTestingAudio(prev=> ({...prev,[category]: true}));

try {
const audio=new Audio(url);
audio.volume=0.3;
const playPromise=audio.play();

if (playPromise !==undefined) {
await playPromise;
// Stop after 3 seconds
setTimeout(()=> {
audio.pause();
audio.currentTime=0;
setIsTestingAudio(prev=> ({...prev,[category]: false}));
},3000);
}
} catch (error) {
console.error('Audio test failed:',error);
setAudioValidation(prev=> ({...prev,[category]: {valid: false,message: 'Failed to load audio file'}}));
setIsTestingAudio(prev=> ({...prev,[category]: false}));
}
};

const testAudioMessage=async (messageKey,url)=> {
if (!url) return;

setIsTestingMessage(prev=> ({...prev,[messageKey]: true}));

try {
const audio=new Audio(url);
audio.volume=0.5;
const playPromise=audio.play();

if (playPromise !==undefined) {
await playPromise;
// Stop after 5 seconds for messages (longer than music)
setTimeout(()=> {
audio.pause();
audio.currentTime=0;
setIsTestingMessage(prev=> ({...prev,[messageKey]: false}));
},5000);
}
} catch (error) {
console.error('Audio message test failed:',error);
setMessageValidation(prev=> ({...prev,[messageKey]: {valid: false,message: 'Failed to load audio file'}}));
setIsTestingMessage(prev=> ({...prev,[messageKey]: false}));
}
};

const saveIndividualAudioMessage=async (messageKey)=> {
const url=audioMessages[messageKey];
if (!url) {
alert('Please enter a URL first');
return;
}

const validation=validateAudioUrl(url);
if (!validation.valid) {
alert(`Invalid URL: ${validation.message}`);
return;
}

setIsSavingIndividual(prev=> ({...prev,[messageKey]: true}));

try {
await dbHelpers.upsertAudioAsset({
asset_key: messageKey,
asset_url: url,
asset_type: 'narration',
category: 'message',
is_active: true
});

// Also save to localStorage as backup
const currentMessages=JSON.parse(localStorage.getItem('customAudioMessages') || '{}');
currentMessages[messageKey]=url;
localStorage.setItem('customAudioMessages',JSON.stringify(currentMessages));

alert(`Successfully saved ${messageKey}!`);
} catch (error) {
console.error('Failed to save individual audio message:',error);
alert('Failed to save audio message. Please try again.');
} finally {
setIsSavingIndividual(prev=> ({...prev,[messageKey]: false}));
}
};

const saveIndividualMusicUrl=async (category)=> {
const url=musicUrls[category];
if (!url) {
alert('Please enter a URL first');
return;
}

const validation=validateAudioUrl(url);
if (!validation.valid) {
alert(`Invalid URL: ${validation.message}`);
return;
}

setIsSavingIndividual(prev=> ({...prev,[category]: true}));

try {
await dbHelpers.upsertAudioAsset({
asset_key: category,
asset_url: url,
asset_type: 'music',
category: category,
is_active: true
});

// Also save to localStorage as backup
const currentMusic=JSON.parse(localStorage.getItem('customMusicUrls') || '{}');
currentMusic[category]=url;
localStorage.setItem('customMusicUrls',JSON.stringify(currentMusic));

alert(`Successfully saved ${category} music!`);
} catch (error) {
console.error('Failed to save individual music URL:',error);
alert('Failed to save music URL. Please try again.');
} finally {
setIsSavingIndividual(prev=> ({...prev,[category]: false}));
}
};

const clearMusicUrl=(category)=> {
setMusicUrls(prev=> ({...prev,[category]: ''}));
setAudioValidation(prev=> ({...prev,[category]: null}));
};

const clearAudioMessage=(messageKey)=> {
setAudioMessages(prev=> ({...prev,[messageKey]: ''}));
setMessageValidation(prev=> ({...prev,[messageKey]: null}));
};

const exportConfig=()=> {
const config={
settings: gameSettings,
musicUrls: musicUrls,
audioMessages: audioMessages,
timestamp: new Date().toISOString()
};

const blob=new Blob([JSON.stringify(config,null,2)],{type: 'application/json'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download='escape-room-config.json';
a.click();
URL.revokeObjectURL(url);
};

const exportAnswers=()=> {
const answersData={
gameTitle: gameData.title,
stages: gameData.stages.map(stage=> ({
title: stage.title,
description: stage.description,
puzzles: stage.puzzles.map(puzzle=> ({
title: puzzle.title,
type: puzzle.type,
question: puzzle.question,
solution: puzzle.solution,
hints: puzzle.hints
}))
})),
exportedAt: new Date().toISOString()
};

const blob=new Blob([JSON.stringify(answersData,null,2)],{type: 'application/json'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download='escape-room-answers.json';
a.click();
URL.revokeObjectURL(url);
};

const exportPuzzlesCSV=()=> {
// Create CSV header
const csvHeader='Stage,Puzzle Title,Puzzle Type,Question,Solution,Hint 1,Hint 2,Hint 3,Hint 4,Hint 5\n';

// Create CSV rows
let csvRows='';
gameData.stages.forEach((stage,stageIndex)=> {
stage.puzzles.forEach(puzzle=> {
const row=[
`Stage ${stageIndex + 1}: ${stage.title}`,
puzzle.title,
puzzle.type.replace(/[-_]/g,' ').replace(/\b\w/g,l=> l.toUpperCase()),
`"${puzzle.question}"`,
puzzle.solution,
puzzle.hints[0] ? `"${puzzle.hints[0]}"` : '',
puzzle.hints[1] ? `"${puzzle.hints[1]}"` : '',
puzzle.hints[2] ? `"${puzzle.hints[2]}"` : '',
puzzle.hints[3] ? `"${puzzle.hints[3]}"` : '',
puzzle.hints[4] ? `"${puzzle.hints[4]}"` : ''
].join(',');
csvRows += row + '\n';
});
});

const csvContent=csvHeader + csvRows;
const blob=new Blob([csvContent],{type: 'text/csv;charset=utf-8;'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download='escape-room-puzzles-solutions.csv';
a.click();
URL.revokeObjectURL(url);
};

const importConfig=(event)=> {
const file=event.target.files[0];
if (file) {
const reader=new FileReader();
reader.onload=(e)=> {
try {
const config=JSON.parse(e.target.result);
setGameSettings(config.settings);
if (config.musicUrls) {
setMusicUrls(config.musicUrls);
}
if (config.audioMessages) {
setAudioMessages(config.audioMessages);
}
} catch (error) {
alert('Invalid configuration file');
}
};
reader.readAsText(file);
}
};

const formatTime=(seconds)=> {
const hours=Math.floor(seconds / 3600);
const minutes=Math.floor((seconds % 3600) / 60);
const secs=seconds % 60;
if (hours > 0) {
return `${hours}:${minutes.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}
return `${minutes}:${secs.toString().padStart(2,'0')}`;
};

const refreshData=()=> {
loadActiveTeams();
setLastRefresh(new Date());
};

const toggleAnswerVisibility=(puzzleId)=> {
setShowAnswers(prev=> ({...prev,[puzzleId]: !prev[puzzleId]}));
};

const toggleHintsVisibility=(puzzleId)=> {
setShowHints(prev=> ({...prev,[puzzleId]: !prev[puzzleId]}));
};

const getPuzzleTypeColor=(type)=> {
const colors={
'pattern-recognition': 'bg-blue-600',
'audio-analysis': 'bg-purple-600',
'text-analysis': 'bg-green-600',
'data-analysis': 'bg-orange-600',
'pattern-matching': 'bg-indigo-600',
'cipher': 'bg-red-600',
'timeline-analysis': 'bg-yellow-600',
'data-correlation': 'bg-pink-600',
'spatial-analysis': 'bg-teal-600',
'comparison-analysis': 'bg-cyan-600',
'hidden-text': 'bg-lime-600',
'maze-solving': 'bg-emerald-600',
'connection-mapping': 'bg-violet-600',
'logical-deduction': 'bg-fuchsia-600',
'coordinate-solving': 'bg-rose-600',
'3d-exploration': 'bg-amber-600',
'comparison': 'bg-sky-600',
'logic-puzzle': 'bg-stone-600'
};
return colors[type] || 'bg-gray-600';
};

const getFilteredPuzzles=()=> {
const stage=gameData.stages[selectedStage];
if (!stage) return [];

let puzzles=stage.puzzles;

// Filter by search term
if (searchTerm) {
puzzles=puzzles.filter(puzzle=> 
puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
puzzle.solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
puzzle.type.toLowerCase().includes(searchTerm.toLowerCase())
);
}

// Filter by puzzle type
if (selectedPuzzleType !=='all') {
puzzles=puzzles.filter(puzzle=> puzzle.type===selectedPuzzleType);
}

return puzzles;
};

const getAllPuzzleTypes=()=> {
const types=new Set();
gameData.stages.forEach(stage=> {
stage.puzzles.forEach(puzzle=> {
types.add(puzzle.type);
});
});
return Array.from(types).sort();
};

return (
<div className="min-h-screen mystery-gradient">
{/* Header */}
<div className="bg-mystery-900/95 backdrop-blur-sm border-b border-mystery-700">
<div className="max-w-6xl mx-auto px-4 py-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<h1 className="text-2xl font-serif font-bold text-gold-400">
🎮 Admin Dashboard
</h1>
<SafeIcon icon={FiDatabase} className="text-gold-400 text-xl" />
<div className="flex items-center gap-2 px-3 py-1 bg-green-600/20 border border-green-600 rounded-lg">
<SafeIcon icon={FiShield} className="text-green-400 text-sm" />
<span className="text-green-400 text-sm font-medium">Authenticated</span>
</div>
</div>
<div className="flex items-center gap-3">
<button
onClick={refreshData}
className="flex items-center gap-2 px-3 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors"
title="Refresh data"
>
<SafeIcon icon={FiRefreshCw} className="text-lg" />
<span className="text-sm">Last: {lastRefresh.toLocaleTimeString()}</span>
</button>
<button
onClick={()=> navigate('/leaderboard')}
className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors accessibility-focus font-semibold"
>
<SafeIcon icon={FiTrophy} className="text-lg" />
Leaderboard
</button>
<button
onClick={()=> navigate('/')}
className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
>
<SafeIcon icon={FiHome} className="text-lg" />
Back to Game
</button>
<button
onClick={handleLogout}
className="flex items-center gap-2 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors accessibility-focus"
title="Logout from admin dashboard"
>
<SafeIcon icon={FiLogOut} className="text-lg" />
Logout
</button>
</div>
</div>
</div>
</div>

<div className="max-w-6xl mx-auto px-4 py-8">
{/* Tab Navigation */}
<div className="flex space-x-1 mb-8">
{[
{id: 'overview',label: 'Overview',icon: FiUsers},
{id: 'answers',label: 'Puzzle Answers',icon: FiKey},
{id: 'settings',label: 'Settings',icon: FiSettings},
{id: 'music',label: 'Music',icon: FiMusic},
{id: 'audio',label: 'Audio Messages',icon: FiMic},
{id: 'monitoring',label: 'Monitoring',icon: FiClock}
].map((tab)=> (
<button
key={tab.id}
onClick={()=> setActiveTab(tab.id)}
className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
activeTab===tab.id
? 'bg-gold-500 text-mystery-900'
: 'bg-mystery-700 text-mystery-200 hover:bg-mystery-600'
}`}
>
<SafeIcon icon={tab.icon} className="text-lg" />
{tab.label}
</button>
))}
</div>

{/* Puzzle Answers Tab */}
{activeTab==='answers' && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="space-y-6"
>
<div className="glass-effect rounded-2xl p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-semibold text-gold-400 flex items-center gap-3">
<SafeIcon icon={FiKey} className="text-2xl" />
Puzzle Answers & Solutions
</h3>
<div className="flex items-center gap-3">
<button
onClick={exportPuzzlesCSV}
className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
>
<SafeIcon icon={FiFileText} className="text-lg" />
Export CSV
</button>
<button
onClick={exportAnswers}
className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors font-semibold"
>
<SafeIcon icon={FiDownload} className="text-lg" />
Export JSON
</button>
</div>
</div>

{/* Filters */}
<div className="grid md:grid-cols-3 gap-4 mb-6">
{/* Stage Selection */}
<div>
<label className="block text-mystery-200 text-sm font-medium mb-2">
Select Stage
</label>
<select
value={selectedStage}
onChange={(e)=> setSelectedStage(parseInt(e.target.value))}
className="w-full px-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
>
{gameData.stages.map((stage,index)=> (
<option key={index} value={index}>
Stage {index + 1}: {stage.title}
</option>
))}
</select>
</div>

{/* Search */}
<div>
<label className="block text-mystery-200 text-sm font-medium mb-2">
Search Puzzles
</label>
<div className="relative">
<SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mystery-400" />
<input
type="text"
value={searchTerm}
onChange={(e)=> setSearchTerm(e.target.value)}
placeholder="Search by title, answer, or type..."
className="w-full pl-10 pr-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
/>
</div>
</div>

{/* Puzzle Type Filter */}
<div>
<label className="block text-mystery-200 text-sm font-medium mb-2">
Filter by Type
</label>
<div className="relative">
<SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mystery-400" />
<select
value={selectedPuzzleType}
onChange={(e)=> setSelectedPuzzleType(e.target.value)}
className="w-full pl-10 pr-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
>
<option value="all">All Types</option>
{getAllPuzzleTypes().map(type=> (
<option key={type} value={type}>
{type.replace(/[-_]/g,' ').replace(/\b\w/g,l=> l.toUpperCase())}
</option>
))}
</select>
</div>
</div>
</div>

{/* Stage Info */}
<div className="mb-6 p-4 bg-mystery-800 rounded-lg">
<h4 className="text-lg font-semibold text-gold-400 mb-2">
{gameData.stages[selectedStage]?.title}
</h4>
<p className="text-mystery-300 mb-2">
{gameData.stages[selectedStage]?.description}
</p>
<div className="flex items-center gap-4 text-sm text-mystery-400">
<span>Time Limit: {gameData.stages[selectedStage]?.timeLimit / 60} minutes</span>
<span>Total Puzzles: {gameData.stages[selectedStage]?.puzzles.length}</span>
<span>Filtered Results: {getFilteredPuzzles().length}</span>
</div>
</div>

{/* Puzzles List */}
<div className="space-y-4">
{getFilteredPuzzles().map((puzzle,index)=> (
<div key={puzzle.id} className="bg-mystery-800 rounded-lg p-6">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-3">
<div className={`px-3 py-1 ${getPuzzleTypeColor(puzzle.type)} text-white rounded-full text-xs font-semibold`}>
{puzzle.type.replace(/[-_]/g,' ').replace(/\b\w/g,l=> l.toUpperCase())}
</div>
<h5 className="text-xl font-semibold text-gold-400">{puzzle.title}</h5>
</div>
<div className="flex items-center gap-2">
<button
onClick={()=> toggleHintsVisibility(puzzle.id)}
className="flex items-center gap-2 px-3 py-1 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors"
>
<SafeIcon icon={FiHelpCircle} className="text-sm" />
<span className="text-sm">
{showHints[puzzle.id] ? 'Hide' : 'Show'} Hints
</span>
</button>
<button
onClick={()=> toggleAnswerVisibility(puzzle.id)}
className="flex items-center gap-2 px-3 py-1 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors font-semibold"
>
<SafeIcon icon={showAnswers[puzzle.id] ? FiEyeOff : FiEye} className="text-sm" />
<span className="text-sm">
{showAnswers[puzzle.id] ? 'Hide' : 'Show'} Answer
</span>
</button>
</div>
</div>

<div className="mb-4">
<p className="text-mystery-300">{puzzle.description}</p>
<div className="mt-2 p-3 bg-mystery-700 rounded-lg">
<h6 className="font-semibold text-mystery-200 mb-1">Question:</h6>
<p className="text-mystery-100">{puzzle.question}</p>
</div>
</div>

{/* Answer Section */}
{showAnswers[puzzle.id] && (
<motion.div
initial={{opacity: 0,height: 0}}
animate={{opacity: 1,height: 'auto'}}
exit={{opacity: 0,height: 0}}
className="mb-4 p-4 bg-gold-500/20 border border-gold-400 rounded-lg"
>
<div className="flex items-center gap-2 mb-2">
<SafeIcon icon={FiKey} className="text-gold-400" />
<h6 className="font-semibold text-gold-400">SOLUTION:</h6>
</div>
<div className="text-2xl font-bold text-white bg-mystery-900 p-3 rounded text-center">
{puzzle.solution}
</div>
</motion.div>
)}

{/* Hints Section */}
{showHints[puzzle.id] && (
<motion.div
initial={{opacity: 0,height: 0}}
animate={{opacity: 1,height: 'auto'}}
exit={{opacity: 0,height: 0}}
className="p-4 bg-mystery-700 rounded-lg"
>
<div className="flex items-center gap-2 mb-3">
<SafeIcon icon={FiHelpCircle} className="text-gold-400" />
<h6 className="font-semibold text-gold-400">Available Hints:</h6>
</div>
<div className="space-y-2">
{puzzle.hints.map((hint,hintIndex)=> (
<div key={hintIndex} className="flex items-start gap-3 p-3 bg-mystery-600 rounded">
<span className="flex-shrink-0 w-6 h-6 bg-gold-500 text-mystery-900 rounded-full flex items-center justify-center text-sm font-semibold">
{hintIndex + 1}
</span>
<p className="text-mystery-200">{hint}</p>
</div>
))}
</div>
</motion.div>
)}

{/* Quick Copy Actions */}
<div className="flex items-center gap-2 mt-4 pt-4 border-t border-mystery-600">
<button
onClick={()=> navigator.clipboard.writeText(puzzle.solution)}
className="px-3 py-1 bg-mystery-600 text-mystery-200 rounded text-sm hover:bg-mystery-500 transition-colors"
>
Copy Answer
</button>
<button
onClick={()=> navigator.clipboard.writeText(puzzle.hints.join('\n'))}
className="px-3 py-1 bg-mystery-600 text-mystery-200 rounded text-sm hover:bg-mystery-500 transition-colors"
>
Copy All Hints
</button>
<span className="text-mystery-400 text-sm ml-auto">
Puzzle #{index + 1}
</span>
</div>
</div>
))}

{getFilteredPuzzles().length===0 && (
<div className="text-center py-8">
<SafeIcon icon={FiSearch} className="text-4xl text-mystery-400 mb-4 mx-auto" />
<p className="text-mystery-300">No puzzles found matching your filters</p>
<p className="text-mystery-400 text-sm mt-2">Try adjusting your search or filter criteria</p>
</div>
)}
</div>

{/* Summary Stats */}
<div className="mt-8 grid md:grid-cols-4 gap-4">
<div className="bg-mystery-800 rounded-lg p-4 text-center">
<div className="text-2xl font-bold text-gold-400">
{gameData.stages.reduce((acc,stage)=> acc + stage.puzzles.length,0)}
</div>
<div className="text-mystery-300 text-sm">Total Puzzles</div>
</div>
<div className="bg-mystery-800 rounded-lg p-4 text-center">
<div className="text-2xl font-bold text-gold-400">
{gameData.stages.length}
</div>
<div className="text-mystery-300 text-sm">Total Stages</div>
</div>
<div className="bg-mystery-800 rounded-lg p-4 text-center">
<div className="text-2xl font-bold text-gold-400">
{getAllPuzzleTypes().length}
</div>
<div className="text-mystery-300 text-sm">Puzzle Types</div>
</div>
<div className="bg-mystery-800 rounded-lg p-4 text-center">
<div className="text-2xl font-bold text-gold-400">
{Math.round(gameData.stages.reduce((acc,stage)=> acc + (stage.timeLimit || 900),0) / 60)}
</div>
<div className="text-mystery-300 text-sm">Total Minutes</div>
</div>
</div>
</div>
</motion.div>
)}

{/* Overview Tab */}
{activeTab==='overview' && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="space-y-6"
>
<div className="grid md:grid-cols-4 gap-6">
<div className="glass-effect rounded-2xl p-6">
<h3 className="text-lg font-semibold text-gold-400 mb-2">Active Teams</h3>
<div className="text-3xl font-bold text-white">
{isLoadingTeams ? '...' : activeTeams.length}
</div>
</div>
<div className="glass-effect rounded-2xl p-6">
<h3 className="text-lg font-semibold text-gold-400 mb-2">Average Stage</h3>
<div className="text-3xl font-bold text-white">
{activeTeams.length > 0 
? Math.round(activeTeams.reduce((acc,team)=> acc + team.current_stage,0) / activeTeams.length) 
: 0}
</div>
</div>
<div className="glass-effect rounded-2xl p-6">
<h3 className="text-lg font-semibold text-gold-400 mb-2">Playing Now</h3>
<div className="text-3xl font-bold text-green-400">
{activeTeams.filter(team=> team.game_state==='playing').length}
</div>
</div>
<div className="glass-effect rounded-2xl p-6">
<h3 className="text-lg font-semibold text-gold-400 mb-2">System Status</h3>
<div className="text-3xl font-bold text-green-400">Online</div>
</div>
</div>

<div className="glass-effect rounded-2xl p-6">
<div className="flex items-center justify-between mb-4">
<h3 className="text-xl font-semibold text-gold-400">Active Teams</h3>
<button
onClick={refreshData}
className="flex items-center gap-2 px-3 py-1 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors"
>
<SafeIcon icon={FiRefreshCw} className="text-sm" />
Refresh
</button>
</div>

{isLoadingTeams ? (
<div className="text-center py-8">
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400 mx-auto"></div>
<p className="text-mystery-300 mt-2">Loading teams...</p>
</div>
) : activeTeams.length===0 ? (
<div className="text-center py-8">
<p className="text-mystery-300">No active teams found</p>
<p className="text-mystery-400 text-sm mt-2">Teams will appear here when they start playing</p>
</div>
) : (
<div className="space-y-4">
{activeTeams.map((team)=> (
<div key={team.id} className="bg-mystery-800 rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<h4 className="font-semibold text-white">{team.team_name}</h4>
<p className="text-sm text-mystery-300">
Players: {team.player_names.join(', ')}
</p>
<p className="text-sm text-mystery-400">
Started: {new Date(team.start_time).toLocaleString()}
</p>
</div>
<div className="text-right">
<div className="text-gold-400 font-semibold">
Stage {team.current_stage + 1}/6
</div>
<div className="text-sm text-mystery-300">
{formatTime(team.total_time_seconds)}
</div>
<div className={`text-xs px-2 py-1 rounded-full mt-1 ${
team.game_state==='playing' 
? 'bg-green-600 text-white' 
: team.game_state==='paused' 
? 'bg-yellow-600 text-white' 
: 'bg-mystery-600 text-mystery-200'
}`}>
{team.game_state}
</div>
</div>
</div>
</div>
))}
</div>
)}
</div>
</motion.div>
)}

{/* Settings Tab */}
{activeTab==='settings' && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="space-y-6"
>
<div className="glass-effect rounded-2xl p-6">
<h3 className="text-xl font-semibold text-gold-400 mb-6">Game Settings</h3>
<div className="space-y-6">
<div>
<label className="block text-mystery-200 text-sm font-medium mb-2">
Time Limit (seconds)
</label>
<input
type="number"
value={gameSettings.timeLimit}
onChange={(e)=> setGameSettings({...gameSettings,timeLimit: parseInt(e.target.value)})}
className="w-full px-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
/>
</div>

<div>
<label className="block text-mystery-200 text-sm font-medium mb-2">
Default Difficulty
</label>
<select
value={gameSettings.difficulty}
onChange={(e)=> setGameSettings({...gameSettings,difficulty: e.target.value})}
className="w-full px-4 py-2 bg-mystery-800 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
>
<option value="easy">Easy</option>
<option value="medium">Medium</option>
<option value="hard">Hard</option>
</select>
</div>

<div className="flex items-center justify-between">
<label className="text-mystery-200 font-medium">Enable Hints</label>
<button
onClick={()=> setGameSettings({...gameSettings,hintsEnabled: !gameSettings.hintsEnabled})}
className={`w-12 h-6 rounded-full transition-colors ${
gameSettings.hintsEnabled ? 'bg-gold-500' : 'bg-mystery-600'
}`}
>
<div className={`w-5 h-5 rounded-full bg-white transition-transform ${
gameSettings.hintsEnabled ? 'translate-x-6' : 'translate-x-1'
}`} />
</button>
</div>

<div className="flex items-center justify-between">
<label className="text-mystery-200 font-medium">Enable Audio</label>
<button
onClick={()=> setGameSettings({...gameSettings,audioEnabled: !gameSettings.audioEnabled})}
className={`w-12 h-6 rounded-full transition-colors ${
gameSettings.audioEnabled ? 'bg-gold-500' : 'bg-mystery-600'
}`}
>
<div className={`w-5 h-5 rounded-full bg-white transition-transform ${
gameSettings.audioEnabled ? 'translate-x-6' : 'translate-x-1'
}`} />
</button>
</div>

<div className="pt-4">
<button
onClick={saveGameSettings}
className="px-6 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors font-semibold"
>
Save Settings to Database
</button>
</div>
</div>
</div>

<div className="glass-effect rounded-2xl p-6">
<h3 className="text-xl font-semibold text-gold-400 mb-6">Configuration</h3>
<div className="flex gap-4">
<button
onClick={exportConfig}
className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors font-semibold"
>
<SafeIcon icon={FiDownload} className="text-lg" />
Export Config
</button>
<label className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors font-semibold cursor-pointer">
<SafeIcon icon={FiUpload} className="text-lg" />
Import Config
<input
type="file"
accept=".json"
onChange={importConfig}
className="hidden"
/>
</label>
</div>
</div>
</motion.div>
)}

{/* Music Tab */}
{activeTab==='music' && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="space-y-6"
>
<div className="glass-effect rounded-2xl p-6">
<h3 className="text-xl font-semibold text-gold-400 mb-6 flex items-center gap-3">
<SafeIcon icon={FiMusic} className="text-2xl" />
Music Upload & Configuration
</h3>

<div className="mb-6 p-4 bg-mystery-800 rounded-lg">
<h4 className="font-semibold text-mystery-200 mb-2">Supported Audio Formats</h4>
<div className="flex flex-wrap gap-2">
{supportedFormats.map((format)=> (
<span key={format} className="px-2 py-1 bg-gold-500 text-mystery-900 rounded text-sm font-medium">
.{format}
</span>
))}
</div>
</div>

<div className="space-y-6">
{musicCategories.map((category)=> (
<div key={category.key} className="bg-mystery-800 rounded-lg p-6">
<div className="flex items-center gap-3 mb-4">
<span className="text-2xl">{category.icon}</span>
<div>
<h4 className="font-semibold text-gold-400">{category.label}</h4>
<p className="text-sm text-mystery-300">{category.description}</p>
</div>
</div>

<div className="space-y-3">
<div className="flex gap-2">
<input
type="url"
value={musicUrls[category.key]}
onChange={(e)=> handleMusicUrlChange(category.key,e.target.value)}
placeholder="Enter music URL (e.g., https://example.com/music.mp3)"
className="flex-1 px-4 py-2 bg-mystery-700 text-white rounded-lg border border-mystery-600 focus:border-gold-400 focus:outline-none"
/>
<button
onClick={()=> testAudioUrl(category.key,musicUrls[category.key])}
disabled={!musicUrls[category.key] || isTestingAudio[category.key]}
className="px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
<SafeIcon icon={isTestingAudio[category.key] ? FiPause : FiPlay} className="text-lg" />
</button>
<button
onClick={()=> saveIndividualMusicUrl(category.key)}
disabled={!musicUrls[category.key] || isSavingIndividual[category.key]}
className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
title="Save this music URL"
>
{isSavingIndividual[category.key] ? (
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
) : (
<SafeIcon icon={FiSave} className="text-lg" />
)}
</button>
<button
onClick={()=> clearMusicUrl(category.key)}
className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
>
<SafeIcon icon={FiTrash2} className="text-lg" />
</button>
</div>

{/* Validation Message */}
{audioValidation[category.key] && (
<div className={`flex items-center gap-2 text-sm ${
audioValidation[category.key].valid ? 'text-green-400' : 'text-danger-400'
}`}>
<SafeIcon icon={audioValidation[category.key].valid ? FiCheck : FiVolumeX} className="text-lg" />
{audioValidation[category.key].message}
</div>
)}
</div>
</div>
))}
</div>
</div>
</motion.div>
)}

{/* Audio Messages Tab */}
{activeTab==='audio' && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="space-y-6"
>
<div className="glass-effect rounded-2xl p-6">
<h3 className="text-xl font-semibold text-gold-400 mb-6 flex items-center gap-3">
<SafeIcon icon={FiMic} className="text-2xl" />
Audio Messages & Narration
</h3>

<div className="mb-6 p-4 bg-mystery-800 rounded-lg">
<h4 className="font-semibold text-mystery-200 mb-2">Supported Audio & Video Formats</h4>
<div className="flex flex-wrap gap-2">
{supportedFormats.map((format)=> (
<span key={format} className="px-2 py-1 bg-gold-500 text-mystery-900 rounded text-sm font-medium">
.{format}
</span>
))}
</div>
<p className="text-sm text-mystery-300 mt-2">
Stage narrations support both audio and video files. Use MP4 for video content.
</p>
</div>

<div className="space-y-8">
{audioMessageCategories.map((category)=> (
<div key={category.category} className="bg-mystery-800 rounded-lg p-6">
<div className="flex items-center gap-3 mb-6">
<span className="text-2xl">{category.icon}</span>
<h4 className="text-xl font-semibold text-gold-400">{category.category}</h4>
</div>

<div className="space-y-4">
{category.messages.map((message)=> (
<div key={message.key} className="bg-mystery-700 rounded-lg p-4">
<div className="mb-3">
<h5 className="font-semibold text-mystery-200">{message.label}</h5>
<p className="text-sm text-mystery-400">{message.description}</p>
{category.category==='Stage Narrations' && (
<p className="text-xs text-gold-400 mt-1">
💡 Supports MP4 videos for enhanced stage introductions
</p>
)}
</div>

<div className="space-y-2">
<div className="flex gap-2">
<input
type="url"
value={audioMessages[message.key]}
onChange={(e)=> handleAudioMessageChange(message.key,e.target.value)}
placeholder={category.category==='Stage Narrations' 
? "Enter audio/video URL (e.g., https://example.com/stage1.mp4)"
: "Enter audio message URL (e.g., https://example.com/audio.mp3)"}
className="flex-1 px-3 py-2 bg-mystery-600 text-white rounded-lg border border-mystery-500 focus:border-gold-400 focus:outline-none text-sm"
/>
<button
onClick={()=> testAudioMessage(message.key,audioMessages[message.key])}
disabled={!audioMessages[message.key] || isTestingMessage[message.key]}
className="px-3 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
title="Test audio (5 second preview)"
>
<SafeIcon icon={isTestingMessage[message.key] ? FiPause : FiHeadphones} className="text-lg" />
</button>
<button
onClick={()=> saveIndividualAudioMessage(message.key)}
disabled={!audioMessages[message.key] || isSavingIndividual[message.key]}
className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
title="Save this audio message"
>
{isSavingIndividual[message.key] ? (
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
) : (
<SafeIcon icon={FiSave} className="text-lg" />
)}
</button>
<button
onClick={()=> clearAudioMessage(message.key)}
className="px-3 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
title="Clear URL"
>
<SafeIcon icon={FiTrash2} className="text-lg" />
</button>
</div>

{/* Validation Message */}
{messageValidation[message.key] && (
<div className={`flex items-center gap-2 text-sm ${
messageValidation[message.key].valid ? 'text-green-400' : 'text-danger-400'
}`}>
<SafeIcon icon={messageValidation[message.key].valid ? FiCheck : FiVolumeX} className="text-sm" />
{messageValidation[message.key].message}
</div>
)}

{/* Example URL for Stage 1 */}
{message.key==='stage1Intro' && (
<div className="mt-2 p-2 bg-mystery-600 rounded border border-gold-400/30">
<p className="text-xs text-mystery-300 mb-1">Example MP4 URL:</p>
<code className="text-xs text-gold-400 break-all">
https://app1.sharemyimage.com/2025/07/04/Vanishstage-1.mp4
</code>
</div>
)}
</div>
</div>
))}
</div>
</div>
))}
</div>
</div>
</motion.div>
)}

{/* Monitoring Tab */}
{activeTab==='monitoring' && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
className="space-y-6"
>
<div className="glass-effect rounded-2xl p-6">
<div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-semibold text-gold-400">Real-time Team Monitoring</h3>
<button
onClick={refreshData}
className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors font-semibold"
>
<SafeIcon icon={FiRefreshCw} className="text-lg" />
Refresh Data
</button>
</div>

{isLoadingTeams ? (
<div className="text-center py-8">
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400 mx-auto"></div>
<p className="text-mystery-300 mt-2">Loading real-time data...</p>
</div>
) : activeTeams.length===0 ? (
<div className="text-center py-8">
<p className="text-mystery-300">No teams currently playing</p>
<p className="text-mystery-400 text-sm mt-2">Real-time monitoring will show active teams here</p>
</div>
) : (
<div className="space-y-4">
{activeTeams.map((team)=> (
<div key={team.id} className="bg-mystery-800 rounded-lg p-4">
<div className="flex items-center justify-between mb-3">
<h4 className="font-semibold text-white">{team.team_name}</h4>
<div className="flex gap-2">
<button className="px-3 py-1 bg-gold-500 text-mystery-900 rounded text-sm font-semibold hover:bg-gold-600 transition-colors">
Send Hint
</button>
<button className="px-3 py-1 bg-mystery-600 text-mystery-200 rounded text-sm hover:bg-mystery-500 transition-colors">
Add Time
</button>
</div>
</div>
<div className="grid md:grid-cols-4 gap-4 text-sm">
<div>
<span className="text-mystery-400">Stage:</span>
<span className="text-white ml-2">{team.current_stage + 1}/6</span>
</div>
<div>
<span className="text-mystery-400">Time:</span>
<span className="text-white ml-2">{formatTime(team.total_time_seconds)}</span>
</div>
<div>
<span className="text-mystery-400">Players:</span>
<span className="text-white ml-2">{team.player_names.length}</span>
</div>
<div>
<span className="text-mystery-400">Hints Used:</span>
<span className="text-white ml-2">{team.hints_used}</span>
</div>
</div>
</div>
))}
</div>
)}
</div>

<div className="glass-effect rounded-2xl p-6">
<h3 className="text-xl font-semibold text-gold-400 mb-6">System Controls</h3>
<div className="grid md:grid-cols-2 gap-4">
<button className="flex items-center gap-2 px-4 py-3 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors">
<SafeIcon icon={FiVolumeX} className="text-lg" />
Mute All Audio
</button>
<button className="flex items-center gap-2 px-4 py-3 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors">
<SafeIcon icon={FiVolume2} className="text-lg" />
Unmute All Audio
</button>
<button className="flex items-center gap-2 px-4 py-3 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors">
<SafeIcon icon={FiClock} className="text-lg" />
Pause All Games
</button>
<button className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
<SafeIcon icon={FiClock} className="text-lg" />
Resume All Games
</button>
</div>
</div>
</motion.div>
)}
</div>
</div>
);
}