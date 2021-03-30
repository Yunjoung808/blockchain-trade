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
import { post } from "axios";

const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
const userContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

class MainCompany extends React.Component {
    state = {
        squares1to6: "",
        squares7and8: "",
      };

    constructor(props) {
      super(props)
      this.state = {
        email:'',
        userSeq:'',
        hashKey:''
      };
    }

  componentDidMount() {
    document.body.classList.toggle("index-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("index-page");
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
  
  //데이터 받아서 서버로 보내기
  addInfo = () => {
    const url = 'http://localhost:5000/api/info';
    const formData = new FormData();
    formData.append('email', this.state.email);
    return post(url, formData);
  }

  handleValueChange = (e) => {
    let nextStage = {};
    nextStage[e.target.name] = e.target.value;
    this.setState(nextStage);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    //데이터 서버로 보내기
    this.addInfo()
        .then((response)=>{
          console.log(response.data);
        })
    
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
                                        <Input placeholder="Search..." placeholder="Email" type="text" name="email" value={this.state.email}
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
                  
                <div class="space-70"></div>
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
          <Footer/>
        </div>
      </>
      );
    }
  }
}

export default MainCompany;