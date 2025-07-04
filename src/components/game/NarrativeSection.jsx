import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiPause, FiImage, FiFileText, FiVideo } = FiIcons;

export default function NarrativeSection({ narrative, stageTitle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Audio implementation would go here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-8 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-serif font-bold text-gold-400">
          {stageTitle}
        </h2>
        <div className="flex items-center gap-3">
          {narrative.audio && (
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
              aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="text-lg" />
              <span className="text-sm">
                {isPlaying ? 'Pause' : 'Play'} Narration
              </span>
            </button>
          )}
          {narrative.video && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
              aria-label={showVideo ? 'Hide video' : 'Show video'}
            >
              <SafeIcon icon={FiVideo} className="text-lg" />
              <span className="text-sm">
                {showVideo ? 'Hide' : 'Show'} Video
              </span>
            </button>
          )}
          {narrative.image && (
            <button
              onClick={() => setShowImage(!showImage)}
              className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors accessibility-focus"
              aria-label={showImage ? 'Hide scene image' : 'Show scene image'}
            >
              <SafeIcon icon={FiImage} className="text-lg" />
              <span className="text-sm">
                {showImage ? 'Hide' : 'Show'} Scene
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Video Player */}
      {showVideo && narrative.video && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <video
            src={narrative.video}
            controls
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          >
            Your browser does not support the video tag.
          </video>
        </motion.div>
      )}

      {/* Scene Image */}
      {showImage && narrative.image && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <img
            src={narrative.image}
            alt={`Scene from ${stageTitle}`}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </motion.div>
      )}

      {/* Narrative Text */}
      <div className="prose prose-lg max-w-none">
        <div className="text-mystery-100 narrative-text leading-relaxed">
          {narrative.text.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Audio Controls */}
      {narrative.audio && (
        <div className="mt-6 p-4 bg-mystery-800 rounded-lg">
          <div className="flex items-center gap-4">
            <SafeIcon icon={FiFileText} className="text-gold-400 text-xl" />
            <div className="flex-1">
              <p className="text-mystery-200 text-sm">
                Audio narration available for this section
              </p>
              <div className="mt-2 h-1 bg-mystery-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 transition-all duration-1000"
                  style={{ width: isPlaying ? '100%' : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility */}
      <div className="screen-reader-only">
        <h3>Stage Narrative</h3>
        <p>{narrative.text}</p>
        {narrative.audio && (
          <p>Audio narration is available for this section.</p>
        )}
        {narrative.video && (
          <p>Video content is available for this section.</p>
        )}
      </div>
    </motion.div>
  );
}