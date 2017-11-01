const qr = require('qr-image');

module.exports = (req, res) => {
  res.set('Content-Type', 'image/png');
  qr.image(`${req.protocol}://${req.get('Host')}/${req.params.link}`).pipe(res);
};