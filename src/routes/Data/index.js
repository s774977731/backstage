module.exports = {
  path: 'data-center',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Data'));
    });
  }
};
