
const display = document.getElementById("textInput");
const statusMessage = document.getElementById("status");
const keys = document.querySelectorAll(".key");
const clearButton = document.getElementById("clearText");
const copyButton = document.getElementById("copyText");

let capsLock = false;
let shiftActive = false;

function showStatus(message) {
  statusMessage.textContent = message;
}

function insertText(text) {
  const start = display.selectionStart;
  const end = display.selectionEnd;

  display.setRangeText(text, start, end, "end");
  display.focus();
}

function getCharacter(keyName) {
  const shiftedSymbols = {
    "1": "!",
    "2": "@",
    "3": "#",
    "4": "$",
    "5": "%",
    "6": "^",
    "7": "&",
    "8": "*",
    "9": "(",
    "0": ")",
    "-": "_",
    "=": "+",
    "[": "{",
    "]": "}",
    ";": ":",
    "'": '"',
    ",": "<",
    ".": ">",
    "/": "?",
    "\\": "|",
    "`": "~"
  };

  if (keyName.length === 1 && /[a-z]/i.test(keyName)) {
    const uppercase = capsLock !== shiftActive;
    return uppercase
      ? keyName.toUpperCase()
      : keyName.toLowerCase();
  }

  if (shiftActive && shiftedSymbols[keyName]) {
    return shiftedSymbols[keyName];
  }

  return keyName;
}

function updateModifierKeys() {
  keys.forEach((key) => {
    const keyName = key.dataset.key;

    if (keyName === "CapsLock") {
      key.classList.toggle("active", capsLock);
      key.setAttribute("aria-pressed", String(capsLock));
    }

    if (keyName === "Shift") {
      key.classList.toggle("active", shiftActive);
      key.setAttribute("aria-pressed", String(shiftActive));
    }
  });
}
function handleSpecialKey(keyName) {
  const start = display.selectionStart;
  const end = display.selectionEnd;
  const value = display.value;

  switch (keyName) {
    case "Backspace":
      if (start !== end) {
        display.setRangeText("", start, end, "end");
      } else if (start > 0) {
        display.setRangeText("", start - 1, start, "end");
      }
      break;

    case "Delete":
      if (start !== end) {
        display.setRangeText("", start, end, "end");
      } else if (end < value.length) {
        display.setRangeText("", end, end + 1, "end");
      }
      break;

    case "Enter":
      insertText("\n");
      break;

    case "Tab":
      insertText("\t");
      break;

    case "Space":
      insertText(" ");
      break;

    case "ArrowLeft":
      display.setSelectionRange(
        Math.max(0, start - 1),
        Math.max(0, start - 1)
      );
      break;

    case "ArrowRight":
      display.setSelectionRange(
        Math.min(value.length, end + 1),
        Math.min(value.length, end + 1)
      );
      break;

    case "ArrowUp":
    case "ArrowDown": {
      const cursor = display.selectionStart;
      const beforeCursor = value.slice(0, cursor);
      const currentLineStart = beforeCursor.lastIndexOf("\n") + 1;
      const column = cursor - currentLineStart;

      if (keyName === "ArrowUp" && currentLineStart > 0) {
        const previousLineEnd = currentLineStart - 1;
        const previousLineStart =
          value.lastIndexOf("\n", previousLineEnd - 1) + 1;

        const newPosition = Math.min(
          previousLineStart + column,
          previousLineEnd
        );

        display.setSelectionRange(newPosition, newPosition);
      } else if (
        keyName === "ArrowDown" &&
        value.indexOf("\n", cursor) !== -1
      ) {
        const currentLineEnd = value.indexOf("\n", cursor);
        const nextLineStart = currentLineEnd + 1;
        const nextLineEndIndex = value.indexOf("\n", nextLineStart);

        const nextLineEnd =
          nextLineEndIndex === -1
            ? value.length
            : nextLineEndIndex;

        const newPosition = Math.min(
          nextLineStart + column,
          nextLineEnd
        );

        display.setSelectionRange(newPosition, newPosition);
      }
      break;
    }

    case "Home": {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      display.setSelectionRange(lineStart, lineStart);
      break;
    }

    case "End": {
      const lineEndIndex = value.indexOf("\n", end);
      const lineEnd =
        lineEndIndex === -1 ? value.length : lineEndIndex;

      display.setSelectionRange(lineEnd, lineEnd);
      break;
    }

    case "Escape":
      showStatus("Escape pressed.");
      break;

    default:
      return false;
  }

  display.focus();
  return true;
}

keys.forEach((key) => {
  key.addEventListener("pointerdown", (event) => {

    event.preventDefault();
  });

  key.addEventListener("click", () => {
    const keyName = key.dataset.key;

    if (!keyName) return;

    display.focus();

    if (keyName === "CapsLock") {
      capsLock = !capsLock;
      updateModifierKeys();
      showStatus(`Caps Lock ${capsLock ? "on" : "off"}.`);
      return;
    }

    if (keyName === "Shift") {
      shiftActive = !shiftActive;
      updateModifierKeys();
      showStatus(`Shift ${shiftActive ? "on" : "off"}.`);
      return;
    }

    if (["Control", "Alt", "Meta"].includes(keyName)) {
      key.classList.toggle("active");
      const isActive = key.classList.contains("active");
      key.setAttribute("aria-pressed", String(isActive));
      showStatus(`${keyName} ${isActive ? "selected" : "released"}.`);
      return;
    }

    const handled = handleSpecialKey(keyName);

    if (!handled) {
      const character = getCharacter(keyName);
      insertText(character);
    }

 
    if (shiftActive) {
      shiftActive = false;
      updateModifierKeys();
    }

    showStatus(`${keyName} pressed.`);
  });
});

if (clearButton) {
  clearButton.addEventListener("click", () => {
    display.value = "";
    display.focus();
    showStatus("Text cleared.");
  });
}
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(display.value);
      showStatus("Text copied successfully!");
    } catch (error) {

      display.focus();
      display.select();

      const copied = document.execCommand("copy");

      display.setSelectionRange(
        display.value.length,
        display.value.length
      );

      showStatus(
        copied
          ? "Text copied successfully!"
          : "Unable to copy text. Please copy it manually."
      );
    }
  });
}

display.addEventListener("input", () => {
  showStatus("Text updated.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "CapsLock") {
    capsLock = event.getModifierState("CapsLock");
    updateModifierKeys();
  }
});
