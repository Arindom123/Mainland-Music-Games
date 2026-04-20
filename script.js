// scale pattern for each scale type
const scalePatternsMap = new Map();
scalePatternsMap.set("majorPattern", [2, 2, 1, 2, 2, 2, 1]);
scalePatternsMap.set("minorNaturalPattern", [2, 1, 2, 2, 1, 2, 2]);
scalePatternsMap.set("minorHarmonicPattern", [2, 1, 2, 2, 1, 3, 1]);
scalePatternsMap.set("minorMelodicPattern", [2, 1, 2, 2, 2, 2, 1]);
scalePatternsMap.set("minorBluesPattern", [3, 2, 1, 1, 3, 2]);
scalePatternsMap.set("minorPentatonicPattern", [3, 2, 2, 3, 2]);
scalePatternsMap.set("chromaticPattern", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
const chromaticScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",];
let newChromaticScale = [...chromaticScale];
const startButton = document.getElementById("startButton");
let currentScale = [];
let scaleType = "";
const scaleButtons = document.querySelectorAll(".scales button");
scaleButtons.forEach(assignScalePattern);

function minorToMajor(scalePattern) {
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
const homePageDiv = document.querySelector(".homepage");
const freePlayDiv = document.querySelector(".free-play");
const minorMajorDiv = document.querySelector(".minorMajorVariations");
const minorVariationsDiv = document.querySelector(".minorVariations");

freePlayDiv.classList.add('hidden');
const rootsID = document.getElementById("Roots");
let roots = rootsID.value;

const instruments = document.querySelectorAll(".instrument");
instruments.forEach(instrumentButtons);

function instrumentButtons(button) {
    button.addEventListener("click", function () {
        freePlayDiv.classList.add('show');
        freePlayDiv.classList.remove('hidden');
        homePageDiv.classList.add('hidden');
        fillRungs(button.getAttribute("data-startingNote"), Number(button.getAttribute(("data-octaves")),
        button.getAttribute("startingOctave")));
    });
}

const homeButton = document.getElementById("home-logo");

function addOctaves(startingNote, numOctaves, startingOctave)
{
    for (let i = 0; i<numOctaves%1; i++)
    {
        newChromaticScale.push(chromaticScale[chromaticScale.indexOf(startingNote)]+startingOctave);
    }
    for (let i = 0; i<numOctaves; i++)
    {
        for (let j = 0; j<chromaticScale.length; j++)
        {
            newChromaticScale.push(chromaticScale[j]+(startingOctave + i + 1));
        }
    }
}

function fillRungs(startingNote, numOctaves, startingOctave) {
    let boardDiv = document.getElementById('instrument-board');
    boardDiv.innerHTML = ""; 
    addOctaves(startingNote, numOctaves, startingOctave);
    for (let i = 0; i < (newChromaticScale.length); i++) {
        const newRung = document.createElement('div');
        newRung.id = newChromaticScale[i+startingIndex];
        newRung.classList.add('rung');
        if (newRung.id.includes('b')) {
            let referenceRung = document.getElementById(newChromaticScale[i - 1]);
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

    for (let i = 0; i < scalePattern.length; i++) {
        currentIndex += scalePattern[i];
        if (currentIndex > 11) {
            currentIndex -= 11; 
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

rootsID.addEventListener("change", function () {
    roots = rootsID.value;
});

homeButton.addEventListener("click", function () {
    freePlayDiv.classList.add('hidden');
    homePageDiv.classList.remove('hidden');
});

startButton.addEventListener("click", function() {
    console.log("Scale to Play:", currentScale);
    
    startButton.disabled = true;

    // 2000ms = 2 seconds
    setTimeout(() => {
        playScale();
        setTimeout(() => {
            startButton.disabled = false;
        }, currentScale.length * 500);
    }, 2000); 
});