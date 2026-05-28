const homeScreen = document.getElementById("home");
const scaleSelectionScreen = document.getElementById("scaleSelection");
const playingScreen = document.getElementById("playing");

const homeButton = document.getElementById("home-logo");
const instrumentButtons = document.querySelectorAll('.instruments');
const scaleButtons = document.querySelectorAll("[data-pattern]");
const startButton = document.getElementById("startButton");
const replayButton = document.getElementById("replayButton");
const backButton = document.getElementById("backButton");

const rootDropdown = document.getElementById("root");
const octaveDropdown = document.getElementById("octaves");

const stickyNotesCheckbox = document.getElementById("stickyNotes");

const scaleNameText = document.getElementById("scaleName");
const selectScaleText = document.getElementById("selectScale");

function home ()
{
    homeScreen.classList.remove('hidden');
    scaleSelectionScreen.classList.add('hidden');
    playingScreen.classList.add('hidden');
}

function scaleSelection ()
{
    homeScreen.classList.add('hidden');
    scaleSelectionScreen.classList.remove('hidden');
    playingScreen.classList.add('hidden');
    startButton.textContent = "Play";
}

function playing ()
{
    scaleSelectionScreen.classList.add('hidden');
    playingScreen.classList.remove('hidden');
    startButton.classList.remove('hidden');
    startButton.textContent = "Replay";
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
scalePatternsMap.set("chromatic", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]); //other
scalePatternsMap.set("locrian", [1, 2, 2, 1, 2, 2, 2]);

const chromaticScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb","B"];
const masterScale = [
    ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb","B"], 
    ["C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2","B2"],
    ["C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3","B3"],
    ["C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4","B4"]
];

let stickyNotes = stickyNotesCheckbox.checked;
let scalePattern = [];
let root = rootDropdown.value;
let naturalRungDiv = document.getElementById("naturalRungs");
let accidentalRungDiv = document.getElementById("accidentalRungs");
let play = null;
let currentIndex = 0;
let scaleName = "";
let octave = octaveDropdown.value;

rootDropdown.addEventListener("change", function()
{
    root = rootDropdown.value;
});

octaveDropdown.addEventListener("change", function()
{
    octave = octaveDropdown.value;
});

stickyNotesCheckbox.addEventListener("change", function() 
{
    stickyNotes = stickyNotesCheckbox.checked;
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
    playScale(root, scalePattern, octave, stickyNotes);
});

replayButton.addEventListener("click", function()
{
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    playScale(root, scalePattern, octave, stickyNotes);
});

backButton.addEventListener("click", function()
{
    clearInterval(play);
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    scaleSelection();
    selectScaleText.classList.remove('hidden');
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
});
}

function instantiateInstrumentButtons (instrumentButton)
{
    instrumentButton.addEventListener("click", function ()
    {
    scaleSelection();
    fillRungs();
    });
}

function fillRungs () { 
    naturalRungDiv.replaceChildren();
    accidentalRungDiv.replaceChildren();
    for (let i = 0; i<masterScale.length; i++)
    {
        for (let j = 0; j<masterScale[i].length; j++)
        {
            let newRung = document.createElement('div');
            newRung.classList.add('rung')
            newRung.id = masterScale[i][j];
            if (newRung.id.includes('b'))
            {
                accidentalRungDiv.append(newRung);
                if (newRung.id.includes('Bb') || newRung.id.includes('Eb'))
                {
                    newRung.style.marginRight = "63px";
                }
            }
            else
            {
                naturalRungDiv.append(newRung);
            }
        }
    }
}

function playScale (root, scalePattern, octave, stickyNotes)
{
    const scaleAscending = generateScale(root, scalePattern, octave);
    scaleNameText.textContent = "Scale: " + root + " " + scaleName;
    const scaleDescending = scaleAscending.slice(0,-1).toReversed();
    const scale = scaleAscending.concat(scaleDescending);
    currentIndex = 0;
    play = setInterval(function() {interval(scale, stickyNotes)}, 500);
}

function interval (scale, stickyNotes)
{
    if (currentIndex == scale.length)
    {
        if (!stickyNotes)
        {
        clearInterval(play);
        document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
        }
        return;
    }
    masterScaleIndexer(scale[currentIndex], currentIndex, stickyNotes);
    currentIndex++;
}

function masterScaleIndexer (note, i, stickyNotes)
{
    let row = masterScale.findIndex(row => row.includes(note));
    let col = masterScale[row].indexOf(note);
    if (!stickyNotes)
    {
    document.querySelectorAll('.selected').forEach(element => element.classList.remove('selected'));
    }
    document.getElementById(masterScale[row][col]).classList.add('selected');
}

function generateScale (root, scalePattern, octave) 
{
    let index = chromaticScale.indexOf(root);
    let scale = []
    let i = 0;
    let j = 0;
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