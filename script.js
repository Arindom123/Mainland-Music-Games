// scale pattern for each scale type
const scalePatternsMap = new Map();
scalePatternsMap.set("majorPattern", [2, 2, 1, 2, 2, 2, 1]);
scalePatternsMap.set("minorNaturalPattern", [2, 1, 2, 2, 1, 2, 2]);
scalePatternsMap.set("minorHarmonicPattern", [2, 1, 2, 2, 1, 3, 1]);
scalePatternsMap.set("minorMelodicPattern", [2, 1, 2, 2, 2, 2, 1]);
scalePatternsMap.set("minorBluesPattern", [3, 2, 1, 1, 3, 2]);
scalePatternsMap.set("minorPentatonicPattern", [3, 2, 2, 3, 2]);
scalePatternsMap.set("chromaticPattern", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

const startButton = document.getElementById("startButton");
let currentScale = [];
let scaleType = "";
const scaleButtons = document.querySelectorAll(".scales button");
scaleButtons.forEach(assignScalePattern);

// --- Logic Functions ---

function minorToMajor(scalePattern) {
    // Clone the array so we don't permanently break the Map data
    let newPattern = [...scalePattern];
    let placeholder = newPattern.shift();
    newPattern.push(placeholder);
    return newPattern;
}

function enableButtons(button) {
    button.disabled = false;
}

function assignScalePattern(scaleButton) {
    scaleButton.addEventListener("click", function () {
        scaleButtons.forEach(enableButtons);
        
        if (scaleButton.classList.contains("scaleType")) {
            minorVariationsDiv.classList.add('hidden');
            minorMajorDiv.classList.add('hidden');
            scaleType = scaleButton.id;
        }
        
        document.getElementById(scaleType).disabled = true;
        scaleButton.disabled = true;
        
        let patternName = scaleButton.getAttribute('data-pattern');
        
        // Handle Pentatonic/Blues variations
        if (scaleType == "scalePentatonic" || scaleType == "scaleBlues") {
            minorMajorDiv.classList.remove('hidden');
            if (patternName == "major" || patternName == "minor") {
                let baseKey = scaleType == "scalePentatonic" ? "minorPentatonicPattern" : "minorBluesPattern";
                let basePattern = scalePatternsMap.get(baseKey);
                
                if (patternName == "major") {
                    generateScale(roots, minorToMajor(basePattern));
                } else {
                    generateScale(roots, basePattern);
                }
            }
        }
        
        if (scaleType == "scaleMinor") {
            minorVariationsDiv.classList.remove('hidden');
        }
        
        // Generate scale for buttons with direct patterns (Major, Chromatic, Minor variations)
        if (patternName != "none" && !scaleButton.classList.contains("minorMajorVariations")) {
            generateScale(roots, scalePatternsMap.get(patternName));
        }
    });
}

// --- UI Elements ---

const homePageDiv = document.querySelector(".homepage");
const freePlayDiv = document.querySelector(".free-play");
const minorMajorDiv = document.querySelector(".minorMajorVariations");
const minorVariationsDiv = document.querySelector(".minorVariations");

freePlayDiv.classList.add('hidden');
const rootsID = document.getElementById("Roots");
let roots = rootsID.value;

const instruments = document.querySelectorAll(".instrument");
instruments.forEach(instrumentButtons);

const homeButton = document.getElementById("home-logo");

// Note Pools
const chromaticScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const chromaticScaleSecondOctave = ["C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2"];

function instrumentButtons(button) {
    button.addEventListener("click", function () {
        freePlayDiv.classList.add('show');
        freePlayDiv.classList.remove('hidden');
        homePageDiv.classList.add('hidden');
        fillRungs();
    });
}

// --- The Core Systems ---

function fillRungs() {
    let boardDiv = document.getElementById('instrument-board');
    boardDiv.innerHTML = ""; 

    for (let i = 0; i < (chromaticScale.length + chromaticScaleSecondOctave.length); i++) {
        const newRung = document.createElement('div');
        
        // Fixed ID mapping for 24 rungs
        if (i > 11) {
            newRung.id = chromaticScaleSecondOctave[i - 12];
        } else {
            newRung.id = chromaticScale[i];
        }

        newRung.classList.add('rung');

        // Original spacing logic
        if (newRung.id.includes('b')) {
            // Find reference (natural note to the left)
            let refId = i > 11 ? chromaticScaleSecondOctave[i - 13] : chromaticScale[i - 1];
            let referenceRung = document.getElementById(refId);
            
            if (referenceRung) {
                const refLeft = referenceRung.offsetLeft;
                const refTop = referenceRung.offsetTop;
                newRung.style.position = 'absolute';
                newRung.style.left = `${refLeft + 30}px`;
                newRung.style.top = `${refTop - 165}px`;
            }
        }
        boardDiv.append(newRung);
    }
}

function generateScale(roots, scalePattern) {
    let currentIndex = chromaticScale.indexOf(roots);
    currentScale = [];
    currentScale.push(chromaticScale[currentIndex]);

    let octaveShift = false;

    // Correct 1-octave generation (exactly 8 notes)
    for (let i = 0; i < scalePattern.length; i++) {
        currentIndex += scalePattern[i];
        
        // If we pass B, everything from here on is the second octave
        if (currentIndex > 11) {
            currentIndex -= 12;
            octaveShift = true; 
        }

        if (octaveShift) {
            currentScale.push(chromaticScaleSecondOctave[currentIndex]);
        } else {
            currentScale.push(chromaticScale[currentIndex]);
        }
    }
}

function playScale() {
    const rungs = document.querySelectorAll('.rung');
    for (let i = 0; i < currentScale.length; i++) {
        setTimeout(() => {
            // Clear previous highlight
            rungs.forEach(rung => rung.classList.remove('selected'));
            // Highlight current note in the scale
            const activeNote = document.getElementById(currentScale[i]);
            if (activeNote) {
                activeNote.classList.add('selected');
            }
        }, i * 750);
    }
}

// --- Global Listeners ---

rootsID.addEventListener("change", function () {
    roots = rootsID.value;
});

homeButton.addEventListener("click", function () {
    freePlayDiv.classList.add('hidden');
    homePageDiv.classList.remove('hidden');
});

startButton.addEventListener("click", function() {
    console.log("Scale to Play:", currentScale);
    
    // Disable the button so the user doesn't click it twice during the delay
    startButton.disabled = true;

    // 2000ms = 2 seconds
    setTimeout(() => {
        playScale();
        
        // Optional: Re-enable the button after the scale finishes 
        // (currentScale.length * 500ms is the total play time)
        setTimeout(() => {
            startButton.disabled = false;
        }, currentScale.length * 500);

    }, 2000); 
});