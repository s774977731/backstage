module.exports = {
  path: 'addapp',
  name:'发布新版安卓',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/AddApp'));
    });
  }
};
