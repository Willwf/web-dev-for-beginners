// all of our quotes
const quotes = [
  {
    id: "1",
    quote: "I am a brain, Watson. The rest of me is a mere appendix.",
  },
  {
    id: "2",
    quote: "There is nothing more deceptive than an obvious fact.",
  },
  {
    id: "3",
    quote:
      "The lowest and vilest alleys in London do not present a more dreadful record of sin than does the smiling and beautiful countryside.",
  },
  {
    id: "4",
    quote:
      "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  },
  {
    id: "5",
    quote: "There is nothing more deceptive than an obvious fact.",
  },
  {
    id: "6",
    quote:
      "I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.",
  },
  {
    id: "7",
    quote: "I never make exceptions. An exception disproves the rule.",
  },
  {
    id: "8",
    quote: "What one man can invent another can discover.",
  },
  {
    id: "9",
    quote: "Nothing clears up a case so much as stating it to another person.",
  },
  {
    id: "10",
    quote:
      "Education never ends, Watson. It is a series of lessons, with the greatest for the last.",
  },
];
// store the list of words and the index of the word the player is currently typing
let words = [];
let wordIndex = 0;
// the starting time
let startTime = Date.now();
// page elements
const quoteElement = document.getElementById("quote");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const startButton = document.getElementById("start");
const modal = document.getElementById("modal");
const close = document.querySelector("#modal div a");
const quoteScore = document.getElementById("quoteScore");

function handleQuote() {
  // get a quote and quote id
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex].quote;
  const quoteId = quotes[quoteIndex].id;

  quoteElement.dataset.id = quoteId;

  if (localStorage.getItem(quoteId)) {
    quoteScore.innerText = `Highest Score: ${localStorage.getItem(
      quoteId
    )} seconds. 🥇`;
  } else {
    quoteScore.innerText = "";
  }

  // Put the quote into an array of words
  words = quote.split(" ");
  // reset the word index for tracking
  wordIndex = 0;

  // UI updates
  // Create an array of span elements so we can set a class
  const spanWords = words.map(function (word) {
    return `<span>${word} </span>`;
  });
  // Convert into string and set as innerHTML on quote display
  quoteElement.innerHTML = spanWords.join("");
  // Highlight the first word
  quoteElement.childNodes[0].className = "highlight";
  // Clear any prior messages
  messageElement.innerText = "";

  // Setup the textbox
  // Clear the textbox
  typedValueElement.value = "";
  // set focus
  typedValueElement.focus();
  // set the event handler

  // Start the timer
  startTime = new Date().getTime();
  typedValueElement.removeAttribute("readonly");
  typedValueElement.addEventListener("input", verifyTypedWords);
}

function verifyTypedWords() {
  // Get the current word
  const currentWord = words[wordIndex];
  // get the current value
  const typedValue = typedValueElement.value;
  // get the current id
  const quoteId = quoteElement.dataset.id;

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    // end of sentence
    // Display success
    const elapsedTime = (new Date().getTime() - startTime) / 1000;
    const message = `CONGRATULATIONS! You finished in ${elapsedTime} seconds.`;
    if (elapsedTime < localStorage.getItem(quoteId)) {
      messageElement.innerText = message + ` New High Score! 🎉`;
    } else {
      messageElement.innerText = message;
    }

    modal.classList.toggle("hide");
    close.addEventListener("click", () => {
      modal.classList.add("hide");
      quoteScore.innerText = `Highest Score: ${localStorage.getItem(
        quoteId
      )} seconds. 🥇`;
    });

    typedValueElement.removeEventListener("input", verifyTypedWords);

    typedValueElement.value = "";
    typedValueElement.setAttribute("readonly", "readonly");

    function setScore() {
      if (localStorage.getItem(quoteId)) {
        if (elapsedTime < localStorage.getItem(quoteId)) {
          localStorage.setItem(quoteId, elapsedTime);
        }
      } else {
        localStorage.setItem(quoteId, elapsedTime);
      }
    }

    setScore();
  } else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
    // end of word
    // clear the typedValueElement for the new word
    typedValueElement.value = "";
    // move to the next word
    wordIndex++;
    // reset the class name for all elements in quote
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = "";
    }
    // highlight the new word
    quoteElement.childNodes[wordIndex].className = "highlight";
  } else if (currentWord.startsWith(typedValue)) {
    // currently correct
    // highlight the next word
    typedValueElement.className = "";
  } else {
    // error state
    typedValueElement.className = "error";
  }
}

startButton.addEventListener("click", handleQuote);
