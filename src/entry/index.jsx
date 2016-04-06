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
      require('../routes/Data'),
      require('../routes/LiveRoom'),
      require('../routes/LiveVideo'),
      require('../routes/Authority'),
      require('../routes/NewArticle'),
      require('../routes/NewLiveVideo'),
      require('../routes/NewLiveRoom'),
      require('../routes/AddAdmin'),
      require('../routes/VideoCheck'),
      require('../routes/RoomCheck')
    ]
  }]
};



ReactDOM.render(
  <Router history={hashHistory} routes={rootRoute} />,
  document.getElementById('react-content'));
