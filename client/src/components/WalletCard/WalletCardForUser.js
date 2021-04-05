import React, {Fragment} from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { Button, Card, CardBody, Badge, CardImg, CardTitle, CardFooter, CardHeader,   Row, Col, FormGroup, Modal, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Label } from "reactstrap";
import Caver from "caver-js";
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
import Login from "components/GoogleLogin/GoogleLoginForUser.js";


class WalletCardForUser extends React.Component {
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
          window.location.reload();
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

    render(){
        var { keystore, keystoreMsg, keystoreName, accessType } = this.state;
        var walletInstance = this.getWallet();
        const { privateKey } = this.state
  
        return(
            
          <Card>
          <CardBody>
          <Row>
            <Col className="align-self-center col-md-3">
            <Badge color="primary">Wallet Address</Badge>
            </Col>
            <Col className="align-self-center col-md-8">
            <p className="text-neutral"><b>
            {walletInstance.address}</b></p>
            </Col>
          </Row>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h4>기록이 없습니다.</h4>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </CardBody>
        </Card>
        );
    }
}

export default WalletCardForUser;