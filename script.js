// get root dropdown ID
const rootsID = document.getElementById("Roots");
// scale variables
let roots = rootsID.value;
let scalePattern = "";
// html groupings for home page, free play page, minor variations buttons, & blues/pentatonic buttons
const homePageDiv = document.querySelector(".homepage");
const freePlayDiv = document.querySelector(".free-play");
const minorVariationsButtons = document.querySelector(".minorVariationsButtons");
const bluesPentatonicVariationsButtons = document.querySelector(".bluesPentatonicVariationsButtons");
// buttons for instrument selection
const marimbaButton = document.getElementById("marimba");
const vibraphoneButton = document.getElementById("vibraphone");
const bellsButton = document.getElementById("bells");
const xylophoneButton = document.getElementById("xylophone");
// home button
const homeButton = document.getElementById("home-logo");
// buttons for scale type
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
//hide free-play screen & buttons on loadup
freePlayDiv.classList.add('hidden');
minorVariationsButtons.classList.add('hidden');
bluesPentatonicVariationsButtons.classList.add('hidden');
// illustrate mallet instrument
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
// instrument selection event listener
marimbaButton.addEventListener("click", function()
{
    freePlayDiv.classList.add('show');
    freePlayDiv.classList.remove('hidden');
    homePageDiv.classList.add('hidden');
});
xylophoneButton.addEventListener("click", function()
{
    freePlayDiv.classList.add('show');
    freePlayDiv.classList.remove('hidden');
    homePageDiv.classList.add('hidden');
});
bellsButton.addEventListener("click", function()
{
    freePlayDiv.classList.add('show');
    freePlayDiv.classList.remove('hidden');
    homePageDiv.classList.add('hidden');
});
vibraphoneButton.addEventListener("click", function()
{
    freePlayDiv.classList.add('show');
    freePlayDiv.classList.remove('hidden');
    homePageDiv.classList.add('hidden');
});
// scale type event listener
scaleMajor.addEventListener("click", function()
{
    scalePattern = majorPattern;
    document.getElementsByClassName("scaleType").disabled = false;
    document.getElementById("scaleMajor").disabled = true;
    generateScale(roots, scalePattern);
    document.getElementsByClassName("variations").disabled = true;
});
scaleMinor.addEventListener("click", function()
{
    document.getElementsByClassName("scaleType").disabled = false;
    document.getElementById("scaleMinor").disabled = true;
    variations();
});
scalePentatonic.addEventListener("click", function()
{
    document.getElementsByClassName("scaleType").disabled = false;
    document.getElementById("scalePentatonic").disabled = true;
    variations();
});
scaleBlues.addEventListener("click", function()
{
    document.getElementsByClassName("scaleType").disabled = false;
    document.getElementById("scaleBlues").disabled = true;
    variations();
});
scaleChromatic.addEventListener("click", function()
{
    scalePattern = chromaticPattern;
    document.getElementsByClassName("scaleType").disabled = false;
    document.getElementById("scaleChromatic").disabled = true;
    document.getElementsByClassName("variations").disabled = true;
    generateScale(roots, scalePattern);
});
function variations () {
    if (document.getElementById("scaleMinor").disabled == true)
    {
        document.getElementsByClassName("minorVariation").disabled = false;
        minorVariationsButtons.classList.remove('hidden');
    }
    else if (document.getElementById("scalePentatonic") || document.getElementById("scaleBlues"))
    {
        document.getElementsByClassName("bluesPentatonicVariation").disabled = false;
        bluesPentatonicVariationsButtons.classList.remove('hidden');
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