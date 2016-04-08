module.exports = {
  path: 'new-article',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/NewArticle'));
    });
  }
};
