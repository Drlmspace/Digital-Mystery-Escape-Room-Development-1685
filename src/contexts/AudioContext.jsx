import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AudioContext = createContext();

const initialState = {
  currentTrack: null,
  volume: 0.7,
  isPlaying: false,
  isMuted: false,
  musicEnabled: true,
  sfxEnabled: true,
  currentCategory: 'ambient',
  customMusicUrls: {},
  customAudioMessages: {}
};

function audioReducer(state, action) {
  switch (action.type) {
    case 'PLAY_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        currentCategory: action.payload.category,
        isPlaying: true
      };
    case 'PAUSE_AUDIO':
      return {
        ...state,
        isPlaying: false
      };
    case 'RESUME_AUDIO':
      return {
        ...state,
        isPlaying: true
      };
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload
      };
    case 'TOGGLE_MUTE':
      return {
        ...state,
        isMuted: !state.isMuted
      };
    case 'TOGGLE_MUSIC':
      return {
        ...state,
        musicEnabled: !state.musicEnabled
      };
    case 'TOGGLE_SFX':
      return {
        ...state,
        sfxEnabled: !state.sfxEnabled
      };
    case 'SET_CUSTOM_MUSIC_URLS':
      return {
        ...state,
        customMusicUrls: action.payload
      };
    case 'SET_CUSTOM_AUDIO_MESSAGES':
      return {
        ...state,
        customAudioMessages: action.payload
      };
    case 'LOAD_CUSTOM_MUSIC':
      return {
        ...state,
        customMusicUrls: action.payload
      };
    case 'LOAD_CUSTOM_AUDIO_MESSAGES':
      return {
        ...state,
        customAudioMessages: action.payload
      };
    default:
      return state;
  }
}

export function AudioProvider({ children }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);

  // Load custom music URLs and audio messages from localStorage on mount
  useEffect(() => {
    const savedMusicUrls = localStorage.getItem('customMusicUrls');
    const savedAudioMessages = localStorage.getItem('customAudioMessages');
    
    if (savedMusicUrls) {
      try {
        const parsedUrls = JSON.parse(savedMusicUrls);
        dispatch({ type: 'LOAD_CUSTOM_MUSIC', payload: parsedUrls });
      } catch (error) {
        console.error('Failed to load custom music URLs:', error);
      }
    }
    
    if (savedAudioMessages) {
      try {
        const parsedMessages = JSON.parse(savedAudioMessages);
        dispatch({ type: 'LOAD_CUSTOM_AUDIO_MESSAGES', payload: parsedMessages });
      } catch (error) {
        console.error('Failed to load custom audio messages:', error);
      }
    }
  }, []);

  // Default audio tracks configuration
  const defaultAudioTracks = {
    ambient: {
      museum: '/audio/ambient-museum.mp3',
      office: '/audio/ambient-office.mp3',
      archives: '/audio/ambient-archives.mp3'
    },
    tension: {
      investigation: '/audio/tension-investigation.mp3',
      discovery: '/audio/tension-discovery.mp3',
      confrontation: '/audio/tension-confrontation.mp3'
    },
    success: {
      puzzle: '/audio/success-puzzle.mp3',
      stage: '/audio/success-stage.mp3',
      victory: '/audio/success-victory.mp3'
    },
    background: {
      menu: '/audio/background-menu.mp3',
      transition: '/audio/background-transition.mp3'
    },
    sfx: {
      click: '/audio/sfx-click.mp3',
      error: '/audio/sfx-error.mp3',
      hint: '/audio/sfx-hint.mp3',
      notification: '/audio/sfx-notification.mp3'
    }
  };

  // Default audio messages configuration
  const defaultAudioMessages = {
    stage1Intro: '/audio/stage1-intro.mp3',
    stage2Intro: '/audio/stage2-intro.mp3',
    stage3Intro: '/audio/stage3-intro.mp3',
    stage4Intro: '/audio/stage4-intro.mp3',
    stage5Intro: '/audio/stage5-intro.mp3',
    stage6Intro: '/audio/stage6-intro.mp3',
    voiceMessage: '/audio/voice-message.mp3',
    drBlackwoodRecording: '/audio/dr-blackwood-recording.mp3',
    curatorXMessage: '/audio/curator-x-message.mp3',
    finalMessage: '/audio/final-message.mp3',
    hintAudio: '/audio/hint-notification.mp3',
    successSound: '/audio/success-sound.mp3',
    errorSound: '/audio/error-sound.mp3',
    puzzleComplete: '/audio/puzzle-complete.mp3'
  };

  // Merge default tracks with custom URLs
  const audioTracks = {
    ...defaultAudioTracks,
    // Override with custom URLs if available
    ambient: {
      ...defaultAudioTracks.ambient,
      custom: state.customMusicUrls.ambient || null
    },
    tension: {
      ...defaultAudioTracks.tension,
      custom: state.customMusicUrls.tension || null
    },
    success: {
      ...defaultAudioTracks.success,
      custom: state.customMusicUrls.success || null
    },
    background: {
      ...defaultAudioTracks.background,
      custom: state.customMusicUrls.background || null
    }
  };

  // Merge default audio messages with custom URLs
  const audioMessages = {
    ...defaultAudioMessages,
    ...state.customAudioMessages
  };

  const playTrack = (category, trackName) => {
    if (!state.musicEnabled) return;
    
    let track = null;
    
    // Check if custom URL exists for this category
    if (state.customMusicUrls[category]) {
      track = state.customMusicUrls[category];
    } else {
      // Fall back to default tracks
      track = audioTracks[category]?.[trackName];
    }
    
    if (track) {
      dispatch({
        type: 'PLAY_TRACK',
        payload: { track, category }
      });
    }
  };

  const playAudioMessage = (messageKey) => {
    if (!state.musicEnabled) return;
    
    const message = audioMessages[messageKey];
    if (message) {
      dispatch({
        type: 'PLAY_TRACK',
        payload: { track: message, category: 'message' }
      });
    }
  };

  const playSFX = (soundName) => {
    if (!state.sfxEnabled) return;
    
    const sound = audioTracks.sfx[soundName];
    if (sound) {
      // Play sound effect (would integrate with Howler.js or HTML5 Audio)
      console.log(`Playing SFX: ${soundName}`);
    }
  };

  const setCustomMusicUrls = (urls) => {
    dispatch({ type: 'SET_CUSTOM_MUSIC_URLS', payload: urls });
    localStorage.setItem('customMusicUrls', JSON.stringify(urls));
  };

  const setCustomAudioMessages = (messages) => {
    dispatch({ type: 'SET_CUSTOM_AUDIO_MESSAGES', payload: messages });
    localStorage.setItem('customAudioMessages', JSON.stringify(messages));
  };

  const value = {
    ...state,
    dispatch,
    playTrack,
    playAudioMessage,
    playSFX,
    audioTracks,
    audioMessages,
    setCustomMusicUrls,
    setCustomAudioMessages
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}