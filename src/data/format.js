const s = require('./words.json');
const j = {};
for (const e in s) {
  j[e] = s[e].map(l => `${l[0].toUpperCase()}${l.slice(1)}`);
}
require('fs').writeFile('./words.json', JSON.stringify(j, null, 2), 'utf8');