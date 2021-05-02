const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./utils/config');
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const loginRouter = require('./controllers/login');
const testRouter = require('./controllers/tests');
const logger = require('./utils/logger');

const app = express();
logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }).then(() => {
  logger.info('Connected to MongoDB.');
}).catch((err) => {
  logger.error('error connecting to the mongoDB:', err.message);
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
morgan.token('json-data', (req) => (
  req.method === 'POST' ? JSON.stringify(req.body) : null
));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :json-data'));

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogRouter);
if (process.env.NODE_ENV === 'test') {
  app.use('/api/tests', testRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
