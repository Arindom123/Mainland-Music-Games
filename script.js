// html groupings for home page, free play page, minor variations buttons, & blues/pentatonic buttons
const homePageDiv = document.querySelector(".homepage");
const freePlayDiv = document.querySelector(".free-play");
//hide free-play screen & buttons on loadup
freePlayDiv.classList.add('hidden');
// get root dropdown ID
const rootsID = document.getElementById("Roots");
// scale variables
let roots = rootsID.value;
let scalePattern = "";
// get instruments buttons
const instruments = document.querySelectorAll(".instrument");
instruments.forEach(instrumentButtons);
// home button
const homeButton = document.getElementById("home-logo");
// buttons for scale type
const scaleTypeButtons = document.querySelectorAll(".scaleType");
scaleTypeButtons.forEach(scaleButtonsGeneration);
const scaleMajor = document.getElementById("scaleMajor");
const scaleMinor = document.getElementById("scaleMinor");
const scalePentatonic = document.getElementById("scalePentatonic");
const scaleBlues = document.getElementById("scaleBlues");
const scaleChromatic = document.getElementById("scaleChromatic");
// buttons for scale variation
const majorVariation = document.getElementById("majorVariation");
const minorVariation = document.getElementById("minorVariation");
const naturalVariation = document.getElementById("naturalVariation");
const harmonicVariation = document.getElementById("harmonicVariation");
const melodicVariation = document.getElementById("melodicVariation");
const minorVariations = document.querySelector(".minorVariations");
const bluesPentatonicVariations = document.querySelector(".bluesPentatonicVariations");
minorVariations.classList.add('hidden');
bluesPentatonicVariations.classList.add('hidden');
// notes for rung generation
const naturalNotes = ["A","B","C","D","E","F","G"];
const accidentals = ["A#","C#","D#","F#","G#"];
// chromatic scale for scale generation
const chromaticScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb","B"];
// scale pattern for each scale type
const majorPattern = [2,2,1,2,2,2,1];
const minorNaturalPattern = [2,1,2,2,1,2,2];
const minorHarmonicPattern = [2,1,2,2,1,3,1];
const minorMelodicPattern = [2,1,2,2,2,2,1];
const minorBluesPattern = [3,2,1,1,3,2];
const minorPentatonicPattern = [3,2,2,3,2];
const chromaticPattern = [1,1,1,1,1,1,1,1,1,1,1,1];
// add logic for instrument buttons
function instrumentButtons (button)
{
    button.addEventListener("click", function ()
    {
    freePlayDiv.classList.add('show');
    freePlayDiv.classList.remove('hidden');
    homePageDiv.classList.add('hidden');
    });
}
// add logic for scale buttons
function scaleButtonsGeneration (scale) {
    scale.addEventListener("click", function()
    {
    if (scale.data-pattern != false)
    {
        scalePattern = scale.getAttribute('data-scale');
    }
    document.getElementsByClassName("scaleType").disabled = false;
    scale.disabled = true;
    generateScale(roots, scalePattern);
    if (scale.data-variation == "none")
    {
    document.getElementsByClassName("variations").disabled = true;
    }
    if (scale.data-variation == "minorMajor")
        {
            document.getElementsByClassName(minorVariations).disabled = false;
            document.getElementsByClassName(bluesPentatonicVariations).disabled = true;
        }
        else
        {
            document.getElementsByClassName(bluesPentatonicVariations).disabled = false;
            document.getElementsByClassName(minorVariations).disabled = true;
        }
    });
}
// illustrate mallet rungs
function fillRungs () { 
    const board = document.getElementById('instrument-board');
    for (let i = 0; i<naturalNotes.length; i++)
    {
        const newRung = document.createElement('div');
        newRung.classList.add('rung');
        newRung.id = naturalNotes[i];
        board.append(newRung);
    }
    for (let i = 0; i<accidentals.length; i++)
    {
        const newRung =document.createElement('div');
        newRung.classList.add('accidentals');
        newRung.id = accidentals[i];
        board.append(newRung);
        const leftMargin = 80*(i+1)-45;
        newRung.style.marginLeft = leftMargin + "px";
    }
}
// testing fillRungs function
fillRungs(); 
// scale generation by root and pattern
function generateScale (roots, scalePattern) 
{
    let newScale = [];
    let currentIndex = chromaticScale.indexOf(roots);
    newScale.push(chromaticScale[currentIndex]);
    for (let i = 0; i<scalePattern.length; i++)
    {
        currentIndex+=scalePattern[i];
        if (currentIndex > 11)
        {
            currentIndex-=12;
        }
        newScale.push(chromaticScale[currentIndex]);
    }
    console.log(newScale);
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
// scale type event listener
function variations () {
    if (document.getElementById("scaleMinor").disabled == true)
    {
        document.getElementsByClassName("minorVariation").disabled = false;
        minorVariations.classList.remove('hidden');
    }
    else if (document.getElementById("scalePentatonic") || document.getElementById("scaleBlues"))
    {
        document.getElementsByClassName("bluesPentatonicVariation").disabled = false;
        bluesPentatonicVariations.classList.remove('hidden');
    }
}
naturalVariation.addEventListener("click", function()
{
    scalePattern = minorNaturalPattern;
    document.getElementsByClassName("minorVariation").disabled = false;
    document.getElementById("naturalVariation").disabled = true;
    generateScale(roots, scalePattern);
});
melodicVariation.addEventListener("click", function()
{
    scalePattern = minorMelodicPattern;
    document.getElementsByClassName("minorVariation").disabled = false;
    document.getElementById("melodicVariation").disabled = true;
    generateScale(roots, scalePattern);
});
harmonicVariation.addEventListener("click", function()
{
    scalePattern = minorHarmonicPattern;
    document.getElementsByClassName("minorVariation").disabled = false;
    document.getElementById("harmonicVariation").disabled = true;
    generateScale(roots, scalePattern);
});
minorVariation.addEventListener("click", function()
{
    document.getElementsByClassName("bluesPentatonicVariation").disabled = false;
    document.getElementById("minorVariation").disabled = true;
    if (document.getElementById("scalePentatonic").disabled == true)
    {
        scalePattern = minorPentatonicPattern;
        
    }
    else
    {
        scalePattern = minorBluesPattern;
    }
    generateScale(roots, scalePattern);
})