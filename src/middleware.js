const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('./config');
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().max(250).trim().lowercase(),
  password: Joi.string().min(6).max(250),
});

module.exports = {
  async isAuthDataCorrect(req, res, next) {
    let userData;
    try {
      userData = await userSchema.validateAsync({
        email: req.body.email,
        password: req.body.password,
      });
      req.userData = userData;
      return next();
    } catch (e) {
      return res.status(400).send({ error: 'Incorrect data passed' });
    }
  },

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
