const express = require('express');

const router = express.Router();

const { loggedIn } = require('../../middleware');

router.get('/homepage', (req, res) => {
  res.send({
    text: 'Plankcempas yra lietuvos nacionalinis sportas išlaikant savo kūno svorį virš pečių.',
  });
});

router.get('/', loggedIn, (req, res) => {
  res.send({ msg: 'content is delivered successfully' });
});

module.exports = router;
