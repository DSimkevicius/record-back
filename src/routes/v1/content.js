const express = require('express');
const router = express.Router();

const { loggedIn } = require('../v1/middleware');

router.get('/', loggedIn, (req, res) => {
  res.send({ msg: 'Content is delivered succesfully' });
});

module.exports = router;
