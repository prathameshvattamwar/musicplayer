const audioPlayer = document.getElementById('audio-player');
const trackTitle = document.getElementById('track-title');
const playPauseBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const progressBar = document.getElementById('progress-bar');
const prevTrackBtn = document.getElementById('prev-track');
const nextTrackBtn = document.getElementById('next-track');
const startRecognitionButton = document.getElementById('start-recognition');
const voiceStatus = document.getElementById('voice-status');

// Playlist and current track index
let trackIndex = 0;
const playlist = [
    { title: 'Song 1', src: 'song1.mp3' },
    { title: 'Song 2', src: 'song2.mp3' },
    { title: 'Song 3', src: 'song3.mp3' }
];

// Set initial track
audioPlayer.src = playlist[trackIndex].src;
trackTitle.textContent = `Now Playing: ${playlist[trackIndex].title}`;

// Update the play/pause button
function updatePlayPauseBtn() {
    if (audioPlayer.paused) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
}

// Play or pause track
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
    updatePlayPauseBtn();
});

// Play next track
nextTrackBtn.addEventListener('click', nextTrack);

// Play previous track
prevTrackBtn.addEventListener('click', prevTrack);

function nextTrack() {
    trackIndex = (trackIndex + 1) % playlist.length;
    loadTrack(trackIndex);
}

function prevTrack() {
    trackIndex = (trackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(trackIndex);
}

function loadTrack(index) {
    audioPlayer.src = playlist[index].src;
    trackTitle.textContent = `Now Playing: ${playlist[index].title}`;
    audioPlayer.play();
    updatePlayPauseBtn();
}

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
});

// Set current time based on progress bar
progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

// Web Speech API initialization
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Enable continuous recognition and interim results for instant reaction
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.onstart = function() {
    voiceStatus.textContent = 'Listening... Try saying "Play", "Pause", "Next", or "Previous".';
};

recognition.onresult = function(event) {
    let spokenWords = event.results[0][0].transcript.toLowerCase();
    
    // Log the words as they are spoken (even interim results)
    console.log('You said:', spokenWords);

    // Only react to final commands (when user finishes speaking)
    if (event.results[0].isFinal) {
        console.log('Final command:', spokenWords);
        handleVoiceCommand(spokenWords);
    } else {
        // Optional: Can react to interim results (in case you want to react earlier)
        // handleVoiceCommand(spokenWords); // Uncomment if you want to react to interim results
    }
};

recognition.onspeechend = function() {
    voiceStatus.textContent = 'Listening paused. You can say another command.';
};

recognition.onerror = function(event) {
    voiceStatus.textContent = 'Error occurred in recognition: ' + event.error;
};

function handleVoiceCommand(command) {
    if (command.includes('play')) {
        audioPlayer.play();
        updatePlayPauseBtn();
        voiceStatus.textContent = 'Playing track';
    } else if (command.includes('pause')) {
        audioPlayer.pause();
        updatePlayPauseBtn();
        voiceStatus.textContent = 'Paused';
    } else if (command.includes('next')) {
        nextTrack();
        voiceStatus.textContent = 'Next track: ' + playlist[trackIndex].title;
    } else if (command.includes('previous')) {
        prevTrack();
        voiceStatus.textContent = 'Previous track: ' + playlist[trackIndex].title;
    } else {
        voiceStatus.textContent = 'Command not recognized, try "Play", "Pause", "Next", or "Previous".';
    }
}

// Start voice recognition when button is clicked
startRecognitionButton.addEventListener('click', () => {
    recognition.start();
    voiceStatus.textContent = 'Voice recognition started. Listening...';
});

// Check if it's a mobile browser and handle accordingly
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile && navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
    recognition.continuous = false; // Safari iOS issue: Disable continuous mode
} else {
    recognition.continuous = true; // Keep continuous mode on other platforms
}

// Enable interim results for faster feedback
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.onstart = function () {
    voiceStatus.textContent = 'Listening... Try saying "Play", "Pause", "Next", or "Previous".';
};

recognition.onresult = function (event) {
    let spokenWords = event.results[0][0].transcript.toLowerCase();

    console.log('You said:', spokenWords);

    // Only react to final commands (when user finishes speaking)
    if (event.results[0].isFinal) {
        console.log('Final command:', spokenWords);
        handleVoiceCommand(spokenWords);
    }
};

recognition.onspeechend = function () {
    voiceStatus.textContent = 'Listening paused. You can say another command.';
};

recognition.onerror = function (event) {
    console.log('Speech Recognition Error:', event.error);
    voiceStatus.textContent = 'Error occurred in recognition: ' + event.error;
};

// Function to handle voice commands
function handleVoiceCommand(command) {
    if (command.includes('play')) {
        audioPlayer.play();
        updatePlayPauseBtn();
        voiceStatus.textContent = 'Playing track';
    } else if (command.includes('pause')) {
        audioPlayer.pause();
        updatePlayPauseBtn();
        voiceStatus.textContent = 'Paused';
    } else if (command.includes('next')) {
        nextTrack();
        voiceStatus.textContent = 'Next track: ' + playlist[trackIndex].title;
    } else if (command.includes('previous')) {
        prevTrack();
        voiceStatus.textContent = 'Previous track: ' + playlist[trackIndex].title;
    } else {
        voiceStatus.textContent = 'Command not recognized, try "Play", "Pause", "Next", or "Previous".';
    }
}

// Start voice recognition when button is clicked
startRecognitionButton.addEventListener('click', () => {
    // Ensure microphone permissions are granted
    navigator.permissions.query({ name: 'microphone' }).then(function (result) {
        if (result.state === 'granted') {
            recognition.start();
            voiceStatus.textContent = 'Voice recognition started. Listening...';
        } else {
            alert('Microphone access is required for voice recognition.');
        }
    });
});
