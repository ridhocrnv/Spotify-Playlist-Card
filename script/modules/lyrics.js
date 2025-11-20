// script/modules/lyrics.js

// Fungsi Helper: Ambil elemen list (Safe Mode)
function getLyricsListElement() {
    return document.getElementById('lyrics-list');
}

// Fungsi: Render Lirik ke HTML
export function renderLyrics(song) {
    const lyricsList = getLyricsListElement();
    const lyricsContainer = document.querySelector('.lyrics-container');
    
    // Safety check: Kalau elemen belum ada di HTML, berhenti.
    if (!lyricsList || !lyricsContainer) return;

    lyricsList.innerHTML = ""; // Bersihkan lirik lama

    if (song.lyrics && song.lyrics.length > 0) {
        lyricsContainer.classList.remove('empty-state');
        song.lyrics.forEach((line, index) => {
            const li = document.createElement('li');
            li.innerText = line.text;
            li.dataset.time = line.time; 
            li.id = `line-${index}`;     
            lyricsList.appendChild(li);
        });
    } else {
        lyricsContainer.classList.add('empty-state');
        lyricsList.innerHTML = `
            <li style="font-size: 1.2rem; margin-bottom: 5px;">🎵</li>
            <li>Lirik belum tersedia</li>
            <li style="font-size: 0.8rem; font-weight: 400;">Just enjoy the vibe ❤️</li>
        `;
    }
}

// Fungsi: Sinkronisasi Lirik
// PENTING: Fungsi ini menerima data waktu & array lirik dari luar (main.js)
export function syncLyrics(currentTime, lyrics) {
    const lyricsList = getLyricsListElement();
    
    // Safety check
    if (!lyricsList || !lyrics || lyrics.length === 0) return;

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

    // Update UI
    if (activeIndex !== -1) {
        const activeLi = document.getElementById(`line-${activeIndex}`);
        
        // Optimasi: Hanya update jika class belum ada
        if (activeLi && !activeLi.classList.contains('active')) {
            const allLis = lyricsList.querySelectorAll('li');
            allLis.forEach(li => li.classList.remove('active'));
            
            activeLi.classList.add('active');

            activeLi.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}