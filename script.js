let scaleType = "";
let minorVar = "";
let roots = document.getElementById("Roots");
const homePageDiv = document.querySelector(".homepage");
const freePlayDiv = document.querySelector(".free-play");
const homeButton = document.getElementById("home-logo");
const scaleMajor = document.getElementById("scaleMajor");
const scaleMinor = document.getElementById("scaleMinor");
const scalePentatonic = document.getElementById("scalePentatonic");
const scaleBlues = document.getElementById("scaleBlues");
const scaleChromatic = document.getElementById("scaleChromatic");
const marimbaButton = document.getElementById("marimba");
const vibraphoneButton = document.getElementById("vibraphone");
const bellsButton = document.getElementById("bells");
const xylophoneButton = document.getElementById("xylophone");
const naturalNotes = ["A","B","C","D","E","F","G"];
const accidentals = ["A#","C#","D#","F#","G#"];
const chromaticScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb","B"];
const majorPattern = [2,2,1,2,2,2,1];
freePlayDiv.classList.add('hidden');
function fillRungs () { //this is the illustration of the mallet instrument
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
fillRungs(); //testing fillRungs function
function generateScale (roots, scaleType) //generate the scale
{
    const startingNoteIndex = chromaticScale.indexOf(roots);
    console.log("This is what the computer thinks the index for root A is" + startingNoteIndex);
    let newScale = [];
    if (scaleType == scaleMajor)
    {
    for (let i = 0; i<8; i++)
    {
        newScale.push(chromaticScale[startingNoteIndex+majorPattern[i]]);
    }
    }
    console.log(newScale);
}
roots.addEventListener("change", function()
{
    const rootsCurrent = roots.value;
    generateScale(roots, scaleType);
});
homeButton.addEventListener("click", function()
{
    freePlayDiv.classList.add('hidden');
    homePageDiv.classList.remove('hidden');
});
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
scaleMajor.addEventListener("click", function()
{
    scaleType = scaleMajor;
    document.getElementById("scaleMajor").disabled = true;
    document.getElementById("scaleMinor").disabled = false;
    document.getElementById("scalePentatonic").disabled = false;
    document.getElementById("scaleBlues").disabled = false;
    document.getElementById("scaleChromatic").disabled = false;
    document.getElementById("naturalVariation").disabled = true;
    document.getElementById("harmonicVariation").disabled = true;
    document.getElementById("melodicVariation").disabled = true;
    generateScale(document.getElementById("Roots"), scaleType);
});
scaleMinor.addEventListener("click", function()
{
    scaleType = scaleMajor;
    document.getElementById("scaleMajor").disabled = false;
    document.getElementById("scaleMinor").disabled = true;
    document.getElementById("scalePentatonic").disabled = false;
    document.getElementById("scaleBlues").disabled = false;
    document.getElementById("scaleChromatic").disabled = false;
    document.getElementById("naturalVariation").disabled = false;
    document.getElementById("harmonicVariation").disabled = false;
    document.getElementById("melodicVariation").disabled = false;
    generateScale(document.getElementById("Roots"), scaleType);
});
scalePentatonic.addEventListener("click", function()
{
    scaleType = scaleMajor;
    document.getElementById("scaleMajor").disabled = false;
    document.getElementById("scaleMinor").disabled = false;
    document.getElementById("scalePentatonic").disabled = true;
    document.getElementById("scaleBlues").disabled = false;
    document.getElementById("scaleChromatic").disabled = false;
    document.getElementById("naturalVariation").disabled = true;
    document.getElementById("harmonicVariation").disabled = true;
    document.getElementById("melodicVariation").disabled = true;
    generateScale(document.getElementById("Roots"), scaleType);
});
scaleBlues.addEventListener("click", function()
{
    scaleType = scaleMajor;
    document.getElementById("scaleMajor").disabled = false;
    document.getElementById("scaleMinor").disabled = false;
    document.getElementById("scalePentatonic").disabled = false;
    document.getElementById("scaleBlues").disabled = true;
    document.getElementById("scaleChromatic").disabled = false;
    document.getElementById("naturalVariation").disabled = true;
    document.getElementById("harmonicVariation").disabled = true;
    document.getElementById("melodicVariation").disabled = true;
    generateScale(document.getElementById("Roots"), scaleType);
});
scaleChromatic.addEventListener("click", function()
{
    scaleType = scaleMajor;
    document.getElementById("scaleMajor").disabled = false;
    document.getElementById("scaleMinor").disabled = false;
    document.getElementById("scalePentatonic").disabled = false;
    document.getElementById("scaleBlues").disabled = false;
    document.getElementById("scaleChromatic").disabled = true;
    document.getElementById("naturalVariation").disabled = true;
    document.getElementById("harmonicVariation").disabled = true;
    document.getElementById("melodicVariation").disabled = true;
    generateScale(document.getElementById("Roots"), scaleType);
});