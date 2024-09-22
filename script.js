// Songs array
const songs = ['song1.mp3', 'song2.mp3', 'song3.mp3'];
let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio(songs[currentSongIndex]);

// DOM Elements
const nowPlaying = document.getElementById('now-playing');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const voiceBtn = document.getElementById('voice-btn');
const micAnimation = document.getElementById('mic-animation');
const progressBar = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

// Set initial song display
nowPlaying.textContent = `Now Playing: ${songs[currentSongIndex]}`;

// Play or pause music
function togglePlayPause() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    audio.src = songs[currentSongIndex];
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    updateProgress();
    audio.addEventListener('timeupdate', updateProgress);
}

function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playMusic();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playMusic();
}

// Update progress bar and time
function updateProgress() {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressPercent;

    // Update current time
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}

// Show total duration of the song when metadata is loaded
audio.addEventListener('loadedmetadata', () => {
    const totalMinutes = Math.floor(audio.duration / 60);
    const totalSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
    totalTimeEl.textContent = `${totalMinutes}:${totalSeconds}`;
});

// Voice recognition setup
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    if (transcript === 'play') {
        playMusic();
    } else if (transcript === 'pause') {
        pauseMusic();
    } else if (transcript === 'next') {
        nextSong();
    } else if (transcript === 'previous') {
        prevSong();
    }
});

// Voice recognition animation
voiceBtn.addEventListener('click', () => {
    recognition.start();
    micAnimation.style.display = 'block';
    setTimeout(() => micAnimation.style.display = 'none', 4000);
});

// Event Listeners
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
