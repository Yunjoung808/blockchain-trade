
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
import OrderPage from "views/examples/OrderPage.js"
import CompletePage from "views/examples/CompletePage.js"
import OldDescriptPage from "views/examples/OldDescriptPage.js";
import UploadOldPage from "views/examples/UploadOldPage.js";
import MyPage from "views/examples/MyPage.js";
import OrderPageOld from "views/examples/OrderPageOld.js"
import OrderCompletePageOld from "views/examples/OrderCompletePageOld.js"
import UploadNewPage from "views/examples/UploadNewPage.js";
import Basics from "views/examples/Basics.js";
import MainUser from "views/examples/MainUser.js";
import Test from "views/examples/Test.js";


ReactDOM.render(
  <BrowserRouter>
    <Switch>
    <Route
        path="/basics-page"
        render={props => <Basics {...props} />}
      />
      <Route
        path="/test"
        render={props => <Test {...props} />}
      />
       <Route
        path="/main-user"
        render={props => <MainUser {...props} />}
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
        path="/order-page"
        render={props => <OrderPage {...props} />}
      />
      <Route
        path="/complete-page"
        render={props => <CompletePage {...props} />}
      />
      <Route
        path="/old-descript-page"
        render={props => <OldDescriptPage {...props} />}
      />
      <Route
       exact path="/upload-old-page"
        render={props => <UploadOldPage {...props} />}
      />
      <Route
       exact path="/my-page"
        render={props => <MyPage {...props} />}
      />
      <Route
        path="/order-page-old"
        render={props => <OrderPageOld {...props} />}
      />
      <Route
        path="/order-complete-page-old"
        render={props => <OrderCompletePageOld {...props} />}
      />
      <Route
       exact path="/upload-new-page"
        render={props => <UploadNewPage {...props} />}
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
