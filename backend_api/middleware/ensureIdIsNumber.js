const { ValidationError } = require("../errors/errors");

const ensureIdIsNumber = (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new ValidationError(`Invalid ID - not a number`);
  }

  req.params.id = id;
  next();
}

module.exports = { ensureIdIsNumber }
