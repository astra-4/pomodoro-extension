(function () {
    if (document.getElementById("mini-pomodoro-tomato")) {
        return;
    }

    var PHASES = [
        {type: "work", minutes:25},
        {type: "break", minutes:5},
        {type: "work", minutes:25},
        {type: "break", minutes:5},
        {type: "work", minutes:25},
        {type: "break", minutes:5},
        {type: "work", minutes:25},
        {type: "break", minutes:15}
    ];

    var LOGO_IMAGE = "https://ibb.co/5W8jPJpt";

    var phaseIndex = 0;
    var secondsLeft = PHASES[phaseIndex].minutes * 60;
    var isRunning = false;
    var timerId = null;

    var frontLink = document.createElement("link");
    frontLink.rel = "stylesheet";
    frontLink.href= "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    document.head.appendChild(frontLink);
})