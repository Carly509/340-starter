const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/account/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) return res.redirect('/account/login');
  req.user = decoded;
  next();
});
}

module.exports = authenticateToken;
