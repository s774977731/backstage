module.exports = {
  path: 'new-live-video',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/NewLiveVideo'));
    });
  }
};
