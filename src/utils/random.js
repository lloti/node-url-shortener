// Random words
const words = require('../data/words.json');
const randomWord = () => `${words.adjectives[Math.floor(Math.random() * words.adjectives.length)]}${words.nouns[Math.floor(Math.random() * words.nouns.length)]}`;
// Random chars
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

const cfg = require('../../config');

// If readable is true
//   Pick three words from words.json
// Else
//   Random {conifg} [a-zA-Z0-9]

module.exports = (filter = [], readable = false, length = cfg.length) => {
  let str;
  (retry => {
    if (readable) {
      str = randomWord();
    } else {
      str = '';
      for (let i = 0; i !== length; i++) str += randomChar();
    }
    if (filter.includes(str)) retry();
  })();
  return str;
};