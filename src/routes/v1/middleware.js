const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('./config');

module.exports = {
  loggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decodedToken = jwt.verify(token, jwtSecretKey);
      req.userData = decodedToken;
      next();
    } catch (e) {
      console.log(e);
      return res.status(401).send({ err: 'Validation failed' });
    }
  },
};
