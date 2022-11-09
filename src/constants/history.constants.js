const { LoremIpsum } = require("lorem-ipsum");

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

const headers = [
  { id: "a", data: "Date" },
  { id: "b", data: "Amount" },
  { id: "c", data: "Recipient" },
  { id: "d", data: "Details" },
];

const columnWidths = ["20%", "20%", "20%", "40%"];

export { columnWidths, headers, lorem };
