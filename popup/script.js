let backgroundConnection;
let timer;

browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    backgroundConnection = browser.runtime.connect({name: `popup++${tabs[0].url}`});
    backgroundConnection.onMessage.addListener((response) => {
        console.log(response);
        timer = new easytimer.Timer({startValues: response.timeValues});

        if (response.startIt) {
            timer.start();
            setInterval(() => {
                document.getElementById("stopwatch").innerText = timer.getTimeValues().toString();
            }, 500);
        }
    });
    backgroundConnection.postMessage({event: "popupOpened"});
    console.log("Successfully connected!");
});

let playPauseElement = document.getElementById("play-pause");
playPauseElement.addEventListener("click", (ev) => {
    if (playPauseElement.innerText === "Play") {
        playPauseElement.innerText = "Pause";
        backgroundConnection.postMessage({event: "play"});
    } else {
        playPauseElement.innerText = "Play";
        backgroundConnection.postMessage({event: "pause"});
    }
});

let resetElement = document.getElementById("reset");
resetElement.addEventListener("click", (ev) => {
    backgroundConnection.postMessage({event: "reset"});
});

let stopElement = document.getElementById("stop");
stopElement.addEventListener("click", (ev) => {
    playPauseElement.innerText = "Play";
    backgroundConnection.postMessage({event: "stop"});
});
