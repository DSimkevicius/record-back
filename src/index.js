const express = require('express');
const cors = require('cors');
const { port } = require('./config');

const auth = require('./routes/v1/auth');
const content = require('./routes/v1/content');
const scores = require('./routes/v1/scores');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({ msg: 'Server is running successfully' });
});

app.use('/v1/auth/', auth);
app.use('/v1/content/', content);
app.use('/v1/scores', scores);

app.all('*', (req, res) => {
  res.status(404).send({ error: 'Page is not found' });
});

app.listen(port, () => console.log(`Running on port ${port}`));
