// --- IMPORTS ---
import songs from './data/songs.js';
import { renderLyrics, syncLyrics } from './modules/lyrics.js';
import { formatTime } from './utils/formatTime.js';

// --- DOM ELEMENTS ---
const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const playIcon = playButton.querySelector('i');

// --- STATE ---
let songIndex = 0;

// --- CORE FUNCTIONS ---

function loadSong(song) {
    // UI Updates
    title.classList.remove('is-overflowing');
    title.style.textAlign = 'center'; 
    title.innerHTML = `<span>${song.title}</span>`;
    artist.textContent = song.artist;
    
    // Audio Source
    audio.src = song.src;

    // Module Lirik
    renderLyrics(song);
}

function playSong() {
    audio.play();
}

function pauseSong() {
    audio.pause();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = songs.length - 1;
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
}

// --- PROGRESS BAR FUNCTIONS ---

function updateProgressBar(e) {
    const { duration, currentTime } = e.srcElement;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
}

function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// --- EVENT LISTENERS ---

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    loadSong(songs[songIndex]);
});

// Controls
playButton.addEventListener('click', () => {
    const isPaused = audio.paused;
    isPaused ? playSong() : pauseSong();
});
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);

// Audio Events
audio.addEventListener('play', () => {
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
});

audio.addEventListener('pause', () => {
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
});

audio.addEventListener('ended', nextSong);

// Time Update (Progress & Lyrics)
audio.addEventListener('timeupdate', (e) => {
    updateProgressBar(e);
    // Panggil syncLyrics dari module, kirim waktu & data lirik
    syncLyrics(audio.currentTime, songs[songIndex].lyrics); 
});

// Progress Bar Click
progressContainer.addEventListener('click', setProgressBar);

// Metadata Loaded (Marquee Title)
audio.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audio.duration);
    
    const titleSpan = title.querySelector('span');
    if (titleSpan) {
        const containerWidth = title.clientWidth;
        const textWidth = titleSpan.scrollWidth;
        if (textWidth > containerWidth) {
            const marqueeText = `${songs[songIndex].title} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${songs[songIndex].title} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
            titleSpan.innerHTML = marqueeText;
            title.classList.add('is-overflowing');
        } else {
            title.style.textAlign = 'center';
        }
    }
});