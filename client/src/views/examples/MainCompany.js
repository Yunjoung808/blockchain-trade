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
  Input
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
    state = {
        squares1to6: "",
        squares7and8: ""
      };

    constructor(props) {
      super(props)
      this.state = {
        searchKeyword:'',
        userInfo:[]
      };
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
    this.setState({
      searchKeyword:''
    })
  }

  //DB에서 검색한 User의 데이터 받아오기
  getInfoDB = () => {
    const url = 'http://localhost:5000/api/user/getUser';
    const body = { searchKeyword:this.state.searchKeyword };
    Axios.post(url, body)
        .then(res => console.log(res.data[0]))
        .then(res => this.setState({userInfo: res}))
        .catch(err => console.log("err:", err))
  }


  //블록체인에서 암호화된 데이터 받아오기
  getInfo = (userSeq) => {
    const feePayer = caver.klay.accounts.wallet.add('0x2f1c41403a47679d6a152bb6edf610888febbefb31db1601fc2bc6c45880b1a8'); //DM_Plus 지갑 주소
    userContract.methods.getUserInfo(userSeq).send({
      from: feePayer.address,
      gas:'250000'
    }).then(
      console.log(userInfo[_userSeq].userInfo)
      //DB에서 암호 키 가져와서 복호화 -> 화면에 보여주기

    )
  }

  //Company->DM_Plus 결제
  sendToken = (e) => {
    const feePayer = caver.klay.accounts.wallet.add('0x2f1c41403a47679d6a152bb6edf610888febbefb31db1601fc2bc6c45880b1a8'); //DM_Plus 지갑 주소
      rewardContract.methods.transferFrom(user.address,feePayer.address,  20).send({
        from: feePayer.address, 
        gas: '25000000'
      }).then(function(receipt){
        alert("결제 완료 :"+receipt.transactionHash)
      })
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

    // let Items =  this.state.mission.map(item => {
    //   if (item._id ==='index') return( <></>)
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
    //                     <td className="text-right">{item.title}</td>
    //                   </tr>
    //                   <tr>
    //                   <td className="text-left">
    //                     <i class="tim-icons icon-money-coins text-primary"/>&nbsp;&nbsp;
    //                     <p className="category text-primary d-inline">Price</p>
    //                   </td>
    //                   <td className="text-right">{item.token} Token</td>  
    //                 </tr>
    //                 <tr>
    //                   <td className="text-left">
    //                   </td>
    //                   <td className="text-right">
    //                     <Button className="btn-round btn-sm" color="primary" type="button" Link tag={Link} to="/register-page"
    //                             onClick={(e) => {e.preventDefault(); window.location.href='/register-page?index='+item.index;}}>
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
                                    <Button type="button" className="btn btn-success" type="submit">Search</Button>
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
                    <Badge color="success">Wallet Address</Badge>
                    </Col>
                    <Col className="align-self-center col-md-8">
                    <p className="text-neutral"><b>{walletInstance.address}</b></p>
                    <p className="text-neutral"><b>{this.state.userInfo}</b></p>
                    </Col>
                  </Row>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    {/* {Items} */}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                  </CardBody>
                </Card>
              
                <div
                  className="index-page square square-3"
                  id="square3"
                  style={{ transform: this.state.squares1to6 }}
                />
                <div
                  className="square square-6"
                  id="square6"
                  style={{ transform: this.state.squares1to6 }}
                />
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