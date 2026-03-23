const naturalNotes = ["A","B","C","D","E","F","G"];
const accidentals = ["A#","C#","D#","F#","G#"];
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
fillRungs();