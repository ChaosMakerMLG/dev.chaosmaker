async function getFsJson() {
  const response = await fetch("/script/terminal/fs.json");
  const data = await response.json();
  return data;
}

const maxLength = 24;
let data = await getFsJson();
const bash = new bashModule.Bash({ fs: data });
bash.updateCurrentPath();
const hiddenInput = document.getElementById("hiddenInput");
let typingTimeout;
let typewriterIndex = 0;
export var isPlaying = false;
let historyIndex = -1;
let charIndex = 1;
let tempHistory = "";
export var haltCommand = false;
let eventFired = false;

function isMobileByUA() {
  return /Mobi|Kindle|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (!isMobileByUA) {
  document.querySelector(".pointer-wrapper").addEventListener("click", () => {
    hiddenInput.focus();
  });
}

addEventListener("keydown", inputHandler);
if (isMobileByUA) {
  document
    .getElementById("hiddenInput")
    .addEventListener("beforeinput", inputHandler);
}

function inputHandler(event) {
  if (isPlaying || isLoading) return;

  clearTimeout(typingTimeout);
  const string = document.getElementById("command-string");
  let charAdded = false;

  if (string.innerText.length >= maxLength) FadeOutText(string);

  let key = null;
  key = event.type === "beforeinput" ? event.data : event.key;

  switch (key) {
    case "Enter": {
      bash.runCommand(string.innerText);
      string.replaceChildren();
      tempHistory = "";
      charIndex = 1;
      document.querySelector(".cursor").id = "on-pointer";
      break;
    }
    case "Backspace":
      if (string.innerText === "") break;
      if (!string.children[string.children.length - charIndex]) break;
      string.removeChild(string.children[string.children.length - charIndex]);
      charAdded = true;
      break;
    case " ":
      if (!event.repeat && string.innerText.length < maxLength) {
        RenderString(" ", false, string);
        charAdded = true;
      }
      break;
    case "ArrowRight":
      if (string.innerText.length === 0 || charIndex === 1) break;
      MovePointer("move", "bck", "0");
      break;
    case "ArrowLeft":
      if (
        string.innerText.length === 0 ||
        charIndex === string.innerText.length + 1
      )
        break;
      MovePointer("move", "fwd", "0");
      break;
    case "ArrowUp":
      if (historyIndex < bash.history.length && bash.history[historyIndex + 1])
        historyIndex++;
      if (
        string.innerText.length > 0 &&
        !bash.history.includes(string.innerText)
      )
        tempHistory = string.innerText;
      bash.history[historyIndex]
        ? RenderString(bash.history[historyIndex], true, string)
        : "";
      charAdded = true;
      break;
    case "ArrowDown":
      if (historyIndex === -1) return;
      historyIndex--;
      bash.history[historyIndex]
        ? RenderString(bash.history[historyIndex], true, string)
        : tempHistory
        ? RenderString(tempHistory, true, string)
        : string.replaceChildren();
      charAdded = true;
      break;
    default:
      if (
        !event.repeat &&
        key.length === 1 &&
        string.innerText.length < maxLength
      ) {
        RenderString(key, false, string);
        charAdded = true;
      }
      break;
  }
  hiddenInput.value = "";
  if (charAdded || string.innerText !== "") {
    typingTimeout = setTimeout(() => {
      if (string.innerText !== "") {
        charIndex = 1;
        tempHistory = "";
        FadeOutText(string);
      }
    }, 10000);
  }
}

function TerminalReboot() {
  OutroAnimation();
  setTimeout(() => {
    bash.clearTerminal();
    document.getElementById("command-string").replaceChildren();
    IntroTerminal();
    isPlaying = false;
  }, 2000);
}

function TerminalShake(variant) {
  isPlaying = true;
  switch (variant) {
    case "red":
      TerminalReboot();
      break;
    default:
      document
        .querySelector(".terminal-window")
        .addEventListener("animationend", () => {
          document.querySelector(".terminal-window").style.animation = "";
        });
      document.querySelector(".terminal-window").style.animation =
        "shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
      isPlaying = false;
      break;
  }
}

async function UseCommand(command) {
  isPlaying = true;

  for (let i = 0; i < command.length; i++) {
    if (haltCommand) break;
    RenderString(command[i], false, document.getElementById("command-string"));
    await new Promise((r) => setTimeout(r, 50));
  }

  isPlaying = false;
  if (!haltCommand)
    dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
}

async function AnimatedRenderString(string, element) {
  isPlaying = true;

  for (let i = 0; i < string.length; i++) {
    RenderString(string[i], false, element);
    await new Promise((r) => setTimeout(r, 50));
  }

  isPlaying = false;
}

function MovePointer(option, direction, n) {
  const arr = Array.from(
    document.querySelector(".pointer-wrapper").children
  ).filter((elem) => elem.className === "cursor");
  const chars = Array.from(
    document.getElementById("command-string").children
  ).concat(arr);
  if (option === "move") {
    if (direction === "fwd") {
      if (charIndex === chars.length) return;
      charIndex++;
      chars[chars.length - charIndex].id = "on-pointer";
      chars[chars.length - (charIndex - 1)].id = "";
    }
    if (direction === "bck") {
      if (charIndex === -1) return;
      charIndex--;
      chars[chars.length - charIndex].id = "on-pointer";
      chars[chars.length - (charIndex + 1)].id = "";
    }
  } else if (option === "set") {
    document.getElementById("on-pointer").id = "";
    chars[chars.length - (n + 1)].id = "on-pointer";
    charIndex = n;
  }
  console.log(charIndex);
}

function RenderString(string, replace, element) {
  if (replace) element.replaceChildren();

  for (let i = 0; i < string.length; i++) {
    char = string[i];
    const span = document.createElement("span");
    span.innerText = char;
    span.classList.add("letter");
    element.insertBefore(
      span,
      element.children[element.children.length - (charIndex - 1)]
    );

    span.addEventListener("transitionend", () => {
      span.classList.add("done");
    });
  }
}

function FadeOutText(elem) {
  isPlaying = true;
  const text = elem.innerText;
  if (!text) return;

  elem.innerHTML = "";
  [...text].forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("letter");
    elem.appendChild(span);

    span.addEventListener("transitionend", () => {
      span.classList.add("done");
    });
  });

  const letters = elem.querySelectorAll(".letter");

  letters.forEach((span, i) => {
    const delay = (letters.length - i) * 100;
    setTimeout(() => {
      span.classList.add("fade-out");
    }, delay);
  });

  const totalDuration = letters.length * 100 + 500;
  setTimeout(() => {
    elem.innerHTML = "";
    isPlaying = false;
  }, totalDuration);
}
