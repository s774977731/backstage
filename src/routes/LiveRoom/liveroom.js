module.exports = {
  path: 'main',
  name:'直播间',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/LiveRoom'));
    });
  }
};
