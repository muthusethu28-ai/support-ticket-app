const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);

app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use(errorHandler);

module.exports = app;
