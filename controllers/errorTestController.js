exports.triggerError = (req, res, next) => {
  const err = new Error('Intentional Server Error');
  err.status = 500;
  next(err);
};
