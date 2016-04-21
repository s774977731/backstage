module.exports = {
  path: 'detail-article',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/DetailArticle'));
    });
  }
};
