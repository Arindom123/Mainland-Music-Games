async function getMic() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted');
    } catch (err) {
        console.error('Microphone access denied:', err);
    }
}
const recordButton = document.getElementById('Audio-Record');
recordButton.addEventListener('click', getMic);