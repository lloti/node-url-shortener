const random = require('./random');

class Links {
  constructor() {
    this.links = {};
    this.users = [];
  }

  random() {
    const links = Object.keys(this.links);
    return links[Math.floor(Math.random() * links.length)];
  }

  get(short) {
    return this.links[short];    
  }

  getUser(user, page = 0) {
    return Object.values(this.links).filter(l => l.creator === user).slice(10 * page, 10 * page + 10);
  }

  create({ long, creator, readable }) {
    const short = random(Object.keys(this.links), readable);
    this.db.run('INSERT INTO links (uses, long, short, creator, created) VALUES (?, ?, ?, ?, ?)', 0, long, short, creator, new Date());
    this.links[short] = { uses: 0, long, short, creator, created: new Date() };
    return this.links[short];
  }

  createUser(user) {
    this.db.run('INSERT INTO users (id) VALUES (?)', user);
    return this.users.push(user);
  }

  async visit(link) {
    await this.db.run('UPDATE links SET uses = uses + 1 WHERE short = (?)', link);
    return true;
  }

  async register(db) {
    this.db = db;
    await this.setup();
    await this.update();
    return true;
  }

  async setup() {
    await this.db.run(`
    CREATE TABLE IF NOT EXISTS links (
      uses INT,
      long TEXT,
      short TINYTEXT,
      creator TINYTEXT,
      created TINYTEXT
    );
    `);
    await this.db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TINYTEXT
    );
    `);
    return true;
  }

  async update() {
    // Sync all links
    const links = await this.db.all('SELECT * FROM links');
    for (const link of links) this.links[link.short] = link;
    // Sync all users
    const users = await this.db.all('SELECT * FROM users');
    for (const user of users) this.users.push(user.id);
    return true;
  }
}

module.exports = Links;