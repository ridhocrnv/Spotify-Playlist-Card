// --- 1. Ambil Elemen dari HTML ---
const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

// Ambil elemen info lagu
const title = document.getElementById('title');
const artist = document.getElementById('artist');

// Ambil elemen progress bar & waktu
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');

// Ambil ikon di dalam tombol play
const playIcon = playButton.querySelector('i');

// Ambil container lirik
const lyricsList = document.getElementById('lyrics-list');

// --- 2. Data Playlist ---
const songs = [
    {
        title: 'Aku dan Dirimu (feat. Ari Lasso)',
        artist: 'Bunga Citra Lestari, Ari Lasso',
        src: 'src/aku-dan-dirimu.mp3',
        lyrics: [
            { time: 0, text: "..." },
            { time: 0.3, text: "Duhai cintaku, sayangku, lepaskanlah" },
            { time: 8.0, text: "Perasaanmu, rindumu, seluruh cintamu" },
            { time: 16.0, text: "Dan kini hanya ada aku dan dirimu" },
            { time: 24.5, text: "Sesaat di keabadian" },
        ]
    },
    {
        title: 'Til Death Do Us Part',
        artist: 'White Lion',
        src: 'src/til-death-do-us-part.mp3',
        lyrics: [
            {time: 0, text: "In this world"},
            {time: 2.5, text: "That I know I wouldn't do"},
            {time: 6.5, text: "To be near you every day"},
            {time: 10.5, text: "Every hour, every minute"},
            {time: 17.0, text: "Take my hand"},
            {time: 18.5, text: "And let me lead the way"},
            {time: 24.5, text: "All through your life"},
            {time: 28.5, text: "I'll be by your side"},
            {time: 32.5, text: "'Til death do us part"},
            {time: 40.0, text: "Baby, I'll be your friend"},
            {time: 44.0, text: "My love will never end"},
            {time: 47.5, text: "'Til death do us part"},
            {time: 55.0, text: "When I wake up every day"},
        ] // Kosongkan array jika belum sempat isi lirik
    },
    {
        title: "You're All I Need",
        artist: 'White Lion',
        src: 'src/youre-all-i-need.mp3',
        lyrics: [
            {time: 0, text: "..."},
            {time: 1.0, text: "She doesn't know"},
            {time: 3.0, text: "You're all I need"},
            {time: 5.0, text: "Beside me, girl!"},
            {time: 7.5, text: "You're all I need"},
            {time: 9.0, text: "To turn my world"},
            {time: 11.5, text: "You're all I want"},
            {time: 13.0, text: "Inside my heart"},
            {time: 15.0, text: "You're all I need"},
            {time: 17.0, text: "When we're apart"},
            {time: 22.5, text: "Say"},
            {time: 24.5, text: "Say that you'll be there"},
            {time: 29.5, text: "Whenever I reach out"},
            {time: 32.5, text: "To feel your hand in mine"},
            {time: 38.5, text: "Stay"},
            {time: 40.5, text: "Stay within my heart"},
            {time: 45.5, text: "Whenever I'm alone"},
            {time: 48.5, text: "I know that you are there"},
            {time: 53.5, text: "Oooooh!"},
        ] // Kosongkan array jika belum sempat isi lirik
    },
    {
        title: "I Live My Life for You",
        artist: 'Firehouse',
        src: 'src/i-live-my-life-for-you.mp3',
        lyrics: [
            {time: 0, text: "For you"},
            {time: 2.0, text: "I want to be by your side"},
            {time: 5.5, text: "In everything that you do"},
            {time: 8.5, text: "And if there's only one thing"},
            {time: 11.5, text: "You can believe is true"},
            {time: 18.5, text: "I live my life for you"},
            {time: 30.5, text: "I dedicate my life to you"},
            {time: 34.0, text: "You know that I would die"},
            {time: 36.0, text: "For you"},
            {time: 37.5, text: "But our love would last"},
            {time: 40.5, text: "Forever"},
            {time: 44.5, text: "And I will always be with you"},
            {time: 47.5, text: "And there is nothing"},
            {time: 49.0, text: "We can't do"},
            {time: 51.5, text: "As long as we're together"},
            {time: 58.5, text: "I just can't live without you"},
        ] // Kosongkan array jika belum sempat isi lirik
    },
    {
        title: "When I Look Into Your Eyes",
        artist: 'Firehouse',
        src: 'src/when-i-look-into-your-eyes.mp3',
        lyrics: [
            {time: 0, text: "'Cause I see my whole world"},
            {time: 3.0, text: "I see only you"},
            {time: 6.5, text: "When I look into your eyes"},
            {time: 13.0, text: "I can see how much I love you"},
            {time: 15.7, text: "And it makes me realize"},
            {time: 19.4, text: "When I look into your eyes"},
            {time: 25.8, text: "I see all my dreams come true"},
            {time: 29.4, text: "When I look into your eyes"},
            {time: 33.5, text: "♫"},
        ] // Kosongkan array jika belum sempat isi lirik
    },
    // ... tambahkan lagu lain di sini ...
];

// --- 3. State Player ---
let songIndex = 0;

// --- 4. Fungsi Helper Lirik (Render & Sync) ---

// Fungsi Helper Lirik (Render & Sync)

// Fungsi: Render Lirik ke HTML saat lagu dimuat
function renderLyrics(song) {
    const lyricsContainer = document.querySelector('.lyrics-container');
    lyricsList.innerHTML = ""; // Bersihkan lirik sebelumnya

    if (song.lyrics && song.lyrics.length > 0) {
        // KONDISI ADA LIRIK:
        // 1. Hapus class empty-state (agar scroll & masking aktif)
        lyricsContainer.classList.remove('empty-state');
        
        // 2. Render lirik
        song.lyrics.forEach((line, index) => {
            const li = document.createElement('li');
            li.innerText = line.text;
            li.dataset.time = line.time; 
            li.id = `line-${index}`;     
            lyricsList.appendChild(li);
        });
    } else {
        // KONDISI TIDAK ADA LIRIK:
        // 1. Tambah class empty-state (agar Flexbox centering aktif)
        lyricsContainer.classList.add('empty-state');
        
        // 2. Tampilkan pesan
        lyricsList.innerHTML = `
            <li style="font-size: 1.2rem; margin-bottom: 5px;">🎵</li>
            <li>Lirik belum tersedia</li>
            <li style="font-size: 0.8rem; font-weight: 400;">Just enjoy the vibe ❤️</li>
        `;
    }
}

// Fungsi: Sinkronisasi Lirik (Highlighting)
function syncLyrics() {
    // Jangan jalankan jika tidak ada lirik
    if (!songs[songIndex].lyrics || songs[songIndex].lyrics.length === 0) return;

    const currentTime = audio.currentTime;
    const lyrics = songs[songIndex].lyrics;
    
    // Cari index lirik yang sedang aktif
    let activeIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
        const currentLineTime = lyrics[i].time;
        const nextLineTime = (i < lyrics.length - 1) ? lyrics[i + 1].time : Infinity;

        if (currentTime >= currentLineTime && currentTime < nextLineTime) {
            activeIndex = i;
            break;
        }
    }

    // Update UI hanya jika ditemukan lirik aktif
    if (activeIndex !== -1) {
        const activeLi = document.getElementById(`line-${activeIndex}`);
        
        // OPTIMASI: Hanya update class jika lirik yang aktif BERUBAH
        // (Mencegah DOM repaint berlebihan setiap milidetik)
        if (activeLi && !activeLi.classList.contains('active')) {
            // Hapus active dari semua baris
            const allLis = lyricsList.querySelectorAll('li');
            allLis.forEach(li => li.classList.remove('active'));
            
            // Tambah active ke baris sekarang
            activeLi.classList.add('active');

            // Auto Scroll ke tengah
            activeLi.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}

// --- 5. Fungsi Inti Player ---

// Fungsi: Memuat Lagu (Logic Utama)
function loadSong(song) {
    // A. Reset Tampilan Judul
    title.classList.remove('is-overflowing');
    title.style.textAlign = 'center'; 
    title.innerHTML = `<span>${song.title}</span>`;

    // B. Set Info Lagu & Source
    artist.textContent = song.artist;
    audio.src = song.src;

    // C. Render Lirik Baru
    renderLyrics(song);
}

// Play & Pause Logic
function playSong() {
    audio.play();
}

function pauseSong() {
    audio.pause();
}

// Navigasi Lagu
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// --- 6. Fungsi Progress Bar ---

function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    if (secs < 10) secs = `0${secs}`;
    return `${minutes}:${secs}`;
}

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

// --- 7. Event Listeners ---

// Load lagu pertama saat web dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadSong(songs[songIndex]);
});

// Tombol Play/Pause
playButton.addEventListener('click', () => {
    const isPaused = audio.paused;
    if (isPaused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Tombol Prev/Next
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);

// Audio Events (Icon & Next Song)
audio.addEventListener('play', () => {
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
});

audio.addEventListener('pause', () => {
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
});

audio.addEventListener('ended', nextSong);

// GABUNGAN: Update Progress Bar DAN Sync Lirik
// Event ini berjalan berkali-kali setiap detik
audio.addEventListener('timeupdate', (e) => {
    updateProgressBar(e); // Jalankan progress bar
    syncLyrics();         // Jalankan sinkronisasi lirik
});

// Klik Progress Bar
progressContainer.addEventListener('click', setProgressBar);

// Metadata Loaded (Untuk Marquee Judul Panjang)
audio.addEventListener('loadedmetadata', () => {
    // Set total durasi text
    totalDurationEl.textContent = formatTime(audio.duration);

    // Cek Overflow Judul
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