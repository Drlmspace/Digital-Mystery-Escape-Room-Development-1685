import React,{useState} from 'react';
import {motion} from 'framer-motion';
import {useGame} from '../../../contexts/GameContext';
import PatternRecognitionPuzzle from './PatternRecognitionPuzzle';
import AudioAnalysisPuzzle from './AudioAnalysisPuzzle';
import TextAnalysisPuzzle from './TextAnalysisPuzzle';
import FinalMysteryReveal from './FinalMysteryReveal';
import SafeIcon from '../../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiCheck,FiHelpCircle,FiAlertCircle,FiLock}=FiIcons;

export default function PuzzleCard({puzzle,index,stageIndex}) {
const {dispatch,isPuzzleCompleted,getIncorrectAttempts,getAvailableHints,currentStage}=useGame();
const [showHint,setShowHint]=useState(false);
const [currentHint,setCurrentHint]=useState(0);
const [showAnswer,setShowAnswer]=useState(false);
const [showFinalReveal,setShowFinalReveal]=useState(false);

const isCompleted=isPuzzleCompleted(puzzle.id);
const incorrectAttempts=getIncorrectAttempts(puzzle.id);
const availableHints=getAvailableHints();
const maxAttempts=20;

const handlePuzzleComplete=(solution)=> {
dispatch({type: 'COMPLETE_PUZZLE',payload: {puzzleId: puzzle.id,solution}});

// Show final mystery reveal for the last puzzle in Stage 6
if (currentStage === 5 && puzzle.id === 'evidence-assembly') {
setTimeout(() => {
setShowFinalReveal(true);
}, 1500); // Delay to allow completion animation
}
};

const handleIncorrectAttempt=()=> {
dispatch({type: 'RECORD_INCORRECT_ATTEMPT',payload: {puzzleId: puzzle.id}});
};

const useHint=()=> {
if (availableHints > 0) {
dispatch({type: 'USE_HINT'});
setShowHint(true);
}
};

const nextHint=()=> {
if (currentHint < puzzle.hints.length - 1) {
setCurrentHint(currentHint + 1);
}
};

const renderPuzzleComponent=()=> {
const commonProps={
puzzle,
onComplete: handlePuzzleComplete,
onIncorrectAttempt: handleIncorrectAttempt,
isCompleted,
showAnswer: showAnswer || incorrectAttempts >=maxAttempts
};

switch (puzzle.type) {
case 'pattern-recognition': return <PatternRecognitionPuzzle {...commonProps} />;
case 'audio-analysis': return <AudioAnalysisPuzzle {...commonProps} />;
case 'text-analysis': return <TextAnalysisPuzzle {...commonProps} />;
case 'data-analysis': return <TextAnalysisPuzzle {...commonProps} />;
case 'pattern-matching': return <PatternRecognitionPuzzle {...commonProps} />;
case 'cipher': return <TextAnalysisPuzzle {...commonProps} />;
case 'timeline-analysis': return <TextAnalysisPuzzle {...commonProps} />;
case 'data-correlation': return <TextAnalysisPuzzle {...commonProps} />;
case 'spatial-analysis': return <PatternRecognitionPuzzle {...commonProps} />;
case 'comparison-analysis': return <TextAnalysisPuzzle {...commonProps} />;
case 'hidden-text': return <TextAnalysisPuzzle {...commonProps} />;
case 'maze-solving': return <PatternRecognitionPuzzle {...commonProps} />;
case 'connection-mapping': return <TextAnalysisPuzzle {...commonProps} />;
case 'logical-deduction': return <TextAnalysisPuzzle {...commonProps} />;
case 'coordinate-solving': return <TextAnalysisPuzzle {...commonProps} />;
case '3d-exploration': return <PatternRecognitionPuzzle {...commonProps} />;
case 'comparison': return <TextAnalysisPuzzle {...commonProps} />;
case 'logic-puzzle': return <TextAnalysisPuzzle {...commonProps} />;
default: return <TextAnalysisPuzzle {...commonProps} />;
}
};

return (
<>
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: index * 0.1}}
className={`
glass-effect rounded-2xl p-6 puzzle-hover transition-all duration-300
${isCompleted ? 'border-2 border-gold-400' : ''}
`}
>
{/* Header */}
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-3">
<SafeIcon
icon={isCompleted ? FiCheck : FiLock}
className={`text-2xl ${isCompleted ? 'text-gold-400' : 'text-mystery-400'}`}
/>
<div>
<h3 className="text-lg font-serif font-semibold text-gold-400">
{puzzle.title}
</h3>
<p className="text-sm text-mystery-300">
{puzzle.description}
</p>
</div>
</div>
{isCompleted && (
<div className="px-3 py-1 bg-gold-400 text-mystery-900 rounded-full text-sm font-semibold">
Solved
</div>
)}
</div>

{/* Puzzle Component */}
<div className="puzzle-container mb-4">
{renderPuzzleComponent()}
</div>

{/* Footer */}
<div className="flex items-center justify-between pt-4 border-t border-mystery-700">
<div className="flex items-center gap-4">
{/* Hint Button */}
{!isCompleted && (
<button
onClick={useHint}
disabled={availableHints===0}
className="flex items-center gap-2 px-3 py-1 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed accessibility-focus"
>
<SafeIcon icon={FiHelpCircle} className="text-sm" />
<span className="text-sm">Hint</span>
</button>
)}

{/* Attempts Counter */}
{incorrectAttempts > 0 && (
<div className="flex items-center gap-2 text-sm text-mystery-400">
<SafeIcon icon={FiAlertCircle} className="text-sm" />
<span>{incorrectAttempts}/{maxAttempts} attempts</span>
</div>
)}
</div>

{/* Show Answer Button */}
{incorrectAttempts >=maxAttempts && !isCompleted && (
<button
onClick={()=> setShowAnswer(true)}
className="px-3 py-1 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors text-sm accessibility-focus"
>
Show Answer
</button>
)}
</div>

{/* Hint Modal */}
{showHint && (
<motion.div
initial={{opacity: 0}}
animate={{opacity: 1}}
className="fixed inset-0 bg-mystery-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
onClick={()=> setShowHint(false)}
>
<motion.div
initial={{scale: 0.95}}
animate={{scale: 1}}
className="bg-mystery-800 border border-mystery-600 rounded-2xl p-6 max-w-md w-full"
onClick={(e)=> e.stopPropagation()}
>
<h4 className="text-xl font-serif font-semibold text-gold-400 mb-4">
Hint {currentHint + 1}
</h4>
<p className="text-mystery-200 mb-6">
{puzzle.hints[currentHint]}
</p>
<div className="flex justify-between">
<button
onClick={()=> setShowHint(false)}
className="px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors"
>
Close
</button>
{currentHint < puzzle.hints.length - 1 && (
<button
onClick={nextHint}
className="px-4 py-2 bg-gold-500 text-mystery-900 rounded-lg hover:bg-gold-600 transition-colors"
>
Next Hint
</button>
)}
</div>
</motion.div>
</motion.div>
)}
</motion.div>

{/* Final Mystery Reveal Modal */}
{showFinalReveal && (
<FinalMysteryReveal
onClose={() => setShowFinalReveal(false)}
/>
)}
</>
);
}