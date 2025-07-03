export const gameData = {
  title: "The Vanishing Curator",
  description: "A 60-minute interactive investigation experience",
  totalStages: 6,
  
  stages: [
    {
      id: 0,
      title: "The Locked Office",
      description: "Dr. Eleanor Blackwood's office holds the first clues",
      narrative: {
        text: `You slowly open the heavy door to Dr. Eleanor Blackwood's office. The room is dim. A tiny desk lamp flickers, casting long shadows across papers, books, and strange museum objects. Something feels... off. It looks like she left in the middle of her work — but never came back.

On the desk is her open journal. The last page reads:
"I don't trust them. The man with the silver pin came again, asking about the Altamira sketches. He knows too much. I'm not safe."

Next to the journal is her tablet. A glowing message appears:
"Unsent draft — 'They're hiding something. If I disappear, the answer is in the drawer under the desk. Use the calendar. Trust no one.'"

You glance at the calendar on the wall. Some dates are circled in red. Others are crossed out.

A small flashing light blinks on her voicemail machine. You press play. Her voice is shaky:
"I think someone broke in last night. If you find this… look at the bookshelf. Left side. The blue book. Inside is—static—don't let the board erase the truth…"

The room holds secrets, and the clues are here — if you can put them together before time runs out.`,
        audio: "/audio/stage1-intro.mp3",
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
              "2024-01-15": { circled: true, event: "Board Meeting" },
              "2024-01-22": { circled: true, event: "Board Meeting" },
              "2024-01-29": { circled: true, event: "Board Meeting" },
              "2024-02-05": { circled: true, event: "Board Meeting" },
              "2024-02-12": { crossed: true, event: "Cancelled" },
              "2024-02-19": { circled: true, event: "Board Meeting" }
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
            spectrogram: "/images/spectrogram.png"
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
            contents: ["USB Drive", "Handwritten note", "Key"]
          }
        }
      ],
      clues: [
        "Meeting with Anonymous Benefactor",
        "Research notes on controversial artwork",
        "Hidden USB drive with encrypted files"
      ],
      timeLimit: 900, // 15 minutes
      musicTrack: "ambient-office"
    },
    {
      id: 1,
      title: "Digital Forensics Lab",
      description: "Investigate the digital evidence",
      narrative: {
        text: `You enter the quiet server room. Everything is buzzing — lights blinking, computers humming. There's a chair knocked over, and someone left their lunch half-eaten. On the desk, a computer screen glows with a strange folder labeled: "Blackwood Inquiry."

Inside the folder are messages between Dr. Blackwood and someone called "Curator X."

Curator X: "Stop asking questions. You've already been flagged. Delete everything and walk away."
Dr. Blackwood: "No. I found forged image files and fake metadata. This goes beyond our museum."

There are photo files with different dates than what's shown in the gallery. Some even come from outside the country. One file shows an IP address from Zurich — why would art from New York be uploaded from Europe?

Next to the keyboard is a sticky note:
"Hidden in plain sight. Play the audio. The real clue isn't what you hear — it's what you see."

You click play on an audio file. It's a soft melody — but strange symbols appear on the screen as the music plays. A spectrogram?

Something's being hidden in the files. Someone has been changing data. But why?`,
        audio: "/audio/stage2-intro.mp3",
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
                  location: "Zurich, Switzerland",
                  camera: "Canon EOS R5",
                  timestamp: "2024-01-10 14:30:00"
                }
              },
              {
                filename: "artwork_002.jpg",
                metadata: {
                  location: "Zurich, Switzerland",
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
              { time: "03:47 AM", ip: "192.168.1.45", action: "File Access", user: "Unknown" },
              { time: "09:15 AM", ip: "192.168.1.23", action: "Login", user: "E.Blackwood" },
              { time: "10:30 AM", ip: "192.168.1.24", action: "Login", user: "Staff" }
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
        text: `You ride the old elevator down, past the main floors, until you reach the basement. The door creaks open. It's cold and quiet. Long rows of filing cabinets stretch into the dark, each labeled in dusty black letters: ARCHIVE.

You find one cabinet with a red sticker: Confidential — Board Access Only.

Inside are files marked "Forgery Watch List" and "Project Etruscan Echo." One folder is filled with angry letters between Dr. Blackwood and museum leaders.

"I won't be silent. The forged sculpture came from inside our board. I have proof, and it's in the ancient ledger."

A fragile scroll falls out from the folder. It's written in three languages — but something's off. Some words are clearly wrong. Fake.

You also find a printed email:
"Get rid of the old cipher records. If she decodes them, everything falls apart."

On the back of the scroll, someone scribbled:
"The truth is hidden in the code. It's not what it says — it's what it means."

There's a lock on the final drawer. Above it, a riddle scratched into the wood:
"What speaks no words but tells every lie?"

The deeper you dig, the more dangerous the truth becomes…`,
        audio: "/audio/stage3-intro.mp3",
        image: "/images/archives.jpg"
      },
      puzzles: [
        {
          id: "document-matching",
          title: "Historical Document Matching",
          type: "comparison",
          description: "Match the authentic documents with their forgeries",
          question: "Which documents are authentic?",
          solution: "DOCUMENTS A, C, E",
          hints: [
            "Look for anachronisms in the text",
            "Check the paper aging patterns",
            "Compare handwriting styles"
          ],
          data: {
            documents: [
              { id: "A", authentic: true, clues: ["Correct historical references", "Proper aging"] },
              { id: "B", authentic: false, clues: ["Modern ink", "Wrong date format"] },
              { id: "C", authentic: true, clues: ["Period-appropriate language", "Correct seal"] },
              { id: "D", authentic: false, clues: ["Anachronistic terms", "Fresh paper"] },
              { id: "E", authentic: true, clues: ["Proper provenance", "Correct materials"] }
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
            "Use AND, OR, NOT operators",
            "Think about what connects the forgeries",
            "Exclude authentic items from your search"
          ],
          data: {
            database: {
              entries: [
                { title: "Project Etruscan Echo", authentic: false, keywords: ["project", "etruscan", "forgery"] },
                { title: "Authentic Etruscan Vase", authentic: true, keywords: ["etruscan", "authentic", "verified"] }
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
        text: `The control room is dark, lit only by the glow of monitors. Some screens show museum hallways. Others are black with the words: "Footage Missing."

You find a sticky note taped to the monitor:
"Check 4:07 AM — something's off."

You fast-forward the tape. There! A shadowy figure walks with Dr. Blackwood near the east wing. But suddenly, the video cuts out. It skips forward several minutes. Where did they go?

A clipboard on the desk shows the badge log. Someone entered the archives late at night. The name? Dr. Blackwood — but her badge was reported missing the day before.

You spot a wall map with red blinking lights showing where motion detectors picked up movement. The pattern looks strange — like a path that avoids cameras.

And on Camera 6, you catch a blurry person holding something shiny. Maybe a key? A flashlight? Or… a stolen artifact?

Someone is covering their tracks. But if you can follow the movement trail, match the badge logs, and find out who erased the video, you'll be one step closer to the truth.`,
        audio: "/audio/stage4-intro.mp3",
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
              { camera: "Cam1", time: "4:07 AM", event: "Dr. Blackwood enters east wing" },
              { camera: "Cam2", time: "4:15 AM", event: "Footage corrupted" },
              { camera: "Cam3", time: "4:23 AM", event: "Figure exits building" },
              { camera: "Cam4", time: "4:30 AM", event: "Motion detected in parking lot" }
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
              { badge: "M.Sterling", time: "4:10 AM", location: "Archives", status: "Owner not scheduled" },
              { badge: "E.Blackwood", time: "4:07 AM", location: "East Wing", status: "Badge reported missing" }
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
              { sensor: "S1", location: "East Wing", time: "4:07 AM" },
              { sensor: "S2", location: "Corridor A", time: "4:09 AM" },
              { sensor: "S3", location: "Exhibition Hall", time: "4:12 AM" }
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
        text: `The exhibit is almost ready. Golden spotlights shine down on famous artworks. Everything looks perfect — but something feels wrong.

One painting says it's from 1890, but the label looks brand new. The colors are too bright. The signature looks strange.

You hear a click — and behind a statue, you find a tiny audio recorder. Dr. Blackwood's voice plays:
"These aren't real. The real paintings had duller colors and older brushstrokes. Someone replaced them. Look under the paint — the truth is there."

You grab a UV flashlight and shine it across the canvas. Words glow in purple light:
"Sketch replaced. Board involved."

Next to a locked display case is a symbol — one you saw before in the secret archive files. Below it, the word: "Passage."

Is there a hidden door here? Did someone sneak the real artwork out through the exhibit?

Dr. Blackwood found out too much. Now it's your turn to prove she was right — before this fake exhibit opens to the world.`,
        audio: "/audio/stage5-intro.mp3",
        image: "/images/exhibition-hall.jpg"
      },
      puzzles: [
        {
          id: "artwork-authentication",
          title: "Artwork Authentication",
          type: "comparison-analysis",
          description: "Identify the forged artworks",
          question: "Which paintings are forgeries?",
          solution: "PAINTINGS 2, 4, 7",
          hints: [
            "Look for anachronistic elements",
            "Check the paint composition",
            "Compare with known authentic works"
          ],
          data: {
            paintings: [
              { id: 1, authentic: true, clues: ["Correct period pigments", "Proper aging"] },
              { id: 2, authentic: false, clues: ["Modern acrylic paint", "Too vibrant colors"] },
              { id: 3, authentic: true, clues: ["Historical provenance", "Correct technique"] },
              { id: 4, authentic: false, clues: ["Wrong signature style", "Anachronistic elements"] },
              { id: 5, authentic: true, clues: ["Proper documentation", "Period materials"] },
              { id: 6, authentic: true, clues: ["Correct brushwork", "Authentic wear"] },
              { id: 7, authentic: false, clues: ["Modern canvas", "Incorrect frame style"] }
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
              { location: "Painting A", text: "BOARD" },
              { location: "Sculpture B", text: "ORCHESTRATED" },
              { location: "Painting C", text: "FORGERY" },
              { location: "Display D", text: "SCHEME" }
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
            symbols: ["⚡", "🔺", "⭐", "🔷"],
            mapping: { "⚡": 7, "🔺": 8, "⭐": 3, "🔷": 4 }
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
        text: `Following the last clue, you discover a hidden hallway. It leads to a locked door with a symbol you saw in the archive cipher. Behind the door is a vault room — quiet, cold, secret.

Inside, a board covered in photos shows how it all connects: museum leaders, forged artwork, deleted footage, and one name circled in red.

You find Dr. Blackwood's laptop still open. Her final message plays:
"They tried to silence me. But I've left everything. The emails, the scans, even the real travel records from Madrid. Use what I found. Solve the mystery. Finish what I started."

The lights dim. You hear footsteps echo in the hallway. Time is running out.

You must now:
• Put all the clues together
• Name the leader of the forgery ring
• Find the hidden location where Dr. Blackwood is being kept

You've come so far. Now, it's the final moment. Will you expose the truth and save the curator — or let the mystery disappear forever?`,
        audio: "/audio/stage6-intro.mp3",
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
              { type: "Email", connects: ["Marcus Sterling", "Director Hamilton"] },
              { type: "Badge Log", connects: ["Marcus Sterling", "Archives"] },
              { type: "Financial Records", connects: ["Director Hamilton", "Zurich Bank"] },
              { type: "Board Minutes", connects: ["Director Hamilton", "Project Etruscan"] }
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
              { person: "Marcus Sterling", motive: "Blackmail victim" },
              { person: "Director Hamilton", motive: "Financial gain from insurance fraud" },
              { person: "Board Member X", motive: "Reputation protection" }
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
            coordinates: { lat: 40.7128, lng: -74.0060 },
            properties: [
              { name: "Storage Warehouse 7", lat: 40.7128, lng: -74.0060 },
              { name: "Main Museum", lat: 40.7614, lng: -73.9776 }
            ]
          }
        }
      ],
      outcomes: [
        {
          type: "full-success",
          title: "Perfect Resolution",
          description: "You exposed the forgery ring and rescued Dr. Blackwood!",
          requirements: ["All puzzles solved", "Under 50 minutes", "Less than 3 hints used"]
        },
        {
          type: "partial-success",
          title: "Truth Revealed",
          description: "You solved the mystery but couldn't save Dr. Blackwood in time.",
          requirements: ["All puzzles solved", "Over 50 minutes"]
        },
        {
          type: "minimal-success",
          title: "Narrow Escape",
          description: "You escaped with some evidence but the case remains open.",
          requirements: ["Most puzzles solved", "Used maximum hints"]
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