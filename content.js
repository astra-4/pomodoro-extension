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

    var LOGO_IMAGE = "https://i.ibb.co/B5ZZtyss/Screenshot-2026-07-25-at-17-19-17-removebg-preview.png";

    var BASE_PANEL_WIDTH = 190;
    var BASE_PANEL_FONT_SIZE = 10;

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

    var timeDisplay = document.createElement("div");
    timeDisplay.className = "tomato-time";

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
    controls.className = "tomato-controls";

    var startPauseButton = document.createElement("button");
    startPauseButton.className = "tomato-action";

    var finishButton = document.createElement("button");
    finishButton.className = "tomato-action finish";
    finishButton.textContent = "Finish";

    var resetButton = document.createElement("button");
    resetButton.className = "tomato-action reset";
    resetButton.textContent = "Reset";

    controls.appendChild(startPauseButton);
    controls.appendChild(finishButton);
    controls.appendChild(resetButton);

    panel.appendChild(timeDisplay);
    panel.appendChild(labelDisplay);
    panel.appendChild(timeline);
    panel.appendChild(controls);

    var resizeHandle = document.createElement("div");
    resizeHandle.className = "tomato-resize-handle";
    panel.appendChild(resizeHandle);

    var tomatoButton = document.createElement("div");
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
        var secText = secs < 10 ? "0" + secs : "" + secs;
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
        if (secondsLeft >=360 && secondsLeft <= 419) {
            showEasterEgg();
        }
    }

    function showEasterEgg() {
        var egg = document.createElement("img");
        egg.src = "https://media1.tenor.com/m/6COMq6z3l5oAAAAd/bosnov-67.gif"
        egg.className = "tomato-egg";
        document.body.appendChild(egg);
        setTimeout(function() {
            egg.remove();
        }, 3000);
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

    var isDragging = false;
    var hasDragged = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var wrapperStartLeft = 0;
    var wrapperStartTop = 0;

    tomatoButton.addEventListener("mousedown", function (event) {
        isDragging = true;
        hasDragged = false;
        var rect = wrapper.getBoundingClientRect();
        wrapper.style.left = rect.left + "px";
        wrapper.style.top = rect.top + "px";
        wrapper.style.right = "auto";
        wrapper.style.bottom = "auto";
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        wrapperStartLeft = rect.left;
        wrapperStartTop = rect.top;
        event.preventDefault();
    });

    document.addEventListener("mousemove", function (event) {
        if (!isDragging) {
            return;
        }
        var deltaX = event.clientX - dragStartX;
        var deltaY = event.clientY - dragStartY;
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            hasDragged = true;
        }
        wrapper.style.left = (wrapperStartLeft + deltaX) + "px";
        wrapper.style.top = (wrapperStartTop + deltaY) +  "px";
    });

    document.addEventListener("mouseup", function() {
        isDragging = false;
    });

    tomatoButton.addEventListener("click", function() {
        if (hasDragged) {
            return;
        }
        panel.classList.toggle("open");
    });

    //resizer
    var isResizing = false;
    var resizeStartX = 0;
    var resizeStartY = 0;
    var resizeStartWidth = 0;
    var resizeStartHeight = 0;

    resizeHandle.addEventListener("mousedown", function (event) {
        isResizing = true;
        var rect = panel.getBoundingClientRect();
        resizeStartX = event.clientX;
        resizeStartY = event.clientY;
        resizeStartWidth = rect.width;
        resizeStartHeight = rect.height;
        panel.style.height = rect.height + "px";
        event.preventDefault();
        event.stopPropagation();
    });

    document.addEventListener("mousemove", function (event) {
        if (!isResizing) {
            return;
        }
        var deltaX = resizeStartX - event.clientX;
        var deltaY = resizeStartY - event.clientY;
        var newWidth = resizeStartWidth + deltaX;
        var newHeight = resizeStartHeight + deltaY;
        if (newWidth < 140) {
            newWidth = 140;
        }
        if (newHeight< 100) {
            newHeight = 100;
        }
        panel.style.width = newWidth + "px";
        panel.style.height = newHeight + "px";
        panel.style.fontSize = (BASE_PANEL_FONT_SIZE * (newWidth/BASE_PANEL_WIDTH)) + "px";
    });

    document.addEventListener("mouseup", function() {
        isResizing = false;
    });

    updateDisplay();
    

    document.body.appendChild(wrapper);
}) ();