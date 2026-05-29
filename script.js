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
let accidentalNotesCounter = 0;

function home ()
{
    homeScreen.classList.remove('hidden');
    scaleSelectionScreen.classList.add('hidden');
    playingScreen.classList.add('hidden');
    allRungsDiv.classList.add('hidden');
}

function scaleSelection ()
{
    scaleButtons.forEach(enableButton);
    homeScreen.classList.add('hidden');
    scaleSelectionScreen.classList.remove('hidden');
    playingScreen.classList.add('hidden');
    startButton.textContent = "Play";
    allRungsDiv.classList.remove('hidden');
    startButton.disabled = true;
    previewCheckbox.checked = false;
}

function playing ()
{
    scaleSelectionScreen.classList.add('hidden');
    playingScreen.classList.remove('hidden');
    startButton.classList.remove('hidden');
    startButton.textContent = "Replay";
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
    ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb","B"], 
    ["C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2","B2"],
    ["C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3","B3"],
    ["C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4","B4"],
    ["C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5","B5"],
    ["C6", "Db6", "D6", "Eb6", "E6", "F6", "Gb6", "G6", "Ab6", "A6", "Bb6","B6"]
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
    tempo = Math.abs(tempoEntered - 10) < Math.abs(tempoEntered - 500) ? 1 : 500;
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
    octaveDropdown.replaceChildren();
    for (let i = 0; i<octavesInstrument-1; i++)
    {
        let octaveChoice = document.createElement('option');
        octaveChoice.textContent = i+1;
        octaveChoice.value = i+1;
        octaveDropdown.append(octaveChoice);
    }
    octave = octaveDropdown.value;
    scaleSelection();
    fillRungs(startingNote, octavesInstrument, extraNotesInstrument);
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
        newRung.classList.add('rung')
        newRung.id = masterScale[i+Math.floor(j/12)][j%12];
        allRungsDiv.append(newRung);
        if (newRung.id.includes('b'))
        {
            newRung.style.bottom = "1px";
            newRung.style.zIndex = "1";
            let shift = 76*accidentalNotesCounter + 37;
            newRung.style.left = `${shift}px`;
            accidentalNotesCounter++;
            if (newRung.id.includes('Bb') || newRung.id.includes('Eb'))
            {
                accidentalNotesCounter++;
            }
        }
        else
        {
            let shift = 76*naturalNotesCounter;
            newRung.style.left += `${shift}px`;
            naturalNotesCounter++;
        }
    }
}

function playScale (root, scalePattern, octave, preview)
{
    let timeout = (preview) ? 0 : 60000/tempo;
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