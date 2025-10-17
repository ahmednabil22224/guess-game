const game = () => {
  const WORD_LENGTH = 6;
  const MAX_TRIES = 5;
  let word = "";
  let currentTry = 0;
  let hintsLeft = 2;
  const wordBoxes = document.querySelector(".word-boxes");
  const messageOverlay = document.querySelector(".message");
  const hintBtn = document.querySelector(".hint-btn");
  let inputs = [];

  // --------------------------Create Random Word-----------------------
  function createRandomWord() {
    let newWord = "";
    while (newWord.length < WORD_LENGTH) {
      let char = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      if (!newWord.includes(char)) newWord += char;
    }
    return newWord;
  }

  // ------------------------------------------------------------------------
  // -------------------------------Setup Board------------------------------
  function createBoard() {
    wordBoxes.innerHTML = "";

    for (let i = 0; i < MAX_TRIES; i++) {
      const row = document.createElement("div");
      row.classList.add("letters");
      row.innerHTML =
        `<div>Try ${i + 1}</div>` +
        Array(WORD_LENGTH)
          .fill(0)
          .map(() => `<input type="text" maxlength="1" disabled aria-label="Box row${i+1}">`)
          .join("");
      wordBoxes.appendChild(row);
    }

    inputs = Array.from(document.querySelectorAll(".letters input"));
  }

  // --------------------------------------------------------------------------
  // ---------------------------Make Active Row--------------------------------
  function setActiveRow() {
    document.querySelectorAll(".letters").forEach((row, i) => {
      if (i === currentTry) {
        row.classList.add("active");
        row.querySelector("div").style.opacity = "100%";
        row
          .querySelectorAll("input")
          .forEach((input) => input.removeAttribute("disabled"));
        row.querySelector("input").focus();
      } else {
        row.classList.remove("active");
        row.querySelector("div").style.opacity = "50%";
        row
          .querySelectorAll("input")
          .forEach((input) => input.setAttribute("disabled", "disabled"));
      }
    });
  }

  // -------------------------------------------------------------------------
  // ----------------------------Reset All Inputs----------------------------
  function resetInputs() {
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
      input.style.cssText = "background-color:none; color:black";
      input.classList.remove("correct", "present", "wrong", "hint");
    });
  }

  // -----------------------------------------------------------------------
  // --------------------------Show Message---------------------------------
  function showMessage(win) {
    messageOverlay.classList.add("overlay-message");
    messageOverlay.innerHTML = `
                        <div class="message-form">
                            <h2>${win ? "You Win!" : "You Lose!"}</h2>
                            ${
                              !win
                                ? `<h3>The Word: <span>${word}</span><h3>`
                                : ""
                            }
                            <button class="${
                              win ? "btn-win" : "btn-lose"
                            }">Play Again</button>
                        <div>
                    `;
  }

  // --------------------------------------------------------------
  // -------------------------Handle Guess-------------------------
  function handleGuess() {
    const activeInputs = document.querySelectorAll(".letters.active input");
    let entry = Array.from(activeInputs)
      .map((input) => input.value.toUpperCase())
      .join("");

    activeInputs.forEach((input, i) => {
      if (word[i] === entry[i]) {
        input.style.cssText = "background-color:orange; color:white";
        input.classList.add("correct");
      } else if (word.toUpperCase().includes(entry[i])) {
        input.style.cssText = "background-color:green; color:white";
        input.classList.add("present");
      } else {
        input.style.cssText = "background-color:red; color:white";
        input.classList.add("wrong");
      }
    });

    // Shake row if guess is wrong
    if (entry !== word) {
      document.querySelector(".letters.active").classList.add("shake");
      setTimeout(() => {
        document.querySelector(".letters.active").classList.remove("shake");
      }, 500);
    }

    if (entry === word) {
      showMessage(true);
      return;
    }

    currentTry++;
    if (currentTry >= MAX_TRIES) {
      showMessage(false);
      return;
    }

    setActiveRow();
  }

  // ------------------------------------------------------------------
  // -------------------------Handle Hints-----------------------------
  function useHint() {
    const activeInputs = document.querySelectorAll(".letters.active input");
    for (let i = 0; i < activeInputs.length; i++) {
      if (activeInputs[i].value === "") {
        activeInputs[i].value = word[i];
        activeInputs[i].classList.add("hint");
        if (activeInputs[i + 1]) activeInputs[i + 1].focus();
        hintsLeft--;
        hintBtn.innerHTML = `${hintsLeft} Hint${hintsLeft === 1 ? "" : "s"}`;
        if (hintsLeft === 0) hintBtn.setAttribute("disabled", "");
        break;
      }
    }
  }

  // ---------------------------------------------------------------------
  // -----------------------Keyboard Navigation---------------------------
  function keyboardNavigation() {
    inputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        input.value = input.value.toUpperCase();
        if (inputs[index + 1]) inputs[index + 1].focus();
      });
    });

    document.addEventListener("keydown", function (event) {
      const currentIndex = inputs.indexOf(document.activeElement);
      if (event.key === "ArrowRight" && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      }
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        inputs[currentIndex - 1].focus();
      }
      if (event.key === "Backspace") {
        document.activeElement.value = "";
      }
    });
  }

  // ----------------------------------------------------------------------
  // ----------------------------Restart Game------------------------------
  function restartGame() {
    word = createRandomWord();
    currentTry = 0;
    hintsLeft = 2;
    hintBtn.innerHTML = `${hintsLeft} Hints`;
    hintBtn.removeAttribute("disabled");
    resetInputs();
    setActiveRow();
    keyboardNavigation();
  }

  // ----------------------------------------------------------------------
  // ------------------------------Init Game-------------------------------
  function init() {
    createBoard();
    restartGame();
    document.querySelector(".check-btn").addEventListener("click", handleGuess);
    hintBtn.addEventListener("click", useHint);
    messageOverlay.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("btn-win") ||
        e.target.classList.contains("btn-lose")
      ) {
        messageOverlay.classList.remove("overlay-message");
        messageOverlay.innerHTML = "";
        restartGame();
      }
    });
  }
  init();
};

window.addEventListener("DOMContentLoaded", game);
