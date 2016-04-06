module.exports = {
  path: 'authority-center',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Authority'));
    });
  }
};
