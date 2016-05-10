module.exports = {
  path: 'room',
  indexRoute: { onEnter: (nextState, replace) => replace('/room/main') },
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./liveroom'),
        require('./newroom'),
        require('./roomcheck')
      ]);
    });
  },
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Room'));
    });
  }
};
