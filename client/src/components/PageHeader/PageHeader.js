
import React from "react";
import Login from "components/GoogleLogin/GoogleLogin.js";
import Caver from "caver-js";

// reactstrap components
import { Button, Container, Row, Col, FormGroup, Modal, Form} from "reactstrap";

const config = { rpcURL: 'https://api.baobab.klaytn.net:8651' }
const caver = new Caver(config.rpcURL);

class PageHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formModal: false,
      formModal2: false
    };
  }

  toggleModal = modalState => {
    this.setState({
      [modalState]: !this.state[modalState]
    });
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

    if (walletInstance) {
    return (
      <div className="page-header header-filter">
        <div className="squares square1" />
        <div className="squares square2" />
        <div className="squares square3" />
        <div className="squares square4" />
        <div className="squares square5" />
        <div className="squares square6" />
        <div className="squares square7" />
        <Container>
          
        </Container>
      </div>
    );
    }
    return (
      <div className="page-header header-filter">
        <div className="squares square1" />
        <div className="squares square2" />
        <div className="squares square3" />
        <div className="squares square4" />
        <div className="squares square5" />
        <div className="squares square6" />
        <div className="squares square7" />
        <Container>
          <div className="content-center brand">
            <h3 className="d-none d-sm-block">
            Trust but Verify with
            </h3>
            <h1 className="h1-seo">DM_Plus</h1>
            <br/>
           
          </div>
        </Container>
      </div>
    );
  }
}

export default PageHeader;
