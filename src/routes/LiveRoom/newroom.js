module.exports = {
  path: 'new-live-room',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/NewLiveRoom'));
    });
  }
};
