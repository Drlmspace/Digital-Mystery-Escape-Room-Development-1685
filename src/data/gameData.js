export const gameData={
title: "The Vanishing Curator",
description: "A 60-minute interactive investigation experience",
totalStages: 6,
stages: [
{
id: 0,
title: "The Locked Office",
description: "Dr. Eleanor Blackwood's office holds the first clues",
narrative: {
text: `A creaking stairwell leads into the depths of the museum—down to the Restricted Archives where only senior curators are permitted. The scent of old wood, ink, and forgotten history fills the air as dim lights flicker overhead, illuminating rows of sealed cases and locked cabinets.

Dr. Blackwood's field journal lies open on a cluttered reading table, documenting her final investigation. Her handwritten notes reveal growing certainty that Etruscan artifacts in the museum's new wing were sophisticated forgeries, part of a conspiracy spanning decades.

"The pigment tests failed. The script is stylized, not authentic. These aren't misidentified—they're manufactured. Someone wants them here for a reason."

Spread across the table are sets of historical documents—some authentic, others clearly forged. Eleanor had been comparing paper aging patterns, analyzing handwriting styles, and searching for anachronisms that would expose the fakes. Her magnifying glass rests over a particular grouping she'd marked with letters A through F.

On her laptop screen, an archive database query interface remains open, showing her attempts to use boolean logic to uncover the forgery network. Multiple search terms are visible: "PROJECT," "ETRUSCAN," "AUTHENTIC," connected with various logical operators as she tried different combinations to expose the pattern.

Nearby, a cracked display case holds an ancient scroll covered in symbols from multiple languages. Eleanor's translation notes are scattered around it, showing her attempts to decode what appears to be a multi-language cipher. Her handwriting reveals she'd identified three different ancient languages used as encryption keys, and was working to extract the first letters from each section.

A final note in her journal reads: "The evidence is overwhelming. The documents reveal which pieces are authentic versus forged. The database search will expose the full network when queried correctly. And the scroll... if I'm right about the cipher, it contains a message about betrayal from within our own ranks. Someone on the board is orchestrating this entire scheme."

Eleanor was close to exposing not just a forgery ring, but the identity of whoever was behind the conspiracy. The evidence she compiled—historical, digital, and linguistic—would prove dangerous to someone. Her voice messages suggest she sensed the danger closing in and prepared this trail for whoever might follow in her footsteps.`,
audio: "/audio/stage1-intro.mp3",
video: "/video/stage1-intro.mp4",
image: "/images/office-scene.jpg"
},
puzzles: [
{
id: "calendar-analysis",
title: "Digital Calendar Analysis",
type: "pattern-recognition",
description: "Analyze the calendar appointments to find the pattern",
question: "What pattern do you see in the circled dates?",
solution: "BOARD MEETINGS",
hints: [
"Look at the days of the week for circled dates",
"Consider what type of meetings happen on these days",
"Think about who Dr. Blackwood suspected"
],
data: {
calendar: {
"2024-01-15": {circled: true,event: "Board Meeting"},
"2024-01-22": {circled: true,event: "Board Meeting"},
"2024-01-29": {circled: true,event: "Board Meeting"},
"2024-02-05": {circled: true,event: "Board Meeting"},
"2024-02-12": {crossed: true,event: "Cancelled"},
"2024-02-19": {circled: true,event: "Board Meeting"}
}
}
},
{
id: "voice-cipher",
title: "Voice Message Cipher",
type: "audio-analysis",
description: "Analyze the voice message for hidden information",
question: "What numbers are hidden in the static?",
solution: "4729",
hints: [
"The static isn't random - it contains a pattern",
"Listen for tonal changes in the static",
"The numbers relate to the desk drawer combination"
],
data: {
audioFile: "/audio/voice-message.mp3",
spectrogram: "/images/spectrogram.png",
stageAudioKey: "stage1Intro" // Links to admin uploaded stage1Intro
}
},
{
id: "hidden-compartment",
title: "Hidden Compartment",
type: "3d-exploration",
description: "Find the hidden compartment in the desk",
question: "What's inside the hidden compartment?",
solution: "USB DRIVE",
hints: [
"Use the numbers from the voice message",
"The drawer has a secret compartment",
"Look for something that can store digital files"
],
data: {
combination: "4729",
contents: ["USB Drive","Handwritten note","Key"]
}
}
],
clues: [
"Meeting with Anonymous Benefactor",
"Research notes on controversial artwork",
"Hidden USB drive with encrypted files"
],
timeLimit: 900,// 15 minutes
musicTrack: "ambient-office"
},
{
id: 1,
title: "Digital Forensics Lab",
description: "Investigate the digital evidence",
narrative: {
text: `Beyond the curator's office,a narrow hallway leads to the museum's internal research wing—a place where only staff venture. The Digital Forensics Lab hums with electronic life,screens casting pale light across walls covered in Dr. Blackwood's investigation.

The room tells the story of obsessive research. Notes and diagrams connect museum acquisitions to shipment records and donor emails with colored string and pushpins,creating a web of suspicious connections. At the center sits a terminal still logged in under her credentials,displaying multiple open windows of evidence.

The first window shows an email thread labeled "Urgent: Collection Verification." The messages discuss suspicious acquisitions,but one sender appears repeatedly as "Curator X" with cryptic responses about "maintaining discretion." The email headers reveal technical details that might identify this mysterious correspondent.

Another screen displays a photo metadata analysis tool. Eleanor had been examining dozens of images from recent acquisitions,and the GPS coordinates embedded in the photos tell a different story than the official documentation. Multiple images show location data that doesn't match the museum's New York address.

A third window reveals network access logs from the museum's server. Eleanor had been tracking unauthorized access attempts,looking for patterns in the timestamps and IP addresses. Most entries show normal business hours,but several anomalous entries stand out—access attempts at highly unusual times.

A folded note beside the keyboard bears her handwriting: "The digital trail runs deeper than I thought. 'Curator X' isn't hiding their identity well enough. The photos lie about their origin,but metadata doesn't. Someone accessed the system when they thought no one would notice—but server logs never sleep."

Eleanor had uncovered a digital conspiracy involving forged documentation,mysterious communications,and unauthorized system access. The evidence she compiled in this room likely sealed her fate. To find where she went next,you'll need to analyze the digital breadcrumbs she left behind—each piece of metadata holding a crucial clue.`,
audio: "/audio/stage2-intro.mp3",
video: "/video/stage2-intro.mp4",
image: "/images/forensics-lab.jpg"
},
puzzles: [
{
id: "email-analysis",
title: "Email Trail Analysis",
type: "text-analysis",
description: "Trace the email communications",
question: "Who is 'Curator X' based on the email headers?",
solution: "MARCUS STERLING",
hints: [
"Check the email metadata",
"Look at the sender's IP address",
"Cross-reference with staff directory"
],
data: {
emails: [
{
from: "curator.x@tempmail.com",
to: "e.blackwood@museum.org",
subject: "Final Warning",
headers: {
"X-Originating-IP": "192.168.1.45",
"X-Real-Name": "M.Sterling"
}
}
]
}
},
{
id: "metadata-analysis",
title: "Photo Metadata Analysis",
type: "data-analysis",
description: "Examine the metadata in the digital photos",
question: "What location appears in multiple photo metadata?",
solution: "ZURICH",
hints: [
"Look at the GPS coordinates in the metadata",
"Check the camera settings for location data",
"Some photos were taken outside the museum"
],
data: {
photos: [
{
filename: "artwork_001.jpg",
metadata: {
location: "Zurich,Switzerland",
camera: "Canon EOS R5",
timestamp: "2024-01-10 14:30:00"
}
},
{
filename: "artwork_002.jpg",
metadata: {
location: "Zurich,Switzerland",
camera: "Canon EOS R5",
timestamp: "2024-01-10 14:45:00"
}
}
]
}
},
{
id: "network-logs",
title: "Network Access Logs",
type: "pattern-matching",
description: "Reconstruct the network access pattern",
question: "What time did the unauthorized access occur?",
solution: "03:47 AM",
hints: [
"Look for access outside normal hours",
"Check for unusual IP addresses",
"Find the timestamp that doesn't match normal patterns"
],
data: {
logs: [
{
time: "03:47 AM",
ip: "192.168.1.45",
action: "File Access",
user: "Unknown"
},
{
time: "09:15 AM",
ip: "192.168.1.23",
action: "Login",
user: "E.Blackwood"
},
{
time: "10:30 AM",
ip: "192.168.1.24",
action: "Login",
user: "Staff"
}
]
}
}
],
clues: [
"Evidence of forgery network",
"International connection to Zurich",
"Marcus Sterling involved"
],
timeLimit: 900,
musicTrack: "tension-investigation"
},
{
id: 2,
title: "The Restricted Archives",
description: "Uncover the historical evidence",
narrative: {
text: `A creaking stairwell leads into the depths of the museum—down to the Restricted Archives where only senior curators are permitted. The scent of old wood, ink, and forgotten history fills the air as dim lights flicker overhead, illuminating rows of sealed cases and locked cabinets.

Dr. Blackwood's field journal lies open on a cluttered reading table, documenting her final investigation. Her handwritten notes reveal growing certainty that Etruscan artifacts in the museum's new wing were sophisticated forgeries, part of a conspiracy spanning decades.

"The pigment tests failed. The script is stylized, not authentic. These aren't misidentified—they're manufactured. Someone wants them here for a reason."

Spread across the table are sets of historical documents—some authentic, others clearly forged. Eleanor had been comparing paper aging patterns, analyzing handwriting styles, and searching for anachronisms that would expose the fakes. Her magnifying glass rests over a particular grouping she'd marked with letters A through F.

On her laptop screen, an archive database query interface remains open, showing her attempts to use boolean logic to uncover the forgery network. Multiple search terms are visible: "PROJECT," "ETRUSCAN," "AUTHENTIC," connected with various logical operators as she tried different combinations to expose the pattern.

Nearby, a cracked display case holds an ancient scroll covered in symbols from multiple languages. Eleanor's translation notes are scattered around it, showing her attempts to decode what appears to be a multi-language cipher. Her handwriting reveals she'd identified three different ancient languages used as encryption keys, and was working to extract the first letters from each section.

A final note in her journal reads: "The evidence is overwhelming. The documents reveal which pieces are authentic versus forged. The database search will expose the full network when queried correctly. And the scroll... if I'm right about the cipher, it contains a message about betrayal from within our own ranks. Someone on the board is orchestrating this entire scheme."

Eleanor was close to exposing not just a forgery ring, but the identity of whoever was behind the conspiracy. The evidence she compiled—historical, digital, and linguistic—would prove dangerous to someone. Her voice messages suggest she sensed the danger closing in and prepared this trail for whoever might follow in her footsteps.`,
audio: "/audio/stage3-intro.mp3",
video: "/video/stage3-intro.mp4",
image: "/images/archives.jpg"
},
puzzles: [
{
id: "document-matching",
title: "Historical Document Matching",
type: "comparison",
description: "Match the authentic documents with their forgeries",
question: "Which documents are authentic?",
solution: "DOCUMENTS A,C,E",
hints: [
"Look for anachronisms in the text",
"Check the paper aging patterns",
"Compare handwriting styles"
],
data: {
documents: [
{
id: "A",
authentic: true,
clues: ["Correct historical references","Proper aging"]
},
{
id: "B",
authentic: false,
clues: ["Modern ink","Wrong date format"]
},
{
id: "C",
authentic: true,
clues: ["Period-appropriate language","Correct seal"]
},
{
id: "D",
authentic: false,
clues: ["Anachronistic terms","Fresh paper"]
},
{
id: "E",
authentic: true,
clues: ["Proper provenance","Correct materials"]
}
]
}
},
{
id: "boolean-logic",
title: "Archive Database Logic",
type: "logic-puzzle",
description: "Use boolean logic to query the archive database",
question: "What search query reveals the forgery network?",
solution: "PROJECT AND ETRUSCAN AND NOT AUTHENTIC",
hints: [
"Use AND,OR,NOT operators",
"Think about what connects the forgeries",
"Exclude authentic items from your search"
],
data: {
database: {
entries: [
{
title: "Project Etruscan Echo",
authentic: false,
keywords: ["project","etruscan","forgery"]
},
{
title: "Authentic Etruscan Vase",
authentic: true,
keywords: ["etruscan","authentic","verified"]
}
]
}
}
},
{
id: "ancient-cipher",
title: "Ancient Multi-language Cipher",
type: "cipher",
description: "Decode the ancient scroll cipher",
question: "What message is hidden in the scroll?",
solution: "BOARD MEMBER BETRAYAL",
hints: [
"The cipher uses three languages as a key",
"Look for the first letter of each language section",
"The message is about internal treachery"
],
data: {
cipher: {
latin: "Betrayal",
greek: "Of",
hebrew: "Authority",
pattern: "first-letter-each-section"
}
}
}
],
clues: [
"Ties to long-term forgery operation",
"Board member involvement confirmed",
"Project Etruscan Echo is the key"
],
timeLimit: 900,
musicTrack: "ambient-archives"
},
{
id: 3,
title: "Security System Investigation",
description: "Analyze the security footage and logs",
narrative: {
text: `The museum's security control room hums with electronic surveillance equipment. Banks of monitors display feeds from dozens of cameras throughout the building, while servers log every badge swipe and motion sensor activation. Dr. Blackwood had gained access to this restricted area in her final investigation—and what she discovered here may have sealed her fate.

Multiple workstations show her analysis in progress. Timeline reconstruction software displays security footage from the night she disappeared, with gaps and anomalies marked for further review. Her notes indicate she was cross-referencing camera angles to establish the exact moment of her last verified sighting.

Another screen shows badge access logs spanning several weeks. Eleanor had been tracking unusual patterns—instances where staff credentials were used during times when those employees should have been off-duty or elsewhere. Red flags mark entries that don't align with official schedules, suggesting someone was using stolen or borrowed access cards.

The third workstation displays a 3D mapping system showing motion sensor activations throughout the museum. Colored trails trace movement patterns through restricted areas, revealing paths that deliberately avoided camera coverage. One route is highlighted in red—a trail that begins in the east wing and leads to areas where the museum's most valuable pieces are housed.

Her final notes are alarming: "The security data tells the real story. Someone used unauthorized access to move through the museum after I left. They knew exactly which routes to take to avoid detection, but motion sensors don't lie. The digital trail leads directly to our most prized collections."

Eleanor had uncovered not just forgeries, but evidence of an insider using the museum's own security systems against it. The surveillance data she compiled would expose exactly who had been exploiting their access and when—if someone could piece together the timeline she'd begun to reconstruct.`,
audio: "/audio/stage4-intro.mp3",
video: "/video/stage4-intro.mp4",
image: "/images/security-room.jpg"
},
puzzles: [
{
id: "camera-timeline",
title: "Security Camera Timeline",
type: "timeline-analysis",
description: "Reconstruct the timeline from security footage",
question: "What time did Dr. Blackwood actually leave the museum?",
solution: "4:23 AM",
hints: [
"Look for gaps in the footage",
"Check multiple camera angles",
"The last clear sighting is the answer"
],
data: {
footage: [
{
camera: "Cam1",
time: "4:07 AM",
event: "Dr. Blackwood enters east wing"
},
{
camera: "Cam2",
time: "4:15 AM",
event: "Footage corrupted"
},
{
camera: "Cam3",
time: "4:23 AM",
event: "Figure exits building"
},
{
camera: "Cam4",
time: "4:30 AM",
event: "Motion detected in parking lot"
}
]
}
},
{
id: "badge-tracking",
title: "Access Badge Analysis",
type: "data-correlation",
description: "Track the badge usage patterns",
question: "Whose badge was used to access the archives?",
solution: "MARCUS STERLING",
hints: [
"Compare badge logs with staff schedules",
"Look for badge usage when the owner was elsewhere",
"Check for duplicate entries"
],
data: {
badgeLog: [
{
badge: "M.Sterling",
time: "4:10 AM",
location: "Archives",
status: "Owner not scheduled"
},
{
badge: "E.Blackwood",
time: "4:07 AM",
location: "East Wing",
status: "Badge reported missing"
}
]
}
},
{
id: "motion-sensor",
title: "3D Motion Sensor Analysis",
type: "spatial-analysis",
description: "Map the movement patterns through the museum",
question: "Where did the intruder go after the east wing?",
solution: "EXHIBITION HALL",
hints: [
"Follow the motion sensor activations",
"Look for a path that avoids cameras",
"The destination is where valuable items are displayed"
],
data: {
motionSensors: [
{
sensor: "S1",
location: "East Wing",
time: "4:07 AM"
},
{
sensor: "S2",
location: "Corridor A",
time: "4:09 AM"
},
{
sensor: "S3",
location: "Exhibition Hall",
time: "4:12 AM"
}
]
}
}
],
clues: [
"Secret meeting with unknown figure",
"Trip to Exhibition Hall confirmed",
"Marcus Sterling's badge used illegally"
],
timeLimit: 900,
musicTrack: "tension-discovery"
},
{
id: 4,
title: "The Exhibition Hall",
description: "Investigate the art authentication",
narrative: {
text: `The museum's security control room hums with electronic surveillance equipment. Banks of monitors display feeds from dozens of cameras throughout the building, while servers log every badge swipe and motion sensor activation. Dr. Blackwood had gained access to this restricted area in her final investigation—and what she discovered here may have sealed her fate.

Multiple workstations show her analysis in progress. Timeline reconstruction software displays security footage from the night she disappeared, with gaps and anomalies marked for further review. Her notes indicate she was cross-referencing camera angles to establish the exact moment of her last verified sighting.

Another screen shows badge access logs spanning several weeks. Eleanor had been tracking unusual patterns—instances where staff credentials were used during times when those employees should have been off-duty or elsewhere. Red flags mark entries that don't align with official schedules, suggesting someone was using stolen or borrowed access cards.

The third workstation displays a 3D mapping system showing motion sensor activations throughout the museum. Colored trails trace movement patterns through restricted areas, revealing paths that deliberately avoided camera coverage. One route is highlighted in red—a trail that begins in the east wing and leads to areas where the museum's most valuable pieces are housed.

Her final notes are alarming: "The security data tells the real story. Someone used unauthorized access to move through the museum after I left. They knew exactly which routes to take to avoid detection, but motion sensors don't lie. The digital trail leads directly to our most prized collections."

Eleanor had uncovered not just forgeries, but evidence of an insider using the museum's own security systems against it. The surveillance data she compiled would expose exactly who had been exploiting their access and when—if someone could piece together the timeline she'd begun to reconstruct.`,
audio: "/audio/stage5-intro.mp3",
video: "/video/stage5-intro.mp4",
image: "/images/exhibition-hall.jpg"
},
puzzles: [
{
id: "artwork-authentication",
title: "Artwork Authentication",
type: "comparison-analysis",
description: "Identify the forged artworks",
question: "Which paintings are forgeries?",
solution: "PAINTINGS 2,4,7",
hints: [
"Look for anachronistic elements",
"Check the paint composition",
"Compare with known authentic works"
],
data: {
paintings: [
{
id: 1,
authentic: true,
clues: ["Correct period pigments","Proper aging"]
},
{
id: 2,
authentic: false,
clues: ["Modern acrylic paint","Too vibrant colors"]
},
{
id: 3,
authentic: true,
clues: ["Historical provenance","Correct technique"]
},
{
id: 4,
authentic: false,
clues: ["Wrong signature style","Anachronistic elements"]
},
{
id: 5,
authentic: true,
clues: ["Proper documentation","Period materials"]
},
{
id: 6,
authentic: true,
clues: ["Correct brushwork","Authentic wear"]
},
{
id: 7,
authentic: false,
clues: ["Modern canvas","Incorrect frame style"]
}
]
}
},
{
id: "uv-messages",
title: "UV Light Secret Messages",
type: "hidden-text",
description: "Reveal the hidden messages under UV light",
question: "What is the complete hidden message?",
solution: "BOARD ORCHESTRATED FORGERY SCHEME",
hints: [
"Shine UV light on different artworks",
"The message is split across multiple pieces",
"Combine the words in the right order"
],
data: {
uvMessages: [
{
location: "Painting A",
text: "BOARD"
},
{
location: "Sculpture B",
text: "ORCHESTRATED"
},
{
location: "Painting C",
text: "FORGERY"
},
{
location: "Display D",
text: "SCHEME"
}
]
}
},
{
id: "security-navigation",
title: "Security System Navigation",
type: "maze-solving",
description: "Navigate through the security system",
question: "What is the code to the hidden passage?",
solution: "7834",
hints: [
"Follow the symbols from the archives",
"The code is hidden in the security panel",
"Look for the Etruscan symbol sequence"
],
data: {
symbols: ["⚡","🔺","⭐","🔷"],
mapping: {
"⚡": 7,
"🔺": 8,
"⭐": 3,
"🔷": 4
}
}
}
],
clues: [
"Board orchestrated the forgery scheme",
"Hidden passage discovered",
"Real artworks were stolen"
],
timeLimit: 900,
musicTrack: "tension-discovery"
},
{
id: 5,
title: "The Final Confrontation",
description: "Solve the mystery and find Dr. Blackwood",
narrative: {
text: `If you've found this recording, then you've made it to the vault. Everything I've discovered is here—the complete truth about what's been happening at our museum.

I've spent weeks following the money, and the trail leads to someone I never suspected. The authorization codes, the insurance adjustments, the private sales—they all required someone with ultimate authority. Someone who could override any security protocol, approve any transaction, silence any investigation.

The person orchestrating this entire operation isn't some low-level curator or security guard. It's someone who had access to everything, who could authorize the changes without question, who wielded enough power to make people look the other way. The evidence points to one person: our own Director Hamilton.

I confronted him three days ago with the authentication reports. He didn't deny it—he couldn't, faced with the overwhelming evidence. Instead, he tried to justify it. He spoke of mounting debts, of a museum budget that couldn't sustain itself, of 'necessary compromises' to keep the institution afloat.

But his real motive became clear when I examined his personal financial records. The man has been drowning in debt—bad investments, gambling losses, a lifestyle far beyond his salary. The forgery scheme wasn't about saving the museum—it was about financial gain, pure and simple. He's been selling our authentic pieces to private collectors and replacing them with sophisticated fakes.

The insurance fraud alone amounts to millions. Every time he reported a piece as 'damaged' or 'stolen,' he collected the insurance money while secretly selling the original. The museum's reputation provided the perfect cover for his crimes.

I should have known something was wrong when he started discouraging my authentication work, when he suggested I focus on other projects. He was protecting his operation, trying to keep me away from the evidence.

But I kept digging, and I found the connection to his off-site operations. The GPS coordinates in the photographs led me to discover his storage facilities—places where he could keep the stolen originals before moving them to buyers. The property records show he's been using Storage Warehouse 7 as his primary holding facility.

That's where I was headed when... when they grabbed me. I managed to hide this recorder before they took me, but I fear they're moving me to the same location. If you're going to find me, that's where you need to look—Storage Warehouse 7. It's registered under one of his shell companies, but the GPS coordinates are 34.0522°N, 118.2437°W.

I've left all the evidence here in the vault. The ledgers, the financial records, the authentication reports—everything you need to expose Hamilton and his network. But please, if you're listening to this, don't waste time. Every hour that passes makes it less likely that...

I have to go. I can hear them coming back. Remember—Storage Warehouse 7. And whatever you do, don't trust anyone at the museum until this is over. Hamilton has allies, people who've been helping him cover this up.

The truth is in your hands now. Use it.`,
audio: "/audio/stage6-intro.mp3",
video: "/video/stage6-intro.mp4",
image: "/images/final-confrontation.jpg"
},
puzzles: [
{
id: "evidence-assembly",
title: "Evidence Assembly",
type: "connection-mapping",
description: "Connect all the evidence pieces",
question: "Who is the mastermind behind the forgery ring?",
solution: "DIRECTOR HAMILTON",
hints: [
"Look at who had access to everything",
"Check who could authorize the changes",
"The person with the most power is often the most dangerous"
],
data: {
evidence: [
{
type: "Email",
connects: ["Marcus Sterling","Director Hamilton"]
},
{
type: "Badge Log",
connects: ["Marcus Sterling","Archives"]
},
{
type: "Financial Records",
connects: ["Director Hamilton","Zurich Bank"]
},
{
type: "Board Minutes",
connects: ["Director Hamilton","Project Etruscan"]
}
]
}
},
{
id: "identity-deduction",
title: "Identity Deduction",
type: "logical-deduction",
description: "Use logical deduction to identify the culprit",
question: "What was Director Hamilton's motive?",
solution: "FINANCIAL GAIN",
hints: [
"Follow the money trail",
"Check the insurance claims",
"Look for personal financial troubles"
],
data: {
motives: [
{
person: "Marcus Sterling",
motive: "Blackmail victim"
},
{
person: "Director Hamilton",
motive: "Financial gain from insurance fraud"
},
{
person: "Board Member X",
motive: "Reputation protection"
}
]
}
},
{
id: "location-discovery",
title: "Find Dr. Blackwood",
type: "coordinate-solving",
description: "Decode the coordinates to find Dr. Blackwood",
question: "Where is Dr. Blackwood being held?",
solution: "STORAGE WAREHOUSE 7",
hints: [
"Use the GPS coordinates from the photos",
"Cross-reference with museum property records",
"Look for off-site storage facilities"
],
data: {
coordinates: {
lat: 40.7128,
lng: -74.0060
},
properties: [
{
name: "Storage Warehouse 7",
lat: 40.7128,
lng: -74.0060
},
{
name: "Main Museum",
lat: 40.7614,
lng: -73.9776
}
]
}
}
],
outcomes: [
{
type: "full-success",
title: "Perfect Resolution",
description: "You exposed the forgery ring and rescued Dr. Blackwood!",
requirements: [
"All puzzles solved",
"Under 50 minutes",
"Less than 3 hints used"
]
},
{
type: "partial-success",
title: "Truth Revealed",
description: "You solved the mystery but couldn't save Dr. Blackwood in time.",
requirements: [
"All puzzles solved",
"Over 50 minutes"
]
},
{
type: "minimal-success",
title: "Narrow Escape",
description: "You escaped with some evidence but the case remains open.",
requirements: [
"Most puzzles solved",
"Used maximum hints"
]
}
],
timeLimit: 900,
musicTrack: "tension-confrontation"
}
],
settings: {
difficulties: {
easy: {
timeMultiplier: 1.5,
hintsAvailable: 5,
showGuidance: true,
allowSkip: true
},
medium: {
timeMultiplier: 1.0,
hintsAvailable: 3,
showGuidance: false,
allowSkip: false
},
hard: {
timeMultiplier: 0.8,
hintsAvailable: 1,
showGuidance: false,
allowSkip: false,
redHerrings: true
}
}
}
};