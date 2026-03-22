async function getMic() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted');
    } catch (err) {
        console.error('Microphone access denied:', err);
    }
}

const recordButton = document.getElementById('Audio-Record');
recordButton.addEventListener('click', getMic);

// --- Instrument Menu Logic ---

function selectInstrument(instrumentName) {
    // 1. Hide the menu and show the instrument screen
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('instrument-screen').classList.remove('hidden');

    // 2. Update the title text
    document.getElementById('instrument-title').textContent = instrumentName;

    // 3. Update the image based on the selection
    const imgElement = document.getElementById('instrument-image');
    
    if (instrumentName === 'Glockenspiel') {
        imgElement.src = 'https://placehold.co/600x400/EEE/31343C?text=Glockenspiel+Image';
    } else if (instrumentName === 'Marimba') {
        imgElement.src = 'https://placehold.co/600x400/EEE/31343C?text=Marimba+Image';
    } else if (instrumentName === 'Xylophone') {
        imgElement.src = 'https://placehold.co/600x400/EEE/31343C?text=Xylophone+Image';
    } else if (instrumentName === 'Vibraphone') {
        imgElement.src = 'https://placehold.co/600x400/EEE/31343C?text=Vibraphone+Image';
    }
}

function showMenu() {
    // Hide the instrument screen and go back to the menu
    document.getElementById('instrument-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
}

// --- Metronome Logic ---

let audioContext;
let metronomeInterval;
let isPlaying = false;

function toggleMetronome() {
    // Initialize audio context on first click (browsers require user interaction first)
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const btn = document.getElementById('metronome-btn');
    
    if (isPlaying) {
        clearInterval(metronomeInterval);
        btn.textContent = 'Start';
        isPlaying = false;
    } else {
        let bpm = parseInt(document.getElementById('tempo-input').value) || 120;
        let intervalMs = 60000 / bpm; // Convert BPM to milliseconds
        
        playClick(); // Play the first click immediately
        metronomeInterval = setInterval(playClick, intervalMs);
        
        btn.textContent = 'Stop';
        isPlaying = true;
    }
}

function updateTempo() {
    // If they change the tempo while it's playing, restart it to apply the new speed
    if (isPlaying) {
        toggleMetronome(); // stop
        toggleMetronome(); // start
    }
}

function playClick() {
    // Generate a quick beep sound using the Web Audio API
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = 80; // Pitch of the metronome click
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 10); // Fade out quickly
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.1);
}

// --- Scale Practice Logic ---

const scaleDatabase = {
    "C Major": ["C", "D", "E", "F", "G", "A", "B", "C"],
    "G Major": ["G", "A", "B", "C", "D", "E", "F#", "G"]
};

let currentScaleNotes = [];
let currentNoteIndex = 0;

function startScale() {
    const scaleName = document.getElementById('scale-select').value;
    const display = document.getElementById('current-note-display');

    if (!scaleName) {
        display.textContent = 'Select a scale to begin!';
        currentScaleNotes = [];
        return;
    }

    // Load the scale notes and reset progress
    currentScaleNotes = scaleDatabase[scaleName];
    currentNoteIndex = 0;
    display.textContent = `Target Note: ${currentScaleNotes[currentNoteIndex]}`;
}

function hitNote(playedNote) {
    // Ignore if no scale is selected or if they already finished
    if (currentScaleNotes.length === 0 || currentNoteIndex >= currentScaleNotes.length) return;

    const expectedNote = currentScaleNotes[currentNoteIndex];
    const display = document.getElementById('current-note-display');

    if (playedNote === expectedNote) {
        // Correct note played! Advance to the next one.
        currentNoteIndex++;
        
        if (currentNoteIndex < currentScaleNotes.length) {
            display.textContent = `Target Note: ${currentScaleNotes[currentNoteIndex]}`;
        } else {
            display.textContent = 'Scale Complete! 🎉';
        }
    } else {
        // Wrong note played
        const originalText = display.textContent;
        display.textContent = 'Oops! Try again.';
        setTimeout(() => {
            // Change it back to the target note after 1 second if it still says Oops
            if (display.textContent === 'Oops! Try again.') {
                display.textContent = originalText;
            }
        }, 1000);
    }
}