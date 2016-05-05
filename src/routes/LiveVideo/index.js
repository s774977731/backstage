module.exports = {
  path: 'live-video',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/liveVideo'));
    });
  }
};
