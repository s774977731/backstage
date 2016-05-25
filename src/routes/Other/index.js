module.exports = {
  path: 'other',
  indexRoute: { onEnter: (nextState, replace) => replace('/other/ad') },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./ad'),
        // require('./addapp'),
      ]);
    });
  },
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Other'));
    });
  }
};
