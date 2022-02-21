let backgroundConnection;
let timer;

function formatTitle(title) {
   if (title.includes("LeetCode")) {
       let titleParts = title.split(" ");
       return titleParts.slice(0, titleParts.length - 2).join(" ");
   }
}

browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    let questionUrl = tabs[0].url;
    let questionTitle = formatTitle(tabs[0].title);
    backgroundConnection = browser.runtime.connect({name: `popup++${questionUrl}`});
    document.getElementById("question-title").innerText = questionTitle;

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
    if (playPauseElement.innerHTML === "<i class=\"fas fa-play\"></i>") {
        playPauseElement.innerHTML = "<i class=\"fas fa-pause\"></i>";
        backgroundConnection.postMessage({event: "play"});
    } else {
        playPauseElement.innerHTML = "<i class=\"fas fa-play\"></i>";
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
