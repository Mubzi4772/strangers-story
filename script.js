let story = localStorage.getItem("story");

if (!story) {
    story = "Once";
}

const storyElement = document.getElementById("story");
const wordInput = document.getElementById("wordInput");
const addButton = document.getElementById("addButton");
const message = document.getElementById("message");
const resetButton = document.getElementById("resetButton");

function showStory() {
    storyElement.innerText = story;
}

function addWord() {
    let word = wordInput.value.trim();

    if (word === "") {
        message.innerText = "Please enter a word.";
        return;
    }

    if (word.includes(" ")) {
        message.innerText = "Please enter only ONE word.";
        return;
    }

    story = story + " " + word;

    localStorage.setItem("story", story);

    showStory();

    wordInput.value = "";
    message.innerText = "Your word has been added to the story.";

    wordInput.focus();
}

addButton.addEventListener("click", addWord);

wordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addWord();
    }
});

resetButton.addEventListener("click", function() {
    story = "Once";

    localStorage.setItem("story", story);

    showStory();

    message.innerText = "A new story has started.";
});

showStory();
