
let story = localStorage.getItem("story") || "Once";

const storyDisplay = document.getElementById("story");
const form = document.getElementById("storyForm");
const wordInput = document.getElementById("wordInput");
const message = document.getElementById("message");
const suggestionsBox = document.getElementById("suggestions");
const shakeMessage = document.getElementById("shakeMessage");
const resetButton = document.getElementById("resetButton");

// Display the story
function showStory() {
  storyDisplay.textContent = story;
}

// Add one word to the story
function addWord(word) {
  word = word.trim();

  if (word === "") {
    message.textContent = "Please enter a word.";
    return;
  }

  if (/\s/.test(word)) {
    message.textContent = "Please add only ONE word.";
    return;
  }

  story += " " + word;
  localStorage.setItem("story", story);

  showStory();
  wordInput.value = "";
  message.textContent = "Your word was added!";
  suggestionsBox.innerHTML = "";
  shakeMessage.textContent = "Shake your phone for more ideas.";
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  addWord(wordInput.value);
});

// Large collection of story words
const wordBank = [
  "suddenly", "quietly", "stranger", "outside", "again",
  "forest", "basement", "street", "ocean", "school",
  "house", "station", "garden", "city", "room",
  "door", "key", "letter", "phone", "window",
  "mirror", "book", "box", "shadow", "picture",
  "friend", "child", "person", "animal", "ghost",
  "king", "queen", "teacher", "neighbor", "visitor",
  "ran", "walked", "looked", "opened", "closed",
  "followed", "waited", "whispered", "laughed", "cried",
  "jumped", "returned", "disappeared", "remembered", "forgot",
  "found", "lost", "heard", "saw", "called",
  "strange", "glowing", "broken", "tiny", "huge",
  "dark", "bright", "cold", "warm", "empty",
  "beautiful", "lonely", "hidden", "secret", "old",
  "new", "red", "blue", "golden", "silent",
  "yesterday", "tomorrow", "today", "somewhere", "nowhere",
  "never", "always", "maybe", "nobody", "everyone",
  "before", "after", "inside", "under", "above",
  "nearby", "faraway", "first", "last", "finally",
  "because", "although", "while", "until", "however",
  "dream", "night", "morning", "rain", "storm",
  "running", "waiting", "singing", "dancing", "falling",
  "magic", "mystery", "adventure", "memory", "secretly",
  "dangerous", "wonderful", "forgotten", "unexpected", "curious",
  "someone", "something", "everywhere", "now", "forever"
];

// Choose random words without repeating any in the same set
function getRandomWords(amount) {
  const shuffled = [...wordBank];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] =
      [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled.slice(0, amount);
}

// Show 8 random suggestions
function showSuggestions() {
  const words = getRandomWords(8);
  suggestionsBox.innerHTML = "";

  words.forEach(function(word) {
    const button = document.createElement("button");
    button.textContent = word;
    button.className = "suggestion";
    button.type = "button";

    button.addEventListener("click", function() {
      wordInput.value = word;
      wordInput.focus();
      message.textContent =
        "Word selected! Press ADD to add it to the story.";
    });

    suggestionsBox.appendChild(button);
  });

  shakeMessage.textContent =
    "Choose a word or shake again for different suggestions.";
}

// Detect when the phone is shaken
let lastShakeTime = 0;
let lastX = null;
let lastY = null;
let lastZ = null;

function handleMotion(event) {
  const acceleration = event.accelerationIncludingGravity;

  if (!acceleration) return;

  const x = acceleration.x || 0;
  const y = acceleration.y || 0;
  const z = acceleration.z || 0;

  if (lastX === null) {
    lastX = x;
    lastY = y;
    lastZ = z;
    return;
  }

  const movement =
    Math.abs(x - lastX) +
    Math.abs(y - lastY) +
    Math.abs(z - lastZ);

  lastX = x;
  lastY = y;
  lastZ = z;

  const now = Date.now();

  if (movement > 25 && now - lastShakeTime > 1000) {
    lastShakeTime = now;
    showSuggestions();
  }
}

// Start motion detection
async function startMotionDetection() {
  if (typeof DeviceMotionEvent === "undefined") {
    shakeMessage.textContent =
      "Motion detection is unavailable. You can still add words normally.";
    return;
  }

  if (typeof DeviceMotionEvent.requestPermission === "function") {
    try {
      const permission =
        await DeviceMotionEvent.requestPermission();

      if (permission !== "granted") {
        shakeMessage.textContent =
          "Allow motion access to use shake suggestions.";
        return;
      }
    } catch (error) {
      shakeMessage.textContent =
        "Could not enable motion access.";
      return;
    }
  }

  window.addEventListener("devicemotion", handleMotion);

  shakeMessage.textContent =
    "Ready! Shake your phone to get word suggestions.";
}

// Some phones require a tap before motion access can start
document.addEventListener("click", function startOnFirstTap() {
  startMotionDetection();
  document.removeEventListener("click", startOnFirstTap);
});

// Reset the story
resetButton.addEventListener("click", function() {
  story = "Once";
  localStorage.setItem("story", story);
  showStory();
  message.textContent = "The story has been reset.";
  suggestionsBox.innerHTML = "";
  shakeMessage.textContent = "Shake your phone for ideas.";
});

showStory();
