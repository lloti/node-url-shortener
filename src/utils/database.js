const { data } = require('../../config');
const { open } = require('sqlite');
const Links = require('./links');
const links = new Links();

const rightPad = (text, length) => `${text}${' '.repeat(length - text.toString().length)}`;

const table = arr => {
  const lengths = [];
  const textArr = [];
  for (const i in arr[0]) {
    lengths.push(Math.max(...arr.map(a => a[i].toString().length)));
  }
  for (const i in arr) {
    textArr.push(`| ${arr[i].map((t, i) => rightPad(t, lengths[i])).join(' | ')} |`);
  }
  const tb = `+${'–'.repeat(Math.max(...textArr.map(t => t.length)) - 2)}+`;
  textArr.splice(1, 0, tb);
  textArr.unshift(tb);
  textArr.push(tb);
  return textArr.join('\n');
};

open(data).then(db => {
  links.register(db).then(() => {
    console.log(`\n    ${links.users.length} User${links.users.length === 1 ? '' : 's'}`);
    console.log(table([['Uses', 'Link', 'Created', 'Long']].concat(Object.values(links.links).sort((a, b) => a.created - b.created).map(link => [link.uses, link.short, link.created, link.long]))));
  });
});

module.exports = links;