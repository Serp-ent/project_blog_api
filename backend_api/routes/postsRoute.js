
const { Router } = require('express');
const postsRoute = Router();

postsRoute.get('/', (req, res) => {
  res.send('Get all posts');
});

postsRoute.post('/', (req, res) => {
  res.send('create new post');
});

postsRoute.get('/:id', (req, res) => {
  res.send(`get post with id ${req.params.id}`);
});

postsRoute.delete('/:id', (req, res) => {
  res.send(`delete post with id ${req.params.id}`);
});

postsRoute.post('/:id', (req, res) => {
  res.send(`update post with id ${req.params.id}`);
});

postsRoute.post('/:id', (req, res) => {
  res.send('switch with new version of post');
});

postsRoute.get('/:id/comments', (req, res) => {
  res.send(`get all comments for post ${req.params.id}`);
});

postsRoute.post('/:id/comments', (req, res) => {
  res.send(`post new comment for post ${req.params.id}`);
});

module.exports = postsRoute;
