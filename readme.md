# Wordle Solver

This a solver for today's [Wordle](https://www.nytimes.com/games/wordle/index.html).

## Prerequisites

You should have:
- Node.js 14+
- Words file located at `/usr/share/dict/words` (it should be common location for all Unix-based systems including Mac)

## Running the solution

Install all required dependencies:
```bash
npm install
```

Then run:
```bash
node src/index.js
```

## See in live action

https://user-images.githubusercontent.com/8128865/189473638-0f6a72f1-e58c-4ea9-877f-a6bdb5756755.mov

## How it works

Solution has 2 parts.

First part is responsible for filtering out invalid words based on game's feedback.
Initially there is a huge list of 5 letter words where any of them is possible. The engine filters out words that do not match alreay known information (like letter positions). Next engine selects one word with highest score (based on letters probability).
Once we get feedback (i.e. which letters are correct, present or absent) we can shrink the word list by eliminating impossible options.
This way game goes on till the word is found.

Second part is interaction with browser using [Puppeteer](https://pptr.dev/) - a Node.js library that can interact with Chrome browser. Basically it opens the Wordle game in the browser, types the word and inspects elements for the word feedback.
