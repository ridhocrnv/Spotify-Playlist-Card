export function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    if (secs < 10) secs = `0${secs}`;
    return `${minutes}:${secs}`;
}