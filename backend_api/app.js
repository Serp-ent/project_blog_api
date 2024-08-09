const express = require('express');
require('dotenv').config();
const usersRoute = require('./routes/usersRoute');
const postsRoute = require('./routes/postsRoute');
const commentsRoute = require('./routes/commentsRoute');

const app = express();

app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/comments', commentsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Express app listening on port', PORT);
});
