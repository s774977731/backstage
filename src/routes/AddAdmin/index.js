module.exports = {
  path: 'add-admin',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/AddAdmin'));
    });
  }
};
