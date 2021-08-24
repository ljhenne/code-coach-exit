let timer;
browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    let backgroundConnection = browser.runtime.connect({name: `popup++${tabs[0].url}`});
    backgroundConnection.onMessage.addListener((response) => {
        console.log(response);
        timer = new easytimer.Timer({startValues: response.timeValues});
        timer.start();
        console.log(timer);
        setInterval(() => {
            document.getElementById("stopwatch").innerText = timer.getTimeValues().toString();
        }, 500);
    });
    console.log("Successfully connected!");
});
