import '../common/lib';
import ReactDOM from 'react-dom';
import App from '../component/App';
import {Router, hashHistory } from 'react-router';
import React from 'react';

const rootRoute = {
  component: 'div',
  childRoutes: [{
    path: '/',
    component: require('../component/App'),
    indexRoute: { onEnter: (nextState, replace) => replace('/data-center') },
    childRoutes: [
      require('../routes/Article'),
      require('../routes/Article/newarticle'),
      require('../routes/Data'),
      require('../routes/LiveRoom'),
      require('../routes/LiveRoom/newroom'),
      require('../routes/LiveRoom/roomcheck'),
      require('../routes/LiveVideo'),
      require('../routes/LiveVideo/newvideo'),
      require('../routes/LiveVideo/videocheck'),
      require('../routes/Authority')
    ]
  }]
};



ReactDOM.render(
  <Router history={hashHistory} routes={rootRoute} />,
  document.getElementById('react-content'));
