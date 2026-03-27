// scale pattern for each scale type
const scalePatternsMap = new Map();
scalePatternsMap.set("majorPattern", [2,2,1,2,2,2,1]);
scalePatternsMap.set("minorNaturalPattern", [2,1,2,2,1,2,2]);
scalePatternsMap.set("minorHarmonicPattern", [2,1,2,2,1,3,1]);
scalePatternsMap.set("minorMelodicPattern", [2,1,2,2,2,2,1]);
scalePatternsMap.set("minorBluesPattern", [3,2,1,1,3,2]);
scalePatternsMap.set("minorPentatonicPattern", [3,2,2,3,2]);
scalePatternsMap.set("chromaticPattern", [1,1,1,1,1,1,1,1,1,1,1,1]);
startButton = document.getElementById("startButton");
let currentScale = [];
let scaleType = "";
const scaleButtons = document.querySelectorAll(".scales button");
scaleButtons.forEach(assignScalePattern);
function minorToMajor(scalePattern)
{
    let placeholder = scalePattern[0];
    scalePattern.splice(0,1);
    scalePattern.push(placeholder);
    return scalePattern;
}
function enableButtons (button)
{
    button.disabled = false;
}
function assignScalePattern (scaleButton)
{
    scaleButton.addEventListener("click", function()
{
    scaleButtons.forEach(enableButtons);
    if (scaleButton.classList.contains("scaleType"))
    {
    minorVariationsDiv.classList.add('hidden');
    minorMajorDiv.classList.add('hidden');
    scaleType = scaleButton.id;
    }
    document.getElementById(scaleType).disabled = true;
    scaleButton.disabled = true;
    scalePattern = scaleButton.getAttribute('data-pattern');
    if (scaleType == "scalePentatonic" || scaleType == "scaleBlues")
    {
        minorMajorDiv.classList.remove('hidden');
        if (scalePattern == "major" || scalePattern == "minor")
        {
            if (scaleType == "scalePentatonic")
            {
            scalePattern = "minorPentatonicPattern";
            }
            else
            {
                scalePattern = "minorBluesPattern";
            }
            if (scalePattern == "major")
            {
                scalePattern = minorToMajor(scalePatternsMap.get(scalePattern));
            }
        }
            
    }
    if (scaleType == "scaleMinor")
    {
        minorVariationsDiv.classList.remove('hidden');
    }
    if (scalePattern != "none")
    {
        generateScale(roots,scalePatternsMap.get(scalePattern));
    }
});
}
// html groupings for home page, free play page, minor variations buttons, & blues/pentatonic buttons
const homePageDiv = document.querySelector(".homepage");
const freePlayDiv = document.querySelector(".free-play");
const scaleButtonsDiv = document.querySelector(".scales");
const minorMajorDiv = document.querySelector(".minorMajorVariations");
const minorVariationsDiv = document.querySelector(".minorVariations");
//hide free-play screen & buttons on loadup
freePlayDiv.classList.add('hidden');
// get root dropdown ID
const rootsID = document.getElementById("Roots");
// scale variables
let roots = rootsID.value;
let scalePattern = "";
// instrument buttons & scale type buttons
const instruments = document.querySelectorAll(".instrument");
instruments.forEach(instrumentButtons);
// home button
const homeButton = document.getElementById("home-logo");
// chromatic scale for scale generation
const chromaticScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb","B"];
const chromaticScaleSecondOctave = ["C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2","B2"];
// add logic for instrument buttons
function instrumentButtons (button)
{
    button.addEventListener("click", function ()
    {
    freePlayDiv.classList.add('show');
    freePlayDiv.classList.remove('hidden');
    homePageDiv.classList.add('hidden');
    fillRungs();
    });
}
// illustrate mallet rungs
function fillRungs () { 
    let boardDiv = document.getElementById('instrument-board');
    for (let i = 0; i<(chromaticScale.length + chromaticScaleSecondOctave.length); i++)
    {
        const newRung = document.createElement('div');
        if (i>7)
        {
            newRung.id = chromaticScaleSecondOctave[i];
        }
        newRung.id = chromaticScale[i];
        newRung.classList.add('rung');
        if (newRung.id.includes('b'))
        {
        let referenceRung = document.getElementById(chromaticScale[i-1]);
        const refLeft = referenceRung.offsetLeft;
        const refTop = referenceRung.offsetTop;
        newRung.style.position = 'absolute';
        newRung.style.left = `${refLeft+30}px`;
        newRung.style.top = `${refTop-165}px`;
        }
        boardDiv.append(newRung);
    }
}
function playScale ()
{
    const board = document.getElementById('instrument-board').querySelectorAll('.rung');
    for (let i = 0; i<currentScale.length; i++)
    {
        setTimeout(() => {
            board.forEach(rung => rung.classList.remove('selected'));
            if (currentScale[i].includes('2'))
            {
            document.getElementById(currentScaleSecondOctave[i]).classList.add('selected');
            }
            else
            {
            document.getElementById(currentScale[i]).classList.add('selected');                
            }
        }, i * 500); //500 ms
    }
}
// scale generation by root and pattern
function generateScale (roots, scalePattern) 
{
    let currentIndex = chromaticScale.indexOf(roots);
    currentScale.length = 0;
    currentScale.push(chromaticScale[currentIndex]);
    for (let i = 0; i<scalePattern.length; i++)
    {
        currentIndex+=scalePattern[i];
        if (currentIndex > 11)
        {
            currentIndex-=12;
        }
        if (currentScale.length > 7)
        {
        currentScale.push(chromaticScaleSecondOctave[currentIndex]);
        }
        currentScale.push(chromaticScale[currentIndex]);
    }
}
// record updates to root dropdown
rootsID.addEventListener("change", function()
{
    roots = rootsID.value;
});
// home button event listener
homeButton.addEventListener("click", function()
{
    freePlayDiv.classList.add('hidden');
    homePageDiv.classList.remove('hidden');
});
startButton.addEventListener("click", function()
{
    console.log(currentScale);
    playScale();
});