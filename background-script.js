console.log("Background script initiated...");
let ports = [];
let timers = {};

browser.runtime.onConnect.addListener((port) => {
    ports[port.name] = port;
    if (port.name.includes("content++")) {
        console.log(`Stored connection for ${port.name}`);
        port.onMessage.addListener((message) => {
            if (message.event === "pageLoad") {
                console.log(`Starting timer at ${Date.now()}`);
                timers[port.name] = new easytimer.Timer();
                timers[port.name].start()
                console.log(`Time elapsed: ${timers[port.name].getTimeValues().toString()}`)
            }
        });
    } else {  // port.name.includes("popup++")
        console.log("Got a message from the popup")
        port.postMessage({timeValues: timers["content++https://leetcode.com/problems/longest-palindromic-substring/"].getTimeValues()});

    }

});



// background-script.js

// let ports = []
//
// function connected(p) {
//     ports[p.sender.tab.id] = p
//     //...
// }
//
// browser.runtime.onConnect.addListener(connected)
//
// browser.browserAction.onClicked.addListener(function() {
//     ports.forEach( p => {
//         p.postMessage({greeting: "they clicked the button!"})
//     })
// });

// background-script.js
//
// let portFromCS;
//
// function connected(p) {
//     portFromCS = p;
//     portFromCS.postMessage({greeting: "hi there content script!"});
//     portFromCS.onMessage.addListener(function(m) {
//         portFromCS.postMessage({greeting: "In background script, received message from content script:" + m.greeting});
//     });
// }
//
// browser.runtime.onConnect.addListener(connected);
//
// browser.browserAction.onClicked.addListener(function() {
//     portFromCS.postMessage({greeting: "they clicked the button!"});
// });
