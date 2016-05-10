module.exports = {
  path: 'main',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/liveVideo'));
    });
  }
};
