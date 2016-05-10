module.exports = {
  path: 'main',
  name:'文章管理',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Article'));
    });
  }
};
