module.exports = {
  path: 'video-check',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/VideoCheck'));
    });
  }
};
