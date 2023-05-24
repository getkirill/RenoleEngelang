import {mulberry32, jsRandomInt} from './util.js'

const sounds = {
  "<": {
    escape: "&gt;",
    consonant: "ʃ",
    vowels: {
      "<": "i",
      ">": "y",
      "^": "ɘ",
      v: "ʊ",
    },
  },
  ">": {
    escape: "&lt;",
    consonant: "ʒ",
    vowels: {
      "<": "æ",
      ">": "ɤ̞",
      "^": "o̞",
      v: null,
    },
  },
  "^": {
    escape: "^",
    consonant: "k",
    vowels: {
      "<": null,
      ">": null,
      "^": "ɶ",
      v: "ɒ",
    },
  },
  v: {
    escape: "v",
    consonant: "ɡ",
    vowels: {
      "<": null,
      ">": null,
      "^": null,
      v: "ɛ",
    },
  },
};
const validPairs = (() => {
  const pairs = [];
  for (const first of Object.keys(sounds)) {
    for (const second of Object.entries(sounds[first].vowels)
      .filter((x) => x[1] !== null)
      .map((x) => x[0])) {
      pairs.push(`${first}${second}`);
    }
  }
  return pairs;
})();
export function generateWord(
  seed = jsRandomInt(0, 4294967295)
) {
  const random = mulberry32(seed);
  const length = Math.floor(10 * random()) + 1;
  let word = "";
  for (const i of Array(length).keys()) {
    console.log(i);
    if (i + 1 == length && random() > 0.5) {
      console.log(true);
      word += Object.keys(sounds)[Math.floor(3 * random())]
    } else {
      word += validPairs[Math.floor((validPairs.length - 1) * random())];
    }
  }
  return word;
}
/**
 * @param {string} pair
 */
export function pairPronounciation(pair) {
  if (pair.length == 1) {
    return sounds[pair].consonant;
  } else if (pair.length == 2) {
    return sounds[pair[0]].consonant + sounds[pair[0]].vowels[pair[1]];
  }
  return null;
}
/**
 * @param {string} word
 */
export function wordPronounciation(
  word
) {
  const pairs = [];
  let pair = "";
  let secondLetter = false;
  for (const char of word) {
    if (!secondLetter) {
      pair = char;
      secondLetter = true;
    } else {
      pair += char;
      pairs.push(pair);
      secondLetter = false;
    }
  }
  if (pair.length == 1) {
    pairs.push(pair);
  }
  return pairs.map(pairPronounciation).join("");
}

/**
 * @param {string} word
 */
export function escapeWord(word) {
  return word
    .split("")
    .map((x) => sounds[x].escape)
    .join("");
}