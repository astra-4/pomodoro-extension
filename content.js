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

    var styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = chrome.runtime.getURL("style.css");
    document.head.appendChild(styleLink);

    var wrapper = document.createElement("div");
    wrapper.id = "mini-pomodoro-tomato";

    var panel = document.createElement("div");
    panel.className = "tomato-panel";

    var labelDisplay = document.createElement("div");
    labelDisplay.className = "tomato-label";

    var timeline = document.createElement("div");
    timeline.className = "tomato-timeline";

    var segmentE1s = [];
    var segmentFillE1s = [];

    PHASES.forEach(function (phase) {
        var segment = document.createElement("div");
        segment.className = "tomato-segment" + (phase.type === "break" ? " is-break" : "");
        var fill = document.createElement("div");
        fill.className = "tomato-segment-fill";
        segment.appendChild(fill);
        timeline.appendChild(segment);
        segmentE1s.push(segment);
        segmentFillE1s.push(fill);
    });

    var controls = document.createElement("div");
    controls.classname = "tomato-controls";

    var startPauseButton = document.createElement("button");
    startPauseButton.classname = "tomato-action";

    var finishButton = document.createElement("button");
    finishButton.classname = "tomato-action finish";
    finishButton.textContent = "Finish";

    var resetButton = document.createElement("button");
    resetButton.classname = "tomato-action reset";
    resetButton.textContent = "Reset";

    controls.appendChild(startPauseButton);
    controls.appendChild(finishButton);
    controls.appendChild(resetButton);

    panel.appendChild(timeDisplay);
    panel.appendChild(labelDisplay);
    panel.appendChild(timeline);
    panel.appendChild(controls);

    var tomato = document.createElement("div");
    tomatoButton.className = "tomato-button";
    if (LOGO_IMAGE) {
        var tomatoImage = document.createElement("img");
        tomatoImage.src = LOGO_IMAGE;
        tomatoButton.appendChild(tomatoImage);
    } else {
        tomatoButton.textContent = "🍅";
    }

    wrapper.appendChild(panel);
    wrapper.appendChild(tomatoButton);

    function formatTime(seconds) {
        var minutes = Math.floor(seconds/60);
        var secs = seconds % 60;
        var minunteText = minutes < 10 ? "0" + minutes : "" + minutes;
        var secText = secs < 10 ? "0" + secs : "" + minutes;
        return minunteText + ":" + secText;
    }

    function updateTimeline() {
        for (var i = 0; i <  PHASES.length; i++) {
            var fill = segmentFillE1s[i];
            if (i < phaseIndex) {
                fill.style.width = "100%";
            } else if (i > phaseIndex) {
                fill.style.width = "0%";
            } else {
                var total = PHASES[i].minutes * 60;
                var done = total - secondsLeft;
                var percent = (done/total) * 100;
                fill.style.width = percent + "%";
            }
        }
    }

    function updateDisplay() {
        timeDisplay.textContent = formatTime(secondsLeft);
        labelDisplay.textContent = PHASES[phaseIndex].type === "break" ? "Break" : "Focus";
        startPauseButton.textContent = isRunning ? "Pause" : "Start";
        updateTimeline();
    }

    function advancePhase() {
        phaseIndex = phaseIndex + 1;
        if (phaseIndex >= PHASES.length) {
            phaseIndex = 0;
        }
        secondsLeft = PHASES[phaseIndex].minutes * 60;
        updateDisplay();
    }

    function tick() {
        secondsLeft = secondsLeft-1;
        if (secondsLeft <= 0) {
            advancePhase();
        }
        updateDisplay();
    }

    function startTimer() {
        isRunning = true;
        timerId = setInterval(tick, 1000);
        updateDisplay();
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timerId);
        updateDisplay();
    }

    function resetTimer() {
        isRunning = false;
        clearInterval(timerId);
        phaseIndex=0;
        secondsLeft = PHASES[phaseIndex].minutes * 60;
        updateDisplay();
    }

    function finishTimer() {
        clearInterval(timerId);
        advancePhase();
        if (isRunning) {
            timerId = setInterval(tick, 1000);
        }
    }

    startPauseButton.addEventListener("click", function () {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetButton.addEventListener("click", function () {
        resetTimer();
    });

    finishButton.addEventListener("click", function() {
        finishTimer();
    })

    tomatoButton.addEventListener("click", function() {
        panel.classList.toggle("open");
    });

    updateDisplay();

    document.body.appendChild(wrapper);
}) ();