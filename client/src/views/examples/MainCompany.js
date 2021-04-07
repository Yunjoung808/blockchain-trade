import React ,{ Component }  from "react";
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
        decData : ''
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
                        .then(
                          res => this.setState({ encData : res})
                          
                          )
  }

  decryptUserData = () => {
    let data = this.state.encData;
    console.log("암호 데이터 :", data)
    let key = this.state.userInfo[0]._id;
    console.log("암호 키 :", key)
    let decData = this.decrypt(data, key);
    console.log("복호화 데이터 (암호 데이터 + 암호 키) :", decData)
  }

  //Company->DM_Plus 결제
  sendToken = () => {
    //결제창 닫아주기
    this.setState({modalDemo: !this.state.modalDemo});
    //검색창 클린
    this.setState({searchKeyword:''})
    //토큰 보내기
    const feePayer = caver.klay.accounts.wallet.add('0x2f1c41403a47679d6a152bb6edf610888febbefb31db1601fc2bc6c45880b1a8'); //DM_Plus 지갑 주소
      rewardContract.methods.transfer(feePayer.address, 20).send({
        from: feePayer.address, 
        gas: '2500000'
      }).then(function(receipt){
        alert("결제 완료 :"+receipt.transactionHash)
      })
      this.getInfo();
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
    // let Items =  this.state.userInfo.map(item => {
    //   if (item._id ==='_id') return( <></>)
    //   return(
    //     <Col className="mt-5 mt-sm-0" sm="3" xs="6">
    //       <div className="card-profile card">
    //         <div className="card-body">
    //             <hr className="line-primary"></hr>
    //               <table className="tablesorter table">
    //                 <tbody>
    //                   <tr>
    //                     <td className="text-left" >
    //                       <i className="tim-icons icon-bag-16  text-primary" ></i> &nbsp;
    //                       <p className="category text-primary d-inline">Auth</p>
    //                     </td>
    //                     <td className="text-right">{item.name}</td>
    //                     <td className="text-right">{item.email} email</td>  
    //                     <td className="text-right">{item.googleId} googleId</td> 
    //                     <td className="text-right">{item._id} userSeq</td> 
    //                   </tr>
    //                 <tr>
    //                   <td className="text-left">
    //                   </td>
    //                   <td className="text-right">
    //                     <Button className="btn-round btn-sm" color="primary" type="button" Link tag={Link} to="/register-page"
    //                             onClick={(e) => {e.preventDefault(); window.location.href='/register-page?index='+item._id;}}>
    //                          <i className="tim-icons icon-minimal-right"/>
    //                     </Button>
    //                   </td>
    //                 </tr>
    //               </tbody>
    //             </table>
    //           </div>
    //       </div>
    //   </Col>
    // )});
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
                                      <Modal isOpen={this.state.modalDemo} toggle={this.toggleModalDemo}>
                                          <div className="modal-header">
                                            <h3 className="modal-title" id="exampleModalLabel">
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
                                              <ModalBody>
                                                  <p>Data를 열람하시겠습니까?</p>
                                                  <Row>
                                                        <Col className="mt-5 col-12">
                                                          <Table className=" table">
                                                              <thead>
                                                                  <tr>
                                                                      <th scope="col"><b><p>User</p></b></th>
                                                                      <th scope="col"><p>Token</p></th>
                                                                  </tr>
                                                              </thead>
                                                              <tbody>
                                                                  <tr>
                                                                      <td><p>{this.state.searchKeyword}</p></td>
                                                                      <td><p>20</p></td>
                                                                  </tr>
                                                              </tbody>
                                                              <tfoot>
                                                                  <tr>
                                                                      <th >Total</th>
                                                                      <th className=" text-default" colSpan="3">20 Token</th>
                                                                  </tr>
                                                              </tfoot>
                                                          </Table>
                                                        </Col>
                                                    </Row>
                                          </ModalBody>
                                          <ModalFooter className="text-center">
                                              <Row>
                                                <Col>
                                                <Button color="secondary" onClick={this.sendToken}>
                                                  결제하기
                                                </Button>
                                                </Col>
                                              </Row>
                                              
                                          </ModalFooter>
                                      </Modal>
                                </Col>
                            </Row>
                        </FormGroup>
                      </form>
                    </CardBody>
                </Card>
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
                        {this.state.encData}
                        {/* {Items} */}
                      </CardBody>
                    </Card>
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