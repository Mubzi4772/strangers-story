let story = localStorage.getItem("story");

if (!story) {
  story = "Once";
}

const storyDisplay = document.getElementById("story");
const form = document.getElementById("storyForm");
const wordInput = document.getElementById("wordInput");
const message = document.getElementById("message");
const suggestionsBox = document.getElementById("suggestions");
const shakeMessage = document.getElementById("shakeMessage");
const resetButton = document.getElementById("resetButton");

function showStory() {
  storyDisplay.textContent = story;
}

function addWord(word) {
  word = word.trim();

  if (word === "") {
    message.textContent = "Please enter a word.";
    return;
  }

  if (word.includes(" ")) {
    message.textContent = "Please add only ONE word.";
    return;
  }

  story += " " + word;
  localStorage.setItem("story", story);

  showStory();
  wordInput.value = "";
  message.textContent = "Your word was added!";
  suggestionsBox.innerHTML = "";
  shakeMessage.textContent = "Shake your phone to get more ideas.";
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  addWord(wordInput.value);
});

function showSuggestions() {
  const words = [
    "suddenly",
    "quietly",
    "stranger",
    "outside",
    "again"
  ];

  suggestionsBox.innerHTML = "";

  words.forEach(function(word) {
    const button = document.createElement("button");
    button.textContent = word;
    button.className = "suggestion";
    button.type = "button";

    button.addEventListener("click", function() {
      wordInput.value = word;
      wordInput.focus();
      message.textContent = "Suggestion selected. Press ADD to use it.";
    });

    suggestionsBox.appendChild(button);
  });

  shakeMessage.textContent = "Pick a word, or shake again for more ideas.";
}

let lastShakeTime = 0;
let lastX = null;
let lastY = null;
let lastZ = null;

function handleMotion(event) {
  const acceleration = event.accelerationIncludingGravity;

  if (!acceleration) {
    return;
  }

  const x = acceleration.x || 0;
  const y = acceleration.y || 0;
  const z = acceleration.z || 0;

  if (lastX === null) {
    lastX = x;
    lastY = y;
    lastZ = z;
    return;
  }

  const difference =
    Math.abs(x - lastX) +
    Math.abs(y - lastY) +
    Math.abs(z - lastZ);

  lastX = x;
  lastY = y;
  lastZ = z;

  const now = Date.now();

  if (difference > 25 && now - lastShakeTime > 1000) {
    lastShakeTime = now;
    showSuggestions();
  }
}

async function startMotionDetection() {
  if (typeof DeviceMotionEvent === "undefined") {
    shakeMessage.textContent =
      "Phone motion is not available on this device. You can still use the story normally.";
    return;
  }

  if (typeof DeviceMotionEvent.requestPermission === "function") {
    try {
      const permission = await DeviceMotionEvent.requestPermission();

      if (permission !== "granted") {
        shakeMessage.textContent =
          "Motion permission was not given. Allow it to use shake suggestions.";
        return;
      }
    } catch (error) {
      shakeMessage.textContent =
        "Motion permission could not be enabled.";
      return;
    }
  }

  window.addEventListener("devicemotion", handleMotion);

  shakeMessage.textContent =
    "Motion is ready. Shake your phone for suggestions.";
}

document.addEventListener("click", function startOnFirstTap() {
  startMotionDetection();
  document.removeEventListener("click", startOnFirstTap);
});

resetButton.addEventListener("click", function() {
  story = "Once";
  localStorage.setItem("story", story);
  showStory();
  message.textContent = "The story has been reset.";
  suggestionsBox.innerHTML = "";
  shakeMessage.textContent = "Shake your phone to get ideas.";
});

showStory();
