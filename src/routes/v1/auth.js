const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { mysqlDatabase, jwtSecretKey } = require('./config');

const userSchema = Joi.object({
  email: Joi.string().email().max(250).trim().lowercase(),
  password: Joi.string().min(6).max(250),
});

router.post('/register', async (req, res) => {
  let userData;
  try {
    userData = await userSchema.validateAsync({
      email: req.body.email,
      password: req.body.password,
    });
  } catch (e) {
    return res.status(400).send({
      error: 'Incorrect data passed',
    });
  }

  if (!req.body.email && !req.body.password) {
    return res.status(400).send({
      error: 'Incorrect data passed',
    });
  }

  try {
    const con = await mysql.createConnection(mysqlDatabase);

    const hashedPassword = bcrypt.hashSync(userData.password, 10);

    const [data] = await con.execute(
      `INSERT INTO users (email, password) VALUES (${mysql.escape(
        userData.email
      )}, '${hashedPassword}')`
    );

    if (data.affectedRows !== 1) {
      return res
        .status(500)
        .send({ error: 'An unexpected error occurred. Please try again' });
    }

    return res.send({ msg: 'Succesfully registered and account' });

    return res.send(data);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ error: 'An unexpected error occurred. Please try again' });
  }
});

router.post('/login', async (req, res) => {
  let userData;
  try {
    userData = await userSchema.validateAsync({
      email: req.body.email,
      password: req.body.password,
    });
  } catch (e) {
    return res.status(400).send({
      error: 'Incorrect data passed',
    });
  }

  try {
    const con = await mysql.createConnection(mysqlDatabase);

    const [data] = await con.execute(
      `SELECT * FROM users WHERE email = ${mysql.escape(req.body.email)}`
    );

    if (data.length !== 1) {
      return res.status(400).send({ err: 'Email or password is incorrect' });
    }

    const validEmail = bcrypt.compareSync(userData.password, data[0].password);

    if (!validEmail) {
      return res.status(400).send({ err: 'Email or password is incorrect' });
    }

    const token = jwt.sign(
      { id: data[0].id, email: data[0].email },
      jwtSecretKey
    );

    return res.send({ msg: 'Successfully logged in', token });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
