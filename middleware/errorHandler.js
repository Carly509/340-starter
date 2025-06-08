function errorHandler(err, req, res, next) {
  console.error(err.stack);
  if (err.message && err.message.includes('Failed to lookup view')) {
    res.status(404);
    res.render('error', { error: { status: 404, message: 'Page Not Found' } });
  } else {
    res.status(err.status || 500);
    res.render('error', { error: err });
  }
}

module.exports = errorHandler;
