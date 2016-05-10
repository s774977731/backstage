module.exports = {
  path: 'article',
  indexRoute: { onEnter: (nextState, replace) => replace('/article/main') },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./article'),
        require('./detail'),
        require('./newarticle')
      ]);
    });
  },
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Main'));
    });
  }
};
