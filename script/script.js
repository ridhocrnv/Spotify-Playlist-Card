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

// --- 2. Data Playlist ---

const songs = [
    {
        title: 'Aku dan Dirimu (feat. Ari Lasso)',
        artist: 'Bunga Citra Lestari, Ari Lasso',
        src: 'src/aku-dan-dirimu.mp3'
    },
    {
        title: 'Til Death Do Us Part',
        artist: 'White Lion',
        src: 'src/til-death-do-us-part.mp3'
    },
    {
        title: "You're All I Need",
        artist: 'White Lion',
        src: 'src/youre-all-i-need.mp3'
    },
    {
        title: "I Live My Life for You",
        artist: 'Firehouse',
        src: 'src/i-live-my-life-for-you.mp3'
    },
    {
        title: "When I Look Into Your Eyes",
        artist: 'Firehouse',
        src: 'src/when-i-look-into-your-eyes.mp3'
    },
    {
        title: "I'll Be There For You",
        artist: 'Bon Jovi',
        src: 'src/ill-be-there-for-you.mp3'
    },
    {
        title: "Making Love Out of Nothing at All",
        artist: 'Air Supply',
        src: 'src/making-love-air-supply.mp3'
    },
    {
        title: "If I Had A Gun",
        artist: "Noel Gallagher's High Flying Birds",
        src: 'src/if-i-had-a-gun.mp3'
    },
    {
        title: "You and I (cover. Dimas Senopati) Acoustic",
        artist: "Scorpions",
        src: 'src/you-and-i.mp3'
    },
    {
        title: "Gunslinger",
        artist: "Avenged Sevenfold",
        src: 'src/gunslinger.mp3'
    }
    // ... tambahkan lagu lain di sini
];

// --- 3. State Player ---
// Lacak lagu mana yang sedang diputar
let songIndex = 0;

// --- 4. Fungsi Inti Player ---

// Fungsi untuk memuat lagu berdasarkan indeks
function loadSong(song) {
    // 1. Selalu reset class dan alignment
    title.classList.remove('is-overflowing');
    title.style.textAlign = 'center'; // Kembalikan ke default

    // 2. Set judul TUNGGAL (single title)
    // Pengecekan Marquee akan dilakukan di event 'loadedmetadata'
    title.innerHTML = `<span>${song.title}</span>`;

    // 3. Set info lain
    artist.textContent = song.artist;
    audio.src = song.src;
}


// Fungsi untuk memutar lagu
function playSong() {
    audio.play();
    // Ikon akan diubah oleh event listener 'play'
}

// Fungsi untuk menjeda lagu
function pauseSong() {
    audio.pause();
    // Ikon akan diubah oleh event listener 'pause'
}

// Fungsi untuk ke lagu sebelumnya
function prevSong() {
    songIndex--; // Mundur satu lagu

    // Jika ini adalah lagu pertama, putar ke lagu terakhir
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }

    loadSong(songs[songIndex]);
    playSong();
}

// Fungsi untuk ke lagu berikutnya
function nextSong() {
    songIndex++; // Maju satu lagu

    // Jika ini adalah lagu terakhir, putar ke lagu pertama
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }

    loadSong(songs[songIndex]);
    playSong();
}

// --- 5. Fungsi Progress Bar & Waktu ---

// Fungsi untuk memformat waktu (detik ke format 0:00)
function formatTime(seconds) {
    // Bulatkan ke bawah
    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;

    // Tambahkan '0' di depan jika detik < 10
    if (secs < 10) {
        secs = `0${secs}`;
    }

    return `${minutes}:${secs}`;
}

// Fungsi untuk memperbarui progress bar saat lagu diputar
function updateProgressBar(e) {
    // 'e.srcElement' adalah elemen <audio>
    const { duration, currentTime } = e.srcElement;

    // Hanya update jika durasi valid
    if (duration) {
        // Hitung persentase progres
        const progressPercent = (currentTime / duration) * 100;

        // Terapkan ke lebar CSS
        progressBar.style.width = `${progressPercent}%`;

        // Update teks timestamp
        currentTimeEl.textContent = formatTime(currentTime);
    }
}

// Fungsi untuk "seeking" (melompat) saat bar di-klik
function setProgressBar(e) {
    // 'this' mengacu pada 'progressContainer'
    const width = this.clientWidth;

    // 'e.offsetX' adalah posisi X klik di dalam elemen
    const clickX = e.offsetX;

    const duration = audio.duration;

    // Set waktu audio berdasarkan posisi klik
    audio.currentTime = (clickX / width) * duration;
}


// --- 6. Event Listeners ---

// Muat lagu pertama saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadSong(songs[songIndex]);
});

// Event listener untuk tombol Play/Pause
playButton.addEventListener('click', () => {
    const isPaused = audio.paused;
    if (isPaused) {
        playSong();
    } else {
        pauseSong();
    }
});

// Event listener untuk tombol Next dan Prev
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);

// --- Event Listeners untuk Audio Player ---

// Update ikon saat audio diputar
audio.addEventListener('play', () => {
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
});

// Update ikon saat audio dijeda
audio.addEventListener('pause', () => {
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
});

// Otomatis putar lagu berikutnya ketika lagu selesai
audio.addEventListener('ended', nextSong);

// Update durasi DAN cek marquee saat metadata dimuat
audio.addEventListener('loadedmetadata', () => {
    // 1. Fungsi lama: Set total durasi
    totalDurationEl.textContent = formatTime(audio.duration);

    // 2. FUNGSI BARU: Cek overflow judul di sini
    const titleSpan = title.querySelector('span');

    // Cek jika elemen span ada (untuk keamanan)
    if (titleSpan) {
        // Ambil ukuran yang akurat
        const containerWidth = title.clientWidth;
        const textWidth = titleSpan.scrollWidth;

        // Tentukan apakah teksnya meluap (overflowing)
        const isOverflowing = textWidth > containerWidth;

        if (isOverflowing) {
            // JIKA YA (Judulnya panjang):
            // Gandakan teksnya dan tambahkan class untuk animasi
            const marqueeText = `${songs[songIndex].title} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${songs[songIndex].title} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
            titleSpan.innerHTML = marqueeText;
            title.classList.add('is-overflowing');
        } else {
            // JIKA TIDAK (Judulnya pendek):
            // Pusatkan teksnya
            title.style.textAlign = 'center';
        }
    }
});


// Update progress bar saat lagu sedang diputar
audio.addEventListener('timeupdate', updateProgressBar);

// Izinkan "seeking" saat progress bar di-klik
progressContainer.addEventListener('click', setProgressBar);