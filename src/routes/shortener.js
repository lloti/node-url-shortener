const links = require('../utils/database');
const random = require('../utils/random');
const { name } = require('../../config');

module.exports = (req, res) => {
  const { id } = req.cookies;
  if (!id) {
    const rand = random(links.users, false, 64);
    res.cookie('id', rand);
    links.createUser(rand);
  }
  const user = links.getUser(id);
  const host = req.get('Host');
  res.render('index', { protocol: req.protocol, name, user, host });
};