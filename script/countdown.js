let minutes = 25;
let secondes = 0;
let intervalId = null;

const circle = document.querySelector('.progress-ring-circle');
const textMin = document.getElementById('countdown-minutes');
const textSec = document.getElementById('countdown-secondes');

const radius = 90;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;

function defaultCountdown() {
    minutes = 25;
    secondes = 0;
    updateDisplay();
    setProgress(1);
    clearInterval(intervalId);
}

function setProgress(progress) {
    const offset = circumference * (1 - progress);
    circle.style.strokeDashoffset = offset;
}

function updateDisplay() {
    textMin.textContent = String(minutes).padStart(2, '0');
    textSec.textContent = String(secondes).padStart(2, '0');
}

function startCountdown() {
    const totalInitialSeconds = minutes * 60 + secondes;
    let totalSecondsLeft = totalInitialSeconds;

    clearInterval(intervalId);

    intervalId = setInterval(() => {
        if (totalSecondsLeft <= 0) {
            clearInterval(intervalId);
            setProgress(0);
            return;
        }

        totalSecondsLeft--;

        minutes = Math.floor(totalSecondsLeft / 60);
        secondes = totalSecondsLeft % 60;

        updateDisplay();
        setProgress(totalSecondsLeft / totalInitialSeconds);
    }, 1000);
}


document.getElementById("stop").onclick = () => {
    clearInterval(intervalId);
};

document.getElementById("reset").onclick = () => {
    defaultCountdown();
};