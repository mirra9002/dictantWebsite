const inputField = document.getElementById('wordInput');
const results = document.getElementById('results');
const buttonReset = document.getElementById('btn-reset');
const buttonVoice = document.getElementById('voiceSearch');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


let data = [];
fetch('ukrainian_words_full_version.json')
  .then(response => response.json()) // Parse JSON
  .then(jsonData => {
    data = jsonData; // Store words in the global variable
  })
  .catch(error => console.error("Error loading JSON:", error));


inputField.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    results.innerHTML = '';

    if(query){
        data.forEach(word => {
            if(word.toLowerCase().startsWith(query)){
                let wordLi = document.createElement('li');
                wordLi.textContent = word;
                results.appendChild(wordLi);
                console.log('word: ' + word);
            }
        });
    }
});



if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'uk-UA'; // Set language (Ukrainian)
    recognition.interimResults = false; // Only return final result


    buttonVoice.addEventListener('click', () => {
        recognition.start(); // Start listening
    });

    recognition.addEventListener('result', (event) => {
        const spokenWord = event.results[0][0].transcript.toLowerCase();
        inputField.value = spokenWord; // Set input field with spoken text

        // Trigger the input event to search automatically
        inputField.dispatchEvent(new Event('input'));
    });

    recognition.addEventListener('end', () => {
        console.log("Voice recognition ended.");
    });

    recognition.addEventListener('error', (event) => {
        console.error("Speech recognition error:", event.error);
    });

} else {
    alert("Your browser does not support Speech Recognition.");
}


buttonReset.addEventListener('click', () => {
    results.innerHTML = '';
    inputField.value = '';
    if (recognition) {
        recognition.stop();
        console.log("Voice search stopped.");
    }
});