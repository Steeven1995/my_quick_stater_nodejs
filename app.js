const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({ message: 'Landing page' });
});

app.use('/api', require('./routes/api.route'));
app.use('/api/auth', require('./routes/api.auth'));


app.use((req, res, next) => {
  next(createrEror.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server run on http://localhost:${PORT}`));
