const user = "Logan";
console.log("Code coach");

function formatQuestion(questionText) {
    let questionParts = questionText.split(" ");

    // regex from https://stackoverflow.com/questions/26156292/trim-specific-character-from-a-string
    let number = questionParts[0].replace(/\.+$/g, "");
    questionParts.forEach((value, i, array) => array[i] = value.toLowerCase());
    let title = questionParts.slice(1).join("-");
    let url = window.location.href;

    return {url, number, title}
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
        backgroundConnection.postMessage(
            {event: "pageLoad", questionName: question.title, questionUrl: question.url, user}
        );
    }
}

waitForQuestionTitle();

// Here need to implement listeners for test, success, fail, and abandon
