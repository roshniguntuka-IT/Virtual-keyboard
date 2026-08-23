const display = document.getElementById("display");
const keys = document.querySelectorAll(".key");
let capsLock = false;
let shiftPressed = false;
let ctrlPressed = false;
let altPressed = false;
let text = "";

keys.forEach(function (key) {
    key.addEventListener("click", function () {
        const keyValue = key.dataset.key;
        handleKey(keyValue);
    });
});

function handleKey(keyValue) {
    if (keyValue === "Backspace") {
        text = text.slice(0, -1);
    } else if (keyValue === "Enter") {
        text += "\n";
    } else if (keyValue === "Tab") {
        text += "\t";
    } else if (keyValue === "Space") {
        text += " ";
    } else if (keyValue === "CapsLock") {
        capsLock = !capsLock;
        toggleActiveKey("CapsLock");
    } else if (keyValue === "Shift") {
        shiftPressed = !shiftPressed;
        toggleActiveKey("Shift");
    } else if (keyValue === "Control") {
        ctrlPressed = !ctrlPressed;
        toggleActiveKey("Control");
    } else if (keyValue === "Alt") {
        altPressed = !altPressed;
        toggleActiveKey("Alt");
    } else if (keyValue === "Delete") {
        text = "";
    } else if (keyValue === "ArrowLeft") {
        moveCursor("left");
    } else if (keyValue === "ArrowRight") {
        moveCursor("right");
    } else if (keyValue === "ArrowUp") {
        moveCursor("up");
    } else if (keyValue === "ArrowDown") {
        moveCursor("down");
    } else if (keyValue === "Home") {
        text = "";
    } else if (keyValue === "End") {
        display.focus();
        display.selectionStart = text.length;
        display.selectionEnd = text.length;
    } else if (keyValue === "Escape") {
        text = "";
    } else if (keyValue === "F1") {
        showFunctionMessage("F1");
    } else if (keyValue === "F2") {
        showFunctionMessage("F2");
    } else if (keyValue === "F3") {
        showFunctionMessage("F3");
    } else if (keyValue === "F4") {
        showFunctionMessage("F4");
    } else if (keyValue === "F5") {
        showFunctionMessage("F5");
    } else if (keyValue === "F6") {
        showFunctionMessage("F6");
    } else if (keyValue === "F7") {
        showFunctionMessage("F7");
    } else if (keyValue === "F8") {
        showFunctionMessage("F8");
    } else if (keyValue === "F9") {
        showFunctionMessage("F9");
    } else if (keyValue === "F10") {
        showFunctionMessage("F10");
    } else if (keyValue === "F11") {
        showFunctionMessage("F11");
    } else if (keyValue === "F12") {
        showFunctionMessage("F12");
    } else if (keyValue === "Clear") {
        text = "";
    } else {
        let character = keyValue;
        if (capsLock || shiftPressed) {
            character = character.toUpperCase();
        }
        text += character;
        if (shiftPressed) {
            shiftPressed = false;
            removeActiveKey("Shift");
        }
    }
    updateDisplay();
}

function updateDisplay() {
    display.value = text;
}

function toggleActiveKey(keyName) {
    keys.forEach(function (key) {
        if (key.dataset.key === keyName) {
            key.classList.toggle("active");
        }
    });
}

function removeActiveKey(keyName) {
    keys.forEach(function (key) {
        if (key.dataset.key === keyName) {
            key.classList.remove("active");
        }
    });
}

function moveCursor(direction) {
    const currentPosition = display.selectionStart;
    if (direction === "left") {
        display.focus();
        display.selectionStart = Math.max(0, currentPosition - 1);
        display.selectionEnd = display.selectionStart;
    }
    if (direction === "right") {
        display.focus();
        display.selectionStart = Math.min(text.length, currentPosition + 1);
        display.selectionEnd = display.selectionStart;
    }
}

function showFunctionMessage(keyName) {
    console.log(keyName + " pressed");
}

document.addEventListener("keydown", function (event) {
    event.preventDefault();
    let key = event.key;
    if (event.key === " ") {
        key = "Space";
    }
    if (event.key === "CapsLock") {
        capsLock = !capsLock;
        toggleActiveKey("CapsLock");
        return;
    }
    if (event.key === "Shift") {
        shiftPressed = true;
        toggleActiveKey("Shift");
        return;
    }
    if (event.key === "Control") {
        ctrlPressed = true;
        toggleActiveKey("Control");
        return;
    }
    if (event.key === "Alt") {
        altPressed = true;
        toggleActiveKey("Alt");
        return;
    }
    if (event.key === "Backspace") {
        handleKey("Backspace");
        return;
    }
    if (event.key === "Enter") {
        handleKey("Enter");
        return;
    }
    if (event.key === "Tab") {
        handleKey("Tab");
        return;
    }
    if (event.key === "Delete") {
        handleKey("Delete");
        return;
    }
    if (event.key.startsWith("F") && event.key.length <= 3) {
        showFunctionMessage(event.key);
        return;
    }
    if (event.key.startsWith("Arrow")) {
        handleKey(event.key);
        return;
    }
    if (event.key.length === 1) {
        handleKey(event.key);
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "Shift") {
        shiftPressed = false;
        removeActiveKey("Shift");
    }
    if (event.key === "Control") {
        ctrlPressed = false;
        removeActiveKey("Control");
    }
    if (event.key === "Alt") {
        altPressed = false;
        removeActiveKey("Alt");
    }
});