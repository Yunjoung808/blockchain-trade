import React ,{ Component, Fragment }  from "react";
import CompanyNavbar from 'components/Navbars/CompanyNavbar';
// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  InputGroup,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
  Table
} from "reactstrap";
import "assets/css/nucleo-icons.css";
// core components

import Footer from "components/Footer/Footer.js";
import { Link } from "react-router-dom";
import Caver from "caver-js";
import InputGroupText from "reactstrap/lib/InputGroupText";
import Axios from 'axios';


const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
const userContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const rewardContract = new caver.klay.Contract(DEPLOYED_ABI_REWARDTOKEN, DEPLOYED_ADDRESS_REWARDTOKEN);
const Crypto = require('crypto-js');

class MainCompany extends React.Component {

    constructor(props) {
      super(props)
      this.handleValueChange = this.handleValueChange.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.getInfoDB = this.getInfoDB.bind(this);
      this.getInfo = this.getInfo.bind(this);

      this.toggleModalDemo = this.toggleModalDemo.bind(this);
      this.state = {
        searchKeyword:'',
        modalDemo: false,
        userInfo:[],
        encData : '',
        decData : '',
        isBool:'true',
        isBool2:'true',
        receipt:'',
        receipt2:''
      };
    }
   
  toggleModalDemo(){
      this.setState({
          modalDemo: !this.state.modalDemo
      });
  }
  componentDidMount() {
    document.body.classList.toggle("index-page"); 
  }
  componentWillUnmount() {
    document.body.classList.toggle("index-page");
  }
  handleValueChange = (e) => {
    let nextStage = {};
    nextStage[e.target.name] = e.target.value;
    this.setState(nextStage);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.getInfoDB();
  }

  decrypt(data, key){
    return Crypto.AES.decrypt(data, key).toString(Crypto.enc.Utf8);
  }

  //DB에서 검색한 User의 데이터 받아오기
  getInfoDB = () => {
    const url = 'http://localhost:5000/api/user/getUserByEmail';
    const body = { searchKeyword:this.state.searchKeyword };
    Axios.post(url, body)
        .then(res => this.setState({userInfo: res.data}))
        .catch(function (error) {
            console.log(error);
        });
  }

  //블록체인에서 암호화된 데이터 받아와
  getInfo = () => {
    let user_id = this.state.userInfo[0]._id
    let userSeq = user_id.replace(/[^0-9]/g,'');
    userContract.methods.getUserInfo(userSeq)
                        .call()
                        .then(res => this.setState({ encData : res}))             
  }

  decryptUserData = () => {
    let data = this.state.encData;
    console.log("암호 데이터 :", data)
    let key = this.state.userInfo[0]._id;
    console.log("암호 키 :", key)
    let decData = this.decrypt(data, key);
    console.log("복호화 데이터 (암호 데이터 + 암호 키) :", decData)
    this.setState({decData:decData})

    

    //결제창 닫아주기
    this.setState({modalDemo: !this.state.modalDemo});
    this.setState({isBool2 : false})
  }

  //Company->DM_Plus 결제
  sendToken = () => {
    this.setState({isBool : false})
    this.setState({searchKeyword:''})

    //토큰 보내기
    const feePayer = caver.klay.accounts.wallet.add('0x262bf45650ccff9c2bb4d74533d3bc1d33462b773f273c60a7c77fa1f06eefaf'); //DM_Plus 지갑 주소
    const user = this.getWallet();

    rewardContract.methods.transfer(feePayer.address, 20).send({
      from: user.address, 
      gas: '2500000'
    }).then(res => this.setState({receipt:res.transactionHash}))

    this.getInfo();
  }

  onClick = (e) => {
    e.preventDefault(); 
    var scope1 = 'https://baobab.scope.klaytn.com/tx/';
    var scope2 = this.state.receipt;
    var scope3 = '?tabId=eventLog';
    window.location.href=scope1+scope2+scope3;
}

  //로그인된 wallet address 
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

  render() {
    var { isBool } = this.state;
    var { isBool2 } = this.state;
    var walletInstance = this.getWallet();
    if (walletInstance) { 
      return (
        <>
          <div className="wrapper">
            <div className="page-header">
              <div className="page-header-image" />
                <div className="content">
                  <CompanyNavbar />
                  <img alt="..." className="path" src={require("assets/img/blob.png")} />
                  <Container> 
                    <Row>
                      <Col className="item"><hr className="line-success"></hr></Col>
                      <div className="space-50"></div>
                    </Row>
                    <Card>
                      <CardBody>
                        <form onSubmit={this.handleFormSubmit}>
                            <FormGroup>
                              <Row>
                                <Col className="col-sm-8">
                                  <InputGroup>
                                    <InputGroupText>
                                      <i className="tim-icons icon-email-85"/>
                                    </InputGroupText>
                                    <Input placeholder="Search..." type="text" name="searchKeyword" value={this.state.searchKeyword}
                                          onChange={this.handleValueChange} className="form-control"/>
                                  </InputGroup>
                                </Col>
                                <Col className="col-sm-4">
                                  <Button onClick={this.toggleModalDemo}  className="btn btn-success" type="submit">Search</Button>
                                    {isBool ?
                                    <Modal isOpen={this.state.modalDemo} toggle={this.toggleModalDemo}>
                                        <div className="modal-header text-center">
                                          <h3 className="modal-title text-center">
                                            DM_Plus Payment
                                          </h3>
                                          <button
                                            type="button"
                                            className="close"
                                            data-dismiss="modal"
                                            aria-hidden="true"
                                            onClick={this.toggleModalDemo}
                                            >
                                            <i className="tim-icons icon-simple-remove" />
                                          </button>
                                        </div>
                                        <ModalBody className="text-center">
                                          <p><u>{this.state.searchKeyword}</u>님의  Data를 조회하시겠습니까?</p>
                                            <Col className="mt-5 col-12">
                                              <Table>
                                                <thead>
                                                    <tr>
                                                        <th className="text-default" colSpan="3">User</th>
                                                        <th className="text-default" colSpan="3">Token</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                  <tr>
                                                      <td colSpan="3"><p><u>{this.state.searchKeyword}</u></p></td>
                                                      <td colSpan="3"><p className="text-center">20</p></td>
                                                  </tr>
                                                </tbody>
                                                <tfoot>
                                                  <tr>
                                                      <th  colSpan="3"><p className="text-center">Total</p></th>
                                                      <th className="text-default" colSpan="3">20 Token</th>
                                                  </tr>
                                                </tfoot>
                                              </Table>
                                            </Col>
                                            <Row colSpan="3">
                                              <Col>
                                                <Button color="secondary" onClick={this.sendToken}>
                                                  결제하기
                                                </Button>
                                              </Col>
                                            </Row>
                                        </ModalBody>
                                      </Modal>
                                      :<Modal isOpen={this.state.modalDemo} toggle={this.toggleModalDemo}>
                                        <div className="modal-header text-center">
                                          <h3 className="modal-title text-center " id="exampleModalLabel">
                                            DM_Plus Payment
                                          </h3>
                                        </div>
                                        <ModalBody className="text-center">
                                            <p>결제가 완료되었습니다.</p> 
                                            <div><p>{this.state.receipt}</p></div>
                                            <Button color="success" onClick={this.onClick}>Go To Klaytn Scope  <i className="tim-icons icon-minimal-right"/></Button>
                                            <Row colSpan="3">
                                              <Col>
                                                <Button color="secondary" onClick={this.decryptUserData}>
                                                  닫기
                                                </Button>
                                              </Col>
                                            </Row>
                                        </ModalBody>
                                      </Modal>}
                                    </Col>
                                </Row>
                            </FormGroup>
                          </form>
                        </CardBody>
                    </Card>
                    {isBool2 ?
                      <Fragment>
                        <div className="space-50"></div>
                      </Fragment>
                      :<Fragment>
                        <Row>
                          <Col className="item"><hr className="line-success"></hr></Col>
                          <div className="space-50"></div>
                        </Row>
                        <Card>
                          <CardBody>
                            <Row>
                              <Col className="align-self-center col-md-3">
                                <Badge color="success">My Wallet Address</Badge>
                              </Col>
                              <Col className="align-self-center col-md-8">
                                <p className="text-neutral"><b>{walletInstance.address}</b></p>
                              </Col>
                            </Row>
                            <div className="space-50"/>
                            <Row>
                              <Col className="align-self-center col-md-3">
                                <h4><b>암호 데이터</b></h4>
                              </Col>
                              <Col className="align-self-center col-md-8">
                                <p className="text-neutral"><b>{this.state.encData}</b></p>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="align-self-center col-md-3">
                                <h4><b>암호 키</b></h4>
                              </Col>
                              <Col className="align-self-center col-md-8">
                                <p className="text-neutral"><b>{this.state.userInfo[0]._id}</b></p>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="align-self-center col-md-3">
                                <h4><b>복호화 데이터</b></h4>
                              </Col>
                              <Col className="align-self-center col-md-8">
                                <p className="text-neutral"><b>{this.state.decData}</b></p>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="align-self-center col-md-3">
                                <h4><b>Scope</b></h4>
                              </Col>
                              <Col>
                               <Button color="success" onClick={this.onClick}>Go To Klaytn Scope  <i className="tim-icons icon-minimal-right"/></Button>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Fragment>
                      }
                  </Container>
                </div>
              </div>
            <div class="space-70"></div>
          <div class="space-70"></div>  
        <Footer/>
      </div>
    </>
    );
  }
}
}

export default MainCompany;