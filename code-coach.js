console.log("Code coach");

function formatQuestion(questionText) {
    let questionParts = questionText.split(" ");

    // regex from https://stackoverflow.com/questions/26156292/trim-specific-character-from-a-string
    let questionNo = questionParts[0].replace(/\.+$/g, "");
    questionParts.forEach((value, i, array) => array[i] = value.toLowerCase());
    let questionTitle = questionParts.slice(1).join("-");
    let url = window.location.href;

    return {url, questionNo, questionTitle}
}

function waitForQuestionTitle() {
    let questionTitleElements = document.querySelectorAll("[data-cy='question-title']");
    if (questionTitleElements.length < 1) {
        window.requestAnimationFrame(waitForQuestionTitle);
    } else {
        let questionText = questionTitleElements[0].textContent
        console.log(questionText);
        let question = formatQuestion(questionText)
        console.log(question);
        let backgroundConnection = browser.runtime.connect({name: `content++${question.url}`});
        backgroundConnection.postMessage({event: "pageLoad"});
    }
}

waitForQuestionTitle();
