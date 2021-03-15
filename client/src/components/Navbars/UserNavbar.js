import React, {Fragment} from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { Button,  Collapse, NavbarBrand, Navbar,UncontrolledTooltip, NavItem, NavLink, Nav, Container, Row, Col, FormGroup, Modal, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";
import Caver from "caver-js";

const config = { rpcURL: 'https://api.baobab.klaytn.net:8651' }
const caver = new Caver(config.rpcURL);

class ComponentsNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      color: "navbar-transparent",
      formModal: false,
      formModal2: false,
      accessType: 'keystore',
      keystore: '',
      keystoreMsg: '',
      password: '',
      privateKey: ''
    };
  }

  generatePrivateKey = () => {
    const { privateKey } = caver.klay.accounts.create()
    this.setState({ privateKey })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  reset = () => {
    this.setState({
      keystore: '',
      privateKey: '',
      password: '',
      keystoreMsg: ''
    })
  }

  handleImport = (e) => {
    const keystore = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      try {
        if (!this.checkValidKeystore(e.target.result)) {
          this.setState({ keystoreMsg: 'Invalid keystore file.' })
          return
        }
        this.setState({
          keystore: e.target.result,
          keystoreMsg: 'It is valid keystore. input your password.',
          keystoreName: keystore.name,
        }, () => document.querySelector('#input-password').focus())
      } catch (e) {
        this.setState({ keystoreMsg: 'Invalid keystore file.' })
        return
      }
    }
    fileReader.readAsText(keystore)
  }

  checkValidKeystore = (keystore) => {
    const parsedKeystore = JSON.parse(keystore)

    const isValidKeystore = parsedKeystore.version &&
      parsedKeystore.id &&
      parsedKeystore.address &&
      parsedKeystore.crypto

    return isValidKeystore
  }

  handleLogin = () => {
    const { accessType, keystore, password, privateKey } = this.state

    if (accessType == 'privateKey') {
      this.integrateWallet(privateKey)
      console.log("1");
      window.location.reload();
      console.log("2");
      return
    }
    try {
      const { privateKey: privateKeyFromKeystore } = caver.klay.accounts.decrypt(keystore, password)
      this.integrateWallet(privateKeyFromKeystore)
      
    } catch (e) {
      this.setState({ keystoreMsg: `Password doesn't match.` })
    }
  }

  getWallet = () => {
    
   
    if (caver.klay.accounts.wallet.length) {

      return caver.klay.accounts.wallet[0]
    } else {
      const walletFromSession = sessionStorage.getItem('walletInstance')
      try {
        caver.klay.accounts.wallet.add(JSON.parse(walletFromSession))
        // var walletInstance = this.getWallet();
        // console.log("getWallet : "+ walletInstance.address);
      } catch (e) {
        sessionStorage.removeItem('walletInstance')
      }
      return caver.klay.accounts.wallet[0]
    }
  }

  integrateWallet = (privateKey) => {
    const walletInstance = caver.klay.accounts.privateKeyToAccount(privateKey)
    caver.klay.accounts.wallet.add(walletInstance)
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance))
    this.reset()
  }

  removeWallet = () => {
    caver.klay.accounts.wallet.clear()
    sessionStorage.removeItem('walletInstance')
    this.reset()
    window.location.reload()
  }

  toggleAccessType = () => {
    const { accessType } = this.state
    this.setState({
      accessType: accessType === 'privateKey' ? 'keystore' : 'privateKey'
    }, this.reset)
  }

  componentDidMount() {
    window.addEventListener("scroll", this.changeColor);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.changeColor);
  }

  changeColor = () => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      this.setState({
        color: "bg-info"
      });
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      this.setState({
        color: "navbar-transparent"
      });
    }
  }

  toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  }

  onCollapseExiting = () => {
    this.setState({
      collapseOut: "collapsing-out"
    });
  }

  onCollapseExited = () => {
    this.setState({
      collapseOut: ""
    });
  }

  scrollToDownload = () => {
    document
      .getElementById("download-section")
      .scrollIntoView({ behavior: "smooth" });
  }

  toggleModal = modalState => {
    this.setState({
      [modalState]: !this.state[modalState]
    });
  }

  render() {
    var { keystore, keystoreMsg, keystoreName, accessType } = this.state;
    var walletInstance = this.getWallet();
    const { privateKey } = this.state

    if (walletInstance) {
      return (
        <Navbar
          className={"fixed-top " + this.state.color}
          color-on-scroll="100"
          expand="lg">
          <Container>
            <div className="navbar-translate">
              <NavbarBrand
                to="/"
                tag={Link}
                id="navbar-brand">
                <span>DM_Plus • </span>
              
              </NavbarBrand>
              <button
                aria-expanded={this.state.collapseOpen}
                className="navbar-toggler navbar-toggler"
                onClick={this.toggleCollapse}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <Collapse
              className={"justify-content-end " + this.state.collapseOut}
              navbar
              isOpen={this.state.collapseOpen}
              onExiting={this.onCollapseExiting}
              onExited={this.onCollapseExited}
            > 
              <div className="navbar-collapse-header">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    
                  DM_Plus•
                    
                  </Col>
                  <Col className="collapse-close text-right" xs="6">
                    <button
                      aria-expanded={this.state.collapseOpen}
                      className="navbar-toggler"
                      onClick={this.toggleCollapse}
                    >
                      <i className="tim-icons icon-simple-remove" />
                    </button>
                  </Col>
                </Row>
              </div>

              <Nav navbar>
                <NavItem className="p-0">
                  <NavLink
                    tag={Link} to="/new-page">
                    <p>for USER</p>
                  </NavLink>
                </NavItem>

               
                
                <Button
                className="btn-tooltip"
                color="success"
                id="tooltip789511871"
                size="sm"
              >
             <Link to="my-page">
              <i className="tim-icons icon-single-02 text-neutral" />
              </Link>
              </Button>
              <UncontrolledTooltip
                delay={0}
                placement="bottom"
                target="tooltip789511871"
              >
                             <Link to="my-page">
              <i className="tim-icons icon-single-02 text-neutral" />
              </Link>
              {walletInstance.address}
              </UncontrolledTooltip>
                <Button size="sm" color="secondary" onClick={this.removeWallet}>Logout</Button>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      )
    }

  }
}

export default ComponentsNavbar;