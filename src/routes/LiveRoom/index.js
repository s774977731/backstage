module.exports = {
  path: 'live-room',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/LiveRoom'));
    });
  }
};
