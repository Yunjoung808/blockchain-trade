import Axios from 'axios';
import React , { Component } from "react";
import Login from "components/GoogleLogin/GoogleLoginForUser.js";
import Caver from "caver-js";
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
const Crypto = require('crypto-js');


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
   
    return (
      <>
      <UserNavbar />
      <img alt="..." className="path" src={require("assets/img/blob.png")} />
        <div className="wrapper">
          <div className="page-header">
            <div className="page-header-image" />
            <div className="content">
              <Container>
              <Row>
                <Col className="item"><hr className="line-primary"></hr></Col>
              </Row>

              <Row>
              <h2>LOGIN for User </h2>
              </Row>

              <Row className="row-grid justify-content-between align-items-center text-left">
                    <Col lg="6" md="6">
                      <h1 className="text-white">We keep your token <br />
                        <span className="text-white">secured</span>
                      </h1>
                      <p className="text-white mb-3">
                        A wonderful serenity has taken possession of my entire soul,
                        like these sweet mornings of spring which I enjoy with my
                        whole heart. I am alone, and feel...
                      </p>
                      <div className="btn-wrapper">
                        <div className="button-container">
                          <Button className="btn-icon btn-simple btn-round btn-neutral" color="default" href="#pablo"
                            onClick={e => e.preventDefault()}>
                            <i className="fab fa-twitter" />
                          </Button>
                          <Button className="btn-icon btn-simple btn-round btn-neutral" color="default" href="#pablo"
                            onClick={e => e.preventDefault()}>
                            <i className="fab fa-dribbble" />
                          </Button>
                          <Button
                            className="btn-icon btn-simple btn-round btn-neutral" color="default" href="#pablo"
                            onClick={e => e.preventDefault()}>
                          <i className="fab fa-facebook" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-50"></div>
                      <Login/>
                    </Col>
                    <Col lg="4" md="5">
                    <img alt="..." className="img-fluid" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0RJLMHNZYBuToyhqHdLtOjcpkOoxq-KVYQ&usqp=CAU"/>
                    </Col>
                  </Row>
                  <div className="space-50"></div>
                  <Row>
                <Col className="item"><hr className="line-primary"></hr></Col>
              </Row>
              
              <div className="space-70"></div>

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
