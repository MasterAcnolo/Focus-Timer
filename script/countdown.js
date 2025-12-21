let minutes = 0;
let secondes = 45;
let intervalId = null;
let isRunning = false;
let isPaused = false;
let lastInitialSeconds = 0;
let pausedSecondsLeft = null;

const circle = document.querySelector('.progress-ring-circle');
const textMin = document.getElementById('countdown-minutes');
const textSec = document.getElementById('countdown-secondes');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

const radius = 90;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = circumference;

// Formulaire de choix du temps
const form = document.getElementById('time-form');
const inputMin = document.getElementById('input-minutes');
const inputSec = document.getElementById('input-secondes');
if (form && inputMin && inputSec) {
    const submitBtn = document.getElementById('set-time');
    function setFormEnabled(enabled) {
        inputMin.disabled = !enabled;
        inputSec.disabled = !enabled;
        if (submitBtn) submitBtn.disabled = !enabled;
    }
    form.addEventListener('submit', function(e) {
        if (isRunning) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const min = parseInt(inputMin.value, 10) || 0;
        const sec = parseInt(inputSec.value, 10) || 0;
        minutes = Math.max(0, Math.min(99, min));
        secondes = Math.max(0, Math.min(59, sec));
        defaultCountdown();
    });
    // Initial state
    setFormEnabled(true);
    // Hook dans defaultCountdown et startCountdown pour activer/désactiver
    window.setFormEnabled = setFormEnabled;
//

function updateDisplay() {
    textMin.textContent = String(minutes).padStart(2, '0');
    textSec.textContent = String(secondes).padStart(2, '0');
}

function setProgress(progress) {
    const offset = circumference * (1 - progress);
    circle.style.strokeDashoffset = offset;
}

function defaultCountdown() {
    // minutes et secondes sont déjà définis par le formulaire ou par défaut
    updateDisplay();
    lastInitialSeconds = 0;
    setProgress(1);
    clearInterval(intervalId);
    isRunning = false;
    isPaused = false;
    pausedSecondsLeft = null;
    startBtn.disabled = false;
    startBtn.classList.remove('disabled');
    stopBtn.disabled = true;
    stopBtn.classList.add('disabled');
    if (window.setFormEnabled) window.setFormEnabled(true);
    startBtn.focus();
}
}

function startCountdown() {
    if (isRunning) return;
    let totalInitialSeconds = minutes * 60 + secondes;
    let totalSecondsLeft;
    if (isPaused && pausedSecondsLeft !== null) {
        totalSecondsLeft = pausedSecondsLeft;
        isPaused = false;
    } else {
        if (totalInitialSeconds <= 0) return;
        totalSecondsLeft = totalInitialSeconds;
        lastInitialSeconds = totalInitialSeconds;
    }
    if (!lastInitialSeconds) lastInitialSeconds = totalInitialSeconds;
    isRunning = true;
    startBtn.disabled = true;
    startBtn.classList.add('disabled');
    stopBtn.disabled = false;
    stopBtn.classList.remove('disabled');
    if (window.setFormEnabled) window.setFormEnabled(false);
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        if (totalSecondsLeft <= 0) {
            clearInterval(intervalId);
            setProgress(0);
            isRunning = false;
            startBtn.disabled = false;
            startBtn.classList.remove('disabled');
            stopBtn.disabled = true;
            stopBtn.classList.add('disabled');
            if (window.setFormEnabled) window.setFormEnabled(true);
            startBtn.focus();
            pausedSecondsLeft = null;
            lastInitialSeconds = 0;
            return;
        }
        totalSecondsLeft--;
        minutes = Math.floor(totalSecondsLeft / 60);
        secondes = totalSecondsLeft % 60;
        updateDisplay();
        setProgress(totalSecondsLeft / lastInitialSeconds);
        pausedSecondsLeft = totalSecondsLeft;
    }, 1000);
}

startBtn.onclick = startCountdown;
stopBtn.onclick = () => {
    if (!isRunning) return;
    clearInterval(intervalId);
    isRunning = false;
    isPaused = true;
    startBtn.disabled = false;
    startBtn.classList.remove('disabled');
    stopBtn.disabled = true;
    stopBtn.classList.add('disabled');
    if (window.setFormEnabled) window.setFormEnabled(true);
    startBtn.focus();
};
resetBtn.onclick = defaultCountdown;

// Accessibilité : focus visible
const allBtns = [startBtn, stopBtn, resetBtn];
allBtns.forEach(btn => {
    btn.addEventListener('keyup', e => {
        if (e.key === 'Tab') btn.classList.add('focus-visible');
    });
    btn.addEventListener('blur', () => btn.classList.remove('focus-visible'));
});

// Initialisation
defaultCountdown();