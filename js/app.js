import 'babel/polyfill';

import App from './components/App';
import EmployeePage from './components/EmployeePage';
//import AppHomeRoute from './routes/AppHomeRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import createHashHistory from 'history/lib/createHashHistory';
import {Router, Route} from 'react-router';
import ReactRouterRelay from 'react-router-relay';

const history = createHashHistory({queryKey: false});

/*
ReactDOM.render(
  <Relay.RootContainer
    Component={App}
    route={new AppHomeRoute()}
  />,
  document.getElementById('root')
); */

const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`,
};

const EmployeeQueries = {
  employee: ()=> Relay.QL`query { employee(id: $employeeId) }`
};

ReactDOM.render(
  <Router createElement={ReactRouterRelay.createElement} history={history}>
    <Route path="/" component={App}
      queries={ViewerQueries}
    />
    <Route
      path="employees/:employeeId" component={EmployeePage}
      queries={ViewerQueries}
    />
  </Router>,
  document.getElementById('root')
);
