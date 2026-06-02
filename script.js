const homeScreen = document.getElementById("home");
const scaleSelectionScreen = document.getElementById("scaleSelection");
const playingScreen = document.getElementById("playing");

const homeButton = document.getElementById("home-logo");
const instrumentButtons = document.querySelectorAll('button.instruments');
const scaleButtons = document.querySelectorAll("[data-pattern]");
const startButton = document.getElementById("startButton");
const replayButton = document.getElementById("replayButton");
const backButton = document.getElementById("backButton");

const rootDropdown = document.getElementById("root");
const octaveDropdown = document.getElementById("octave");

const previewCheckbox = document.getElementById("preview");
const metronomeStepper = document.getElementById("metronome");

const scaleNameText = document.getElementById("scaleName");
const selectScaleText = document.getElementById("selectScale");
const currentNote = document.getElementById("note");

let preview = previewCheckbox.checked;
let scalePattern = [];
let root = rootDropdown.value;
let allRungsDiv = document.getElementById("allRungs");
let play = null;
let currentIndex = 0;
let scaleName = "";
let octave = octaveDropdown.value;
let tempo = metronomeStepper.value;
let octavesInstrument = null;
let startingNoteInstrument = null;
let extraNotesInstrument = null;
let naturalNotesCounter = 0;
let noteCounter = 0;
let instrument = null;

function home ()
{
    homeScreen.classList.remove('hidden');
    startButton.classList.add('hidden');
    scaleSelectionScreen.classList.add('hidden');
    playingScreen.classList.add('hidden');
    document.getElementById("controls").style.display = "none";
    allRungsDiv.classList.add('hidden');

    clearInterval(play);
}

function scaleSelection ()
{
    scaleButtons.forEach(enableButton);
    homeScreen.classList.add('hidden');
    startButton.classList.remove('hidden');
    scaleSelectionScreen.classList.remove('hidden');
    playingScreen.classList.add('hidden');
    allRungsDiv.classList.remove('hidden');
    startButton.disabled = true;
    document.getElementById("controls").style.display = "none";
    previewCheckbox.checked = false;
}

function playing ()
{
    scaleSelectionScreen.classList.add('hidden');
    playingScreen.classList.remove('hidden');
    startButton.classList.add('hidden');
    document.getElementById("controls").style.display = "";
    preview = false;
}

home();
startButton.disabled = true;

const scalePatternsMap = new Map();
scalePatternsMap.set("majorIonian", [2, 2, 1, 2, 2, 2, 1]); //major
scalePatternsMap.set("majorLydian", [2, 2, 2, 1, 2, 2, 1]);
scalePatternsMap.set("majorMixolydian", [2, 2, 1, 2, 2, 1, 2]);
scalePatternsMap.set("majorHarmonic", [2, 2, 1, 2, 1, 3, 1]);
scalePatternsMap.set("majorPentatonic", [2, 2, 3, 2, 3]);
scalePatternsMap.set("majorBlues", [2, 1, 1, 3, 2, 3]);
scalePatternsMap.set("minorAeolian", [2, 1, 2, 2, 1, 2, 2]); //minor
scalePatternsMap.set("minorDorian", [2, 1, 2, 2, 2, 1, 2]);
scalePatternsMap.set("minorPhrygian", [1, 2, 2, 2, 1, 2, 2]);
scalePatternsMap.set("minorHarmonic", [2, 1, 2, 2, 1, 3, 1]);
scalePatternsMap.set("minorMelodic", [2, 1, 2, 2, 2, 2, 1]);
scalePatternsMap.set("minorPentatonic", [3, 2, 2, 3, 2]);
scalePatternsMap.set("minorBlues", [3, 2, 1, 1, 3, 2]);
scalePatternsMap.set("minorLocrian", [1, 2, 2, 1, 2, 2, 2]);
scalePatternsMap.set("chromatic", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]); //other

const masterScale = [
    ["C", "C#/D♭", "D", "D#/E♭", "E", "F", "F#/G♭", "G", "G#/A♭", "A", "A#/B♭", "B"], 
    ["C2", "C#2/D♭2", "D2", "D#2/E♭2", "E2", "F2", "F#2/G♭2", "G2", "G#2/A♭2", "A2", "A#2/B♭2", "B2"],
    ["C3", "C#3/D♭3", "D3", "D#3/E♭3", "E3", "F3", "F#3/G♭3", "G3", "G#3/A♭3", "A3", "A#3/B♭3", "B3"],
    ["C4", "C#4/D♭4", "D4", "D#4/E♭4", "E4", "F4", "F#4/G♭4", "G4", "G#4/A♭4", "A4", "A#4/B♭4", "B4"],
    ["C5", "C#5/D♭5", "D5", "D#5/E♭5", "E5", "F5", "F#5/G♭5", "G5", "G#5/A♭5", "A5", "A#5/B♭5", "B5"],
    ["C6", "C#6/D♭6", "D6", "D#6/E♭6", "E6", "F6", "F#6/G♭6", "G6", "G#6/A♭6", "A6", "A#6/B♭6", "B6"]
];

rootDropdown.addEventListener("change", function()
{
    root = rootDropdown.value;
    if (preview && scalePattern.length!=0)
    {
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    playScale(root, scalePattern, octave, preview);
    }
});

octaveDropdown.addEventListener("change", function()
{
    octave = octaveDropdown.value;
    if (preview && scalePattern.length!=0)
    {
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    playScale(root, scalePattern, octave, preview);
    }
});

previewCheckbox.addEventListener("change", function() 
{
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    preview = previewCheckbox.checked;
    if (preview && scalePattern.length!=0)
    {
    playScale(root, scalePattern, octave, preview);
    }
});

homeButton.addEventListener("click", function()
{
    home();
    scalePattern = [];
});

startButton.addEventListener("click", function()
{
    selectScaleText.classList.add('hidden');
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    playing();
    playScale(root, scalePattern, octave, preview);
});

replayButton.addEventListener("click", function()
{
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    playScale(root, scalePattern, octave, preview);
});

backButton.addEventListener("click", function()
{
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    scaleSelection();
    selectScaleText.classList.remove('hidden');
});

metronomeStepper.addEventListener("change", function()
{
    let tempoEntered = metronomeStepper.value;
    if (tempoEntered >= 10 && tempoEntered <= 500)
    {
    tempo = metronomeStepper.value;
    }
    else
    {
    tempo = Math.abs(tempoEntered - 10) < Math.abs(tempoEntered - 500) ? 10 : 500;
    metronomeStepper.value = tempo
    }
});

scaleButtons.forEach(instantiateScaleButtons);
instrumentButtons.forEach(instantiateInstrumentButtons);

function enableButton (button)
{
    button.disabled = false;
}

function instantiateScaleButtons (scaleButton)
{
    scaleButton.addEventListener("click", function()
{
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    startButton.disabled = false;
    selectScaleText.classList.add('hidden');
    scaleButtons.forEach(enableButton);
    scaleButton.disabled = true;
    let scaleNameInitial = scaleButton.getAttribute('data-pattern')
    scalePattern = scalePatternsMap.get(scaleNameInitial);
    scaleName = scaleNameInitial.charAt(0).toUpperCase() + scaleNameInitial.slice(1);
    if (scaleName.includes("Major") || scaleName.includes("Minor"))
    {
    scaleName = scaleName.slice(0, 5) + " " + scaleName.slice(5);
    }
    if (preview)
    {
    playScale(root, scalePattern, octave, preview);
    }
});
}

function instantiateInstrumentButtons (instrumentButton)
{
    instrumentButton.addEventListener("click", function ()
    {
    startingNote = instrumentButton.getAttribute('data-startingNote');
    octavesInstrument = +instrumentButton.getAttribute('data-octaves');
    extraNotesInstrument = +instrumentButton.getAttribute('data-extraNotes');
    instrument = instrumentButton.id;
    octaveDropdown.replaceChildren();
    naturalNotesCounter+=octavesInstrument*7;
    for (let i = 0; i<extraNotesInstrument; i++)
    {
        let row = masterScale.findIndex(row => row.includes(startingNote));
        let col = masterScale[row].indexOf(startingNote);
        if (!masterScale[0][(col+i)%12].includes('♭'))
        {
            naturalNotesCounter++;
        }
    }
    for (let i = 0; i<octavesInstrument-1; i++)
    {
        let octaveChoice = document.createElement('option');
        octaveChoice.textContent = i+1;
        octaveChoice.value = i+1;
        octaveDropdown.append(octaveChoice);
    }
    octave = octaveDropdown.value;
    scaleSelection();
    fillRungs(startingNote, octavesInstrument);
    noteCounter = 0;
});
}

function fillRungs (startingNote, octavesInstrument) { 
    allRungsDiv.replaceChildren();
    let startingNoteIndex = masterScale[0].indexOf(startingNote);
    for (let i = 0; i<octavesInstrument; i++)
    {
        addRung(i, 12, startingNoteIndex);
    }
    if (extraNotesInstrument > 0)
    {
        addRung(octavesInstrument, extraNotesInstrument, startingNoteIndex);
    }
    naturalNotesCounter = 0;
    accidentalNotesCounter = 0;
}

function addRung (i, notes, startingNoteIndex)
{
    for (let j = startingNoteIndex; j<(notes)+startingNoteIndex; j++)
    {
        let newRung = document.createElement('div');
        newRung.classList.add('rung');
        newRung.id = masterScale[i+Math.floor(j/12)][j%12];
        allRungsDiv.append(newRung);
        let shift = (97/naturalNotesCounter)*noteCounter;
        let perNoteShift = (97/naturalNotesCounter);
        newRung.style.width = `${perNoteShift*.9}%`;
        newRung.style.height = `${perNoteShift*3}vw`;
        allRungsDiv.style.height = `${perNoteShift*3}vw`;
        allRungsDiv.style.marginTop = `${perNoteShift*3}vw`;
        allRungsDiv.style.marginBottom = `${perNoteShift*.3}vw`;
        if (newRung.id.includes('♭'))
        {
            newRung.style.bottom = `${perNoteShift*2.45}vw`;
            newRung.style.zIndex = "1";
            newRung.style.boxShadow = "2px 7px 2px black";
            newRung.style.left = `${shift-(.5*perNoteShift) + 1.5}%`;
            newRung.classList.add(instrument + "Accidental");
        }
        else
        {
            newRung.style.left = `${shift + 1.5}%`;
            noteCounter++;
            newRung.classList.add(instrument + "Natural");
        }
    }
}

function playScale (root, scalePattern, octave, preview)
{
    let timeout = (preview) ? 100 : 60000/tempo;
    const scaleAscending = generateScale(root, scalePattern, octave);
    scaleNameText.textContent = "Scale: " + root + " " + scaleName;
    const scaleDescending = scaleAscending.slice(0,-1).toReversed();
    const scale = scaleAscending.concat(scaleDescending);
    currentIndex = 0;
    play = setInterval(function() {interval(scale, preview)}, timeout);
}

function interval (scale, preview)
{
    if (currentIndex == scale.length)
    {
        if (!preview)
        {
        clearInterval(play);
        document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
        }
        return;
    }
    masterScaleIndexer(scale[currentIndex], currentIndex, preview);
    currentIndex++;
}

function masterScaleIndexer (note, i, preview)
{
    currentNote.textContent = "Note: " + note;
    let row = masterScale.findIndex(row => row.includes(note));
    let col = masterScale[row].indexOf(note);
    if (!preview)
    {
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    }
    document.getElementById(masterScale[row][col]).classList.add('selected');
}

function generateScale (root, scalePattern, octave) 
{
    let index = masterScale[0].indexOf(root);
    let scale = []
    let i = 0;
    let j = (document.getElementById(root) == null) ? 1 : 0;
    scale.push(masterScale[j][index]);
    while (octave>0)
    {
        index+=scalePattern[i];
        if (index >= 12)
        {
            index-=12;
            j++;
        }
        scale.push(masterScale[j][index]);
        i++;
        if (i == scalePattern.length)
        {
            i = 0;
            octave--;
        }
    }
    return scale
}