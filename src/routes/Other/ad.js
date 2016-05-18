module.exports = {
  path: 'ad',
  name:'广告图',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/AD'));
    });
  }
};
