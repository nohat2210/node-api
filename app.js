//config env
require('dotenv').config();
require('./redis_connect');

const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const secureApp = require('helmet');
const mongoClient = require('mongoose');

//Setup connect mongodb by mongoose
mongoClient
  .connect(process.env.MONGODB_URL || 'mongodb://localhost/node-api', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('✅ Connected database from mongoDB');
  })
  .catch(error => {
    console.error(`❌ Connect database is failed with error is ${error}`);
  });

const app = express();
app.use(secureApp());

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const categoryRoute = require('./routes/category');
const notificationRoute = require('./routes/notification');
const orderRoute = require('./routes/order');

//Middlewares
app.use(
  cors({
    origin: '*', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));

//Routes
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/categories', categoryRoute);
app.use('/notifications', notificationRoute);
app.use('/orders', orderRoute);

//Routes
app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Server is OK!',
  });
});

//Catch 404 Error and forward them to error handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

//Error handler function
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;

  //response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

//Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
