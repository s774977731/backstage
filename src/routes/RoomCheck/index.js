module.exports = {
  path: 'room-check',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/RoomCheck'));
    });
  }
};
