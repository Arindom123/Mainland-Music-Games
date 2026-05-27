const homeDiv = document.getElementById("home");
const playDiv = document.getElementById("play");
const instrumentsDiv = document.getElementById("instruments");
const instrumentButtons = instrumentsDiv.querySelectorAll('button');
const scaleDiv = document.getElementById("scales");
const scaleButtons = scaleDiv.querySelectorAll('button');
const homeButton = document.getElementById("home-logo");
const rootDropdown = document.getElementById("root");
const startButton = document.getElementById("startButton");

playDiv.classList.add('hidden');

const scalePatternsMap = new Map();
scalePatternsMap.set("majorIonianPattern", [2, 2, 1, 2, 2, 2, 1]); //major
scalePatternsMap.set("majorLydianPattern", [2, 2, 2, 1, 2, 2, 1]);
scalePatternsMap.set("majorMixolydianPattern", [2, 2, 1, 2, 2, 1, 2]);
scalePatternsMap.set("majorHarmonicPattern", [2, 2, 1, 2, 1, 3, 1]);
scalePatternsMap.set("majorPentatonicPattern", [2, 2, 3, 2, 3]);
scalePatternsMap.set("majorBluesPattern", [2, 1, 1, 3, 2, 3]);
scalePatternsMap.set("minorAeolianPattern", [2, 1, 2, 2, 1, 2, 2]); //minor
scalePatternsMap.set("minorDorianPattern", [2, 1, 2, 2, 2, 1, 2]);
scalePatternsMap.set("minorPhrygianPattern", [1, 2, 2, 2, 1, 2, 2]);
scalePatternsMap.set("minorHarmonicPattern", [2, 1, 2, 2, 1, 3, 1]);
scalePatternsMap.set("minorMelodicPattern", [2, 1, 2, 2, 2, 2, 1]);
scalePatternsMap.set("minorPentatonicPattern", [3, 2, 2, 3, 2]);
scalePatternsMap.set("minorBluesPattern", [3, 2, 1, 1, 3, 2]);
scalePatternsMap.set("chromaticPattern", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]); //other
scalePatternsMap.set("locrianPattern", [1, 2, 2, 1, 2, 2, 2]);

const chromaticScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb","B"];
const masterScale = [
    ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb","B"], 
    ["C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2","B2"],
    ["C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3","B3"],
//    ["C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4","B4"]
];

let currentScale = [];
let scalePattern = [];
let root = rootDropdown.value;
let naturalRungDiv = document.getElementById("naturalRungs");
let accidentalRungDiv = document.getElementById("accidentalRungs");

rootDropdown.addEventListener("change", function()
{
    root = rootDropdown.value;
});

homeButton.addEventListener("click", function()
{
    playDiv.classList.add('hidden');
    homeDiv.classList.remove('hidden');
});

startButton.addEventListener("click", function()
{
    scaleDiv.classList.add('hidden');
    playScale(root, scalePattern, 2);
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
    scaleButtons.forEach(enableButton);
    scaleButton.disabled = true;
    scalePattern = scalePatternsMap.get(scaleButton.getAttribute('data-pattern'));
    console.log(scalePattern);
});
}

function instantiateInstrumentButtons (instrumentButton)
{
    instrumentButton.addEventListener("click", function ()
    {
    homeDiv.classList.add('hidden');
    playDiv.classList.remove('hidden');
    playDiv.classList.add('show')
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
                    newRung.style.marginRight = "70px";
                }
            }
            else
            {
                naturalRungDiv.append(newRung);
            }
        }
    }
}

function playScale (root, scalePattern, octaves)
{
    let scale = generateScale(root, scalePattern, octaves);
    const rungs = document.querySelectorAll('.rungs');
    for (let i = 0; i<scale.length; i++)
    {
        setTimeout(() => {
            rungs.forEach(rung => rung.classList.remove('selected'));
            let row = masterScale.findIndex(row => row.includes(scale[i]));
            let col = row !== -1 ? masterScale[row].indexOf(scale[i]) : -1;
            document.getElementById(masterScale[row][col]).classList.add('selected');
        }, i * 500); //500 ms
    }
}

function generateScale (root, scalePattern, octaves) 
{
    let index = chromaticScale.indexOf(root);
    let scale = []
    let i = 0;
    let j = 0;
    while (octaves>0)
    {
        scale.push(masterScale[j][index]);
        index = index + scalePattern[i];
        i++;
        if (i == scalePattern.length)
        {
            i = 0;
            octaves--;
        }
        if (index >= 12)
        {
            index-=12;
            j++;
        }
    }
    return scale
}