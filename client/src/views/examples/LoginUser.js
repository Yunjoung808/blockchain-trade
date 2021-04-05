import Axios from 'axios';
import React , { Component } from "react";

import Caver from "caver-js";
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
const Crypto = require('crypto-js');
import WalletCardForUser from "components/WalletCard/WalletCardForUser.js";



// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  
} from "reactstrap";

// core components
import UserNavbar from "components/Navbars/UserNavbar.js";
import Footer from "components/Footer/Footer.js";
import { Link } from "react-router-dom";
import MainUser from './MainUser';


class LoginUser extends React.Component {
  state = {
    squares1to6: "",
    squares7and8: "",
    
  };
  componentDidMount() {
    document.body.classList.toggle("register-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }




  getWallet = () => {
    console.log("getWallet"+caver.klay.accounts.wallet.length);
    if (caver.klay.accounts.wallet.length) {
      return caver.klay.accounts.wallet[0]
    } else {
      const walletFromSession = sessionStorage.getItem('walletInstance')
      try {
        caver.klay.accounts.wallet.add(JSON.parse(walletFromSession))
      } catch (e) {
        sessionStorage.removeItem('walletInstance')
      }
      return caver.klay.accounts.wallet[0]
    }
  }

  render() {
    var walletInstance = this.getWallet();
   if(walletInstance){
     return (
       <MainUser/>
     );
   }
    return (
      <>
      <UserNavbar />
      <img alt="..." className="path" src={require("assets/img/blob.png")} />
        <div className="wrapper">
          <div className="page-header">
            <div className="page-header-image" />
            <div className="content">
              <Container>

              <Row className="row-grid justify-content-between align-items-center text-left">
                    <WalletCardForUser/>
              </Row>
                <div
                  className="square square-3"
                  id="square3"
                  style={{ transform: this.state.squares1to6 }}
                />
                <div
                  className="square square-4"
                  id="square4"
                  style={{ transform: this.state.squares1to6 }}
                />
                <div
                  className="square square-6"
                  id="square6"
                  style={{ transform: this.state.squares1to6 }}
                />
                  <div className="space-70"></div>
              </Container>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }
}

export default LoginUser;
