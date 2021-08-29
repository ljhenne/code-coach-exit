console.log("Background script initiated...");
let ports = [];
let timers = {};

browser.runtime.onConnect.addListener((port) => {
    let url = port.name.replace(/^content\+\+|popup\+\+/g, "");
    console.log(`URL: ${url}`);
    ports[port.name] = port;
    if (port.name.includes("content++")) {
        console.log("Got a message from a content script");
        console.log(`Stored connection for ${port.name}`);
        port.onMessage.addListener((message) => {
            if (message.event === "pageLoad") {
                console.log(`Starting timer at ${Date.now()}`);
                timers[url] = new easytimer.Timer();
                timers[url].start()
                console.log(`Time elapsed: ${timers[url].getTimeValues().toString()}`)
            }
        });
    } else {  // port.name.includes("popup++")
        console.log("Got a message from a popup");
        console.log(`Stored connection for ${port.name}`);
        port.onMessage.addListener((message) => {
            if (message.event === "popupOpened") {
                console.log("Popup was opened");
                port.postMessage({timeValues: timers[url].getTimeValues(), startIt: true});
            } else if (message.event === "pause") {
                console.log("Pausing the timer");
                timers[url].pause();
                port.postMessage({timeValues: timers[url].getTimeValues(), startIt: false});
            } else if (message.event === "play") {
                timers[url].start();
                console.log("Playing the timer");
                port.postMessage({timeValues: timers[url].getTimeValues(), startIt: true});
            } else if (message.event === "stop") {
                timers[url].stop();
                console.log("Stopping the timer");
                port.postMessage({timeValues: timers[url].getTimeValues(), startIt: false});
            } else if (message.event === "reset") {
                timers[url].reset();
                console.log("Resetting the timer");
                port.postMessage({timeValues: timers[url].getTimeValues(), startIt: true});
            }
        })
    }
});
