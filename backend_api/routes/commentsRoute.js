
const { Router } = require('express');
const commentsRoute = Router();

commentsRoute.put('/:id', (req, res) => {
  res.send(`Update existing comment with id ${req.params.sid}`);
});

commentsRoute.delete('/:id', (req, res) => {
  // TODO: maybe it should just mark comment as non-visible
  res.send(`Delete existing comment with id ${req.params.sid}`);
});

module.exports = commentsRoute;