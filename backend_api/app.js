const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('./config/passport-cfg');
const usersRoute = require('./routes/usersRoute');
const postsRoute = require('./routes/postsRoute');
const commentsRoute = require('./routes/commentsRoute');
const { errorHandler } = require('./utilities/errorHandler');
const morgan = require('morgan');

const app = express();

app.use(cors());  // allow everyone
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/comments', commentsRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Express app listening on port', PORT);
});
