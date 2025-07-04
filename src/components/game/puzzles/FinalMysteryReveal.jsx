import React,{useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {useGame} from '../../../contexts/GameContext';
import SafeIcon from '../../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiCheckCircle,FiTrophy,FiStar,FiArrowRight,FiHome,FiRotateCcw,FiX}=FiIcons;

export default function FinalMysteryReveal({onClose}) {
const navigate=useNavigate();
const {dispatch,teamName,playerNames}=useGame();
const [currentSection,setCurrentSection]=useState(0);

const sections=[
{
title: "Final Mystery Puzzle Solution",
icon: "🔍",
content: `Dr. Eleanor Blackwood uncovered an international forgery ring operating from within the museum. The scandal ran deep — forged artwork swapped with originals, falsified donor documents, digital metadata manipulations, and falsified security records. Board members profited by orchestrating swaps and laundering the forgeries through shadow shell companies.

She followed the trail from artifacts to archives, cross-referenced pigment codes and historical documents, then used surveillance tampering to track the moment her badge was cloned. She marked UV messages on the forgeries and finally, hid a ledger in the vault documenting everything.

The player must use the ledger, the forgeries, the security logs, and the initials marked on the wall to identify the lead conspirator and the network behind the scheme.`
},
{
title: "Official Ending",
icon: "🏆",
content: `Congratulations! You have successfully solved the mystery and rescued Dr. Blackwood!

Through your meticulous investigation, you've exposed Director Hamilton's criminal network and brought justice to the Metropolitan Museum of Digital Arts. The forgery ring has been dismantled, the stolen authentic artworks have been recovered, and Dr. Blackwood is safe.

Your team's detective work has not only solved the mystery but also preserved the integrity of one of the world's most prestigious cultural institutions. The truth has prevailed, and the museum can now rebuild its reputation on a foundation of authenticity and trust.

Well done, investigators. The case is closed.`
}
];

const handleComplete=()=> {
dispatch({type: 'COMPLETE_GAME'});
onClose();
navigate('/game'); // This will show the GameComplete component
};

const nextSection=()=> {
if (currentSection < sections.length - 1) {
setCurrentSection(currentSection + 1);
}
};

const prevSection=()=> {
if (currentSection > 0) {
setCurrentSection(currentSection - 1);
}
};

return (
<motion.div
initial={{opacity: 0}}
animate={{opacity: 1}}
exit={{opacity: 0}}
className="fixed inset-0 bg-mystery-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
>
<motion.div
initial={{scale: 0.9,opacity: 0}}
animate={{scale: 1,opacity: 1}}
exit={{scale: 0.9,opacity: 0}}
className="bg-mystery-800 border-2 border-gold-400 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
>
{/* Header */}
<div className="text-center mb-8">
<motion.div
initial={{scale: 0}}
animate={{scale: 1}}
transition={{delay: 0.3,type: "spring"}}
className="text-8xl mb-4"
>
{sections[currentSection].icon}
</motion.div>
<motion.h2
initial={{opacity: 0,y: -20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.5}}
className="text-3xl font-serif font-bold text-gold-400 mb-2 text-glow"
>
{sections[currentSection].title}
</motion.h2>
{currentSection === 0 && (
<motion.p
initial={{opacity: 0}}
animate={{opacity: 1}}
transition={{delay: 0.7}}
className="text-mystery-200"
>
The complete truth revealed
</motion.p>
)}
{currentSection === 1 && (
<motion.p
initial={{opacity: 0}}
animate={{opacity: 1}}
transition={{delay: 0.7}}
className="text-mystery-200"
>
Team {teamName} - Mission Accomplished
</motion.p>
)}
</div>

{/* Content */}
<AnimatePresence mode="wait">
<motion.div
key={currentSection}
initial={{opacity: 0,x: 50}}
animate={{opacity: 1,x: 0}}
exit={{opacity: 0,x: -50}}
transition={{duration: 0.5}}
className="mb-8"
>
<div className="bg-mystery-700 rounded-xl p-6 border border-gold-400/30">
<div className="prose prose-lg max-w-none text-mystery-100 narrative-text leading-relaxed">
{sections[currentSection].content.split('\n\n').map((paragraph,index)=> (
<motion.p
key={index}
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 0.2 * index}}
className="mb-4"
>
{paragraph}
</motion.p>
))}
</div>
</div>
</motion.div>
</AnimatePresence>

{/* Progress Indicator */}
<div className="flex justify-center mb-6">
<div className="flex gap-2">
{sections.map((_,index)=> (
<div
key={index}
className={`w-3 h-3 rounded-full transition-colors ${
index === currentSection ? 'bg-gold-400' : 'bg-mystery-600'
}`}
/>
))}
</div>
</div>

{/* Navigation */}
<div className="flex justify-between items-center">
{/* Previous Button */}
<button
onClick={prevSection}
disabled={currentSection === 0}
className="flex items-center gap-2 px-4 py-2 bg-mystery-700 text-mystery-200 rounded-lg hover:bg-mystery-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
Previous
</button>

{/* Section Indicator */}
<div className="text-mystery-400 text-sm">
{currentSection + 1} of {sections.length}
</div>

{/* Next/Complete Button */}
{currentSection < sections.length - 1 ? (
<button
onClick={nextSection}
className="flex items-center gap-2 px-6 py-2 gold-gradient text-mystery-900 rounded-lg hover:opacity-90 transition-opacity font-semibold"
>
Next
<SafeIcon icon={FiArrowRight} className="text-lg" />
</button>
) : (
<button
onClick={handleComplete}
className="flex items-center gap-2 px-6 py-2 gold-gradient text-mystery-900 rounded-lg hover:opacity-90 transition-opacity font-semibold"
>
<SafeIcon icon={FiTrophy} className="text-lg" />
Complete Investigation
</button>
)}
</div>

{/* Achievement Badges */}
{currentSection === 1 && (
<motion.div
initial={{opacity: 0,y: 20}}
animate={{opacity: 1,y: 0}}
transition={{delay: 1.0}}
className="mt-8 p-4 bg-gold-500/20 border border-gold-400 rounded-lg"
>
<h4 className="text-lg font-semibold text-gold-400 mb-3 text-center">
🏆 Investigation Complete 🏆
</h4>
<div className="grid md:grid-cols-3 gap-4 text-center">
<div className="flex flex-col items-center">
<SafeIcon icon={FiCheckCircle} className="text-2xl text-green-400 mb-2" />
<span className="text-sm text-mystery-200">Mystery Solved</span>
</div>
<div className="flex flex-col items-center">
<SafeIcon icon={FiStar} className="text-2xl text-gold-400 mb-2" />
<span className="text-sm text-mystery-200">Dr. Blackwood Rescued</span>
</div>
<div className="flex flex-col items-center">
<SafeIcon icon={FiTrophy} className="text-2xl text-purple-400 mb-2" />
<span className="text-sm text-mystery-200">Justice Served</span>
</div>
</div>
</motion.div>
)}

{/* Close Button */}
<button
onClick={onClose}
className="absolute top-4 right-4 p-2 text-mystery-400 hover:text-mystery-200 transition-colors"
aria-label="Close reveal"
>
<SafeIcon icon={FiX} className="text-xl" />
</button>
</motion.div>
</motion.div>
);
}