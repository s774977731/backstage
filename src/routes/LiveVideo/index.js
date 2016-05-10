module.exports = {
  path: 'video',
  indexRoute: { onEnter: (nextState, replace) => replace('/video/main') },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./livevideo'),
        require('./newvideo'),
        require('./videocheck')
      ]);
    });
  },
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Video'));
    });
  }
};
