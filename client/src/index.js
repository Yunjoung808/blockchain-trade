
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.1.0";
import "assets/demo/demo.css";

import Index from "views/Index.js";
import LoginUser from "views/examples/LoginUser.js"
import LoginCompany from "views/examples/LoginCompany.js";
import RegisterPage from "views/examples/RegisterPage.js"
import CompletePage from "views/examples/CompletePage.js"
import MyPage from "views/examples/MyPage.js";

import MainUser from "views/examples/MainUser.js";
import MainCompany from "views/examples/MainCompany.js";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
    <Route
      path="/main-user"
      render={props => <MainUser {...props} />}
    />
    <Route
      path="/main-company"
      render={props => <MainCompany {...props} />}
    />
    <Route
      path="/login-company"
      render={props => <LoginCompany {...props} />}
    />
    <Route
      path="/login-user"
      render={props => <LoginUser {...props} />}
    />
    <Route
      path="/register-page"
      render={props => <RegisterPage {...props} />}
    />
    <Route
      path="/complete-page"
      render={props => <CompletePage {...props} />}
    />
    <Route
      exact path="/my-page"
      render={props => <MyPage {...props} />}
    />
    <Route 
      path="/" 
      render={props => <Index {...props} />} 
    />

    <Redirect from="/" to="/" />
  </Switch>
</BrowserRouter>,
document.getElementById("root")
);
