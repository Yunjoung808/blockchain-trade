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
            
        <Card className="card-register">
            <CardHeader>
                <CardImg
                alt="..."
                src={require("assets/img/square-purple-1.png")}
                />
                <CardTitle tag="h4" className="text-neutral">Login for user</CardTitle>
            </CardHeader>
            <div className="space-50"></div>
            <CardBody>
                <Form className="form" > 
                    <Row>
                        <Col className="text-center">
                        <h2>구글 로그인</h2>
                        </Col>
                        <Col className="text-center">
                        <h2>지갑 계정이 있으신가요?</h2>
                        </Col>
                        <Col className="text-center">
                        <h2>지갑 계정이 없으신가요?</h2>
                        </Col>
                    </Row>
                    <Row>    
                        <Col className="text-center" ><Login/></Col>
                        {/* wallet login part */}
                        <Col className="text-center">
                            <Button color="success" onClick={() => this.toggleModal("formModal")} > Login </Button>
                            <Modal
                            modalClassName="modal-black"
                            isOpen={this.state.formModal}
                            toggle={() => this.toggleModal("formModal")}
                            >
                            <div className="modal-header justify-content-center">
                                <Button
                                className="close"
                                onClick={() => this.toggleModal("formModal")}
                                >
                                <i className="tim-icons icon-simple-remove text-white" />
                                </Button>
                                <div className="text-muted text-center ml-auto mr-auto">
                                <h3 className="mb-0">Login </h3>
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="btn-wrapper text-center">
                                </div>
                                <Form role="form">
                                <Fragment>
                                    {accessType === 'keystore'
                                    // View 1: Access by keystore + password.
                                    ? (
                                        <Fragment>
                                        <FormGroup className="mb-3">
                                            <InputGroup
                                            className={classnames("input-group-alternative", {
                                                "input-group-focus": this.state.emailFocus
                                            })}
                                            >
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                <i className="tim-icons icon-email-85" />
                                                </InputGroupText>
                                            </InputGroupAddon>

                                            <Input
                                                placeholder="Keystore"
                                                id="keystore"
                                                type="keystore"
                                                onChange={this.handleImport}
                                                accept=".json"
                                                onFocus={e => this.setState({ emailFocus: true })}
                                                onBlur={e => this.setState({ emailFocus: false })}
                                            />
                                            <label className="Auth__button" htmlFor="keystore"></label>
                                            <input 
                                                className="Auth__file"
                                                id="keystore"
                                                type="file"
                                                onChange={this.handleImport}
                                                accept=".json"
                                            />
                                            <p className="Auth__fileName">
                                            {keystoreName}
                                            </p>
                                            </InputGroup>
                                        </FormGroup>
                                        <FormGroup>
                                            <InputGroup
                                            className={classnames("input-group-alternative", {
                                                "input-group-focus": this.state.passwordFocus
                                            })}
                                            >
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                <i className="tim-icons icon-key-25" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                id="input-password"
                                                name="password"
                                                placeholder="Password"
                                                type="password"
                                                onChange={this.handleChange}
                                                onFocus={e => this.setState({ passwordFocus: true })}
                                                onBlur={e => this.setState({ passwordFocus: false })}
                                            />
                                            </InputGroup>
                                        </FormGroup>
                                        </Fragment>
                                        )
                                        : (
                                        <Fragment>
                                        <FormGroup>
                                            <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                <i className="tim-icons icon-lock-circle" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                id="input-privateKey"
                                                name="privateKey"
                                                placeholder="privateKey"
                                                type="privateKey"
                                                onChange={this.handleChange}
                                                onFocus={e => this.setState({ passwordFocus: true })}
                                                onBlur={e => this.setState({ passwordFocus: false })}
                                            />
                                            </InputGroup>
                                        </FormGroup>
                                        </Fragment>
                                        ) 
                                    }

                                    <p className="Auth__keystoreMsg">{keystoreMsg}</p>
                                    <p className="Auth__toggleAccessButton" onClick={this.toggleAccessType}>
                                    {accessType === 'privateKey'
                                        ? 'Want to login with keystore? (click)'
                                        : 'Want to login with privatekey? (click)'
                                    }
                                    </p>
                                    <FormGroup check className="mt-3">
                                    <Label check>
                                        <Input defaultChecked type="checkbox" />
                                        <span className="form-check-sign" />
                                    Remember me!
                                    </Label>
                                    </FormGroup>
                                    <div className="text-center">
                                    <Button className="my-4" color="success" type="button" onClick={this.handleLogin}>
                                            Login
                                    </Button>
                                    </div>
                                </Fragment>
                                </Form>
                            </div>
                            </Modal>
                        </Col>
                        {/* wallet sign up part */}
                        <Col className="text-center">
                        <Button color="primary" onClick={() => this.toggleModal("formModal2")}>Sign up</Button>
                        <Modal
                    modalClassName="modal-black"
                    isOpen={this.state.formModal2}
                    toggle={() => this.toggleModal("formModal2")}
                    >
                        <div className="modal-header justify-content-center">
                        <Button className="close" onClick={() => this.toggleModal("formModal2")}>
                            <i className="tim-icons icon-simple-remove text-white" />
                        </Button>
                        <div className="text-muted text-center ml-auto mr-auto">
                            <h3 className="mb-0">Sign up </h3>
                        </div>
                        </div>
                        <div className="modal-body">
                            <div className="btn-wrapper text-center"></div>
                            <Form role="form">
                                <FormGroup className="mb-3">
                                    <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="tim-icons icon-lock-circle" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        className="SignupForm__input"
                                        placeholder="Generate Private Key to Sign up"
                                        value={privateKey || ''}
                                        label="Private key"
                                        readOnly
                                    />
                                    </InputGroup>
                                    <div className="text-center">
                                        <Button
                                        color="primary"
                                        className="SignupForm__button"
                                        title="Generate Private key"
                                        onClick={this.generatePrivateKey}
                                        >Generate Private key
                                        </Button>
                                    </div>
                                </FormGroup>
                            </Form>
                        </div>
                    </Modal>
                    </Col>  
                    </Row>
                    <div className="space-50"></div>
                </Form>
            </CardBody>
        </Card>
                
        );
    }
}

export default WalletCardForUser;