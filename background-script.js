console.log("Background script initiated...");
let ports = [];
let timers = {};
const host = "http://127.0.0.1:8000";

function leftPad(num, width) {
    let tmpNum = "0" + num;
    return tmpNum.substr(tmpNum.length - (width - 1))
}

function formatDate(date) {
    let year = date.getUTCFullYear();
    let month = leftPad(date.getUTCMonth(), 2);
    let day = leftPad(date.getUTCDay(), 2);
    let hour = leftPad(date.getUTCHours(), 2);
    let minute = leftPad(date.getUTCMinutes(), 2);
    let second = leftPad(date.getUTCSeconds(), 2);
    let ms = leftPad(date.getUTCMilliseconds(), 3);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${ms}`
}

function submitEvent(event) {
    axios({
        method: "post",
        url: `${host}/attempt-events/`,
        data: {
            eventType: event.type,
            questionName: event.questionName,
            questionUrl: event.questionUrl,
            timestamp: formatDate(new Date()),
            user: "Logan"
        }
    }).then((response) => console.log(response));
}

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
                timers[url].start();
                console.log(`Time elapsed: ${timers[url].getTimeValues().toString()}`);
                submitEvent({
                    questionName: message.questionName,
                    questionUrl: message.questionUrl,
                    type: "start",
                    user: message.user
                });
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
