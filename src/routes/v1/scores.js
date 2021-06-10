const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mysql = require('mysql2/promise');

const { loggedIn } = require('../../middleware');
const { mysqlDatabase } = require('../../config');

router.get('/homepage', (req, res) => {
  res.send({
    text: 'Plankcempas yra kazkoks kazkas nacionalinas kazka islaikant savo kazka kazkoki virs kazko',
  });
});

const scoreSchema = Joi.object({
  id: Joi.number(),
  score: Joi.number(),
});

router.post('/add-score', loggedIn, async (req, res) => {
  let score;
  try {
    score = await scoreSchema.validateAsync({
      id: req.userData.id,
      score: req.body.score,
    });
  } catch (e) {
    return res.status(400).send({ error: 'Incorrect data passed' });
  }

  try {
    const con = await mysql.createConnection(mysqlDatabase);

    const [data] = await con.execute(
      `INSERT INTO scores (user_id, score) VALUES (${score.id}, ${score.score})`,
    );

    if (data.affectedRows !== 1) {
      return res
        .status(500)
        .send({ error: 'An unexpected error occurred. Please try again' });
    }
    con.end();
    return res.send({ msg: 'Successfully added a new score' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ error: 'An unexpected error occurred. Please try again' });
  }
});

router.get('/my-scores', loggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlDatabase);
    const [data] = await con.execute(
      `SELECT * FROM scores WHERE user_id = ${req.user.id},`,
    );
    con.end();
    return res.send({ scores: data });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ error: 'An unexpected error occurred. Please try again' });
  }
});

router.get('/highscores', async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlDatabase);
    const [data] = await con.execute(
      `SELECT * FROM scores ORDER BY score DESC LIMIT 5`,
    );
    con.end();
    return res.send({ scores: data });
  } catch {
    console.log(e);
    return res
      .status(500)
      .send({ error: 'An unexpected error occurred. Please try again' });
  }
});

router.get('/', loggedIn, (req, res) => {
  res.send({ msg: 'Content is delivered succesfully' });
});

module.exports = router;
