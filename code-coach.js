console.log("Code coach")

function waitForQuestionTitle() {
    let questionTitleElements = document.querySelectorAll("[data-cy='question-title']");
    if (questionTitleElements.length < 1) {
        window.requestAnimationFrame(waitForQuestionTitle);
    } else {
        console.log(questionTitleElements[0].textContent);
    }
}

waitForQuestionTitle();
