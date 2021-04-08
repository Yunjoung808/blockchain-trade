import React from "react";
import classnames from "classnames";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";
import UserNavbar from 'components/Navbars/UserNavbar';
import Footer from "components/Footer/Footer.js";
import { Link } from "react-router-dom";
import { post } from "axios";
import Caver from "caver-js";
import "assets/css/nucleo-icons.css";
import Axios from 'axios';


const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
const userContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const rewardContract = new caver.klay.Contract(DEPLOYED_ABI_REWARDTOKEN, DEPLOYED_ADDRESS_REWARDTOKEN);
const Crypto = require('crypto-js');


class RegisterPage extends React.Component {

  constructor(props){
    super(props);
    this.getInfoDB = this.getInfoDB.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      _id:'',
      name:'',
      email:'',
      visible: true,
      userInfo:[]
    }
  }

  onDismiss = () => {
    this.setState({ visible: false });
  };
  componentDidMount() {
    document.body.classList.toggle("register-page");
    this.getInfoDB();
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }


  updateAuthdate = () => {
    var walletInstance = this.getWallet();
    const url = 'http://localhost:5000/api/user/authInfo';
    const body = { authName : this.state.name, authEmail : this.state.email, walletAddress : walletInstance.address };
    Axios.post(url, body)
  }

  //암호화된 데이터 받아서 블록체인에 올리기
  uploadInfo = (enc) => {
    let complpage=this;
    let user_id = this.state.userInfo[0]._id
    let userSeq = user_id.replace(/[^0-9]/g,'');

    const user = this.getWallet();
    const feePayer = caver.klay.accounts.wallet.add('0x2f1c41403a47679d6a152bb6edf610888febbefb31db1601fc2bc6c45880b1a8'); // DM_Plus 지갑주소

    userContract.methods.setUserInfo(enc,userSeq).send({
      from: feePayer.address,
      gas: '250000'
      }).then(function(receipt){
        if (receipt.transactionHash){
          alert("업로드 성공 : "+ receipt.transactionHash);

        
    rewardContract.methods.transfer(feePayer.address, 20).send({
      from: feePayer.address, 
      gas: '2500000'
      }).then(function(receipt){
        alert("토큰 지급 :"+receipt.transactionHash)
        complpage.props.history.push({
          pathname:"/complete-page",
          state:{
            sell_receipt:receipt.transactionHash,
            block_number:receipt.blockNumber
          }
        })
      })

    }
  })
}

//데이터 암호화
encrypt(data, key){
  return Crypto.AES.encrypt(data, key).toString();
}

//데이터 복호화
decrypt(data, key){
  return Crypto.AES.decrypt(data, key).toString(Crypto.enc.Utf8);
}


handleValueChange = (e) => {
  let nextStage = {};
  nextStage[e.target.name] = e.target.value;
  this.setState(nextStage);
}

getInfoDB = () => {
  var walletInstance = this.getWallet();
  const url = 'http://localhost:5000/api/user/getUserByWallet';
  const body = { walletAddress: walletInstance.address };
  Axios.post(url, body)
      .then(res => this.setState({userInfo: res.data}))
      .catch(function (error) {
          console.log(error);
      });
}


//'등록하기' 클릭하면 실행
handleFormSubmit = (e) => {
    e.preventDefault();

    //검색 후 검색창 지우기
    this.setState({
      name:'',
      email:''
    })

    //데이터 암복호화
    let data = this.state.name +','+ this.state.email
    let key = this.state.userInfo[0]._id
    let enc = this.encrypt(data, key);
    let dec = this.decrypt(enc, key);

    console.log("key:",key)
    console.log("enc : ", enc);
    console.log("dec : ", dec);
    

    //authEmail, authName DB update
    this.updateAuthdate();

    //enc 블록체인에 올리기 
    this.uploadInfo(enc);
}

  //로그인된 지갑 주소 받기
  getWallet = () => {
  if (caver.klay.accounts.wallet.length) {
    return caver.klay.accounts.wallet[0]
  } else {
    const walletFromSession = sessionStorage.getItem('walletInstance');
    caver.klay.accounts.wallet.add(JSON.parse(walletFromSession));
    return caver.klay.accounts.wallet[0];
  }
}

  //화면
  render() {
    return (  
      <>
        <UserNavbar />
        <div className="wrapper">
          <div className="page-header" style={{display : 'inline'}}>
            <Row className="row-grid justify-content align-items text-left">
              <Col lg="12" md="6">
                <h1 className="text-white"></h1><br/>
                <div className="btn-wrapper"></div>
              </Col>
            </Row>
            <div className="section">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                 <form onSubmit={this.handleFormSubmit}>
                  <Card className="card-register">
                    <CardHeader>
                      <CardImg
                        alt="..."
                        src={require("assets/img/square-purple-1.png")}
                      />
                      <CardTitle tag="h4">Register</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form className="form" >
                      <div className="space-50"></div>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons icon-single-02" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Full Name"
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleValueChange}
                          />
                        </InputGroup>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons icon-email-85" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Email"
                            type="text"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleValueChange}
                          />
                        </InputGroup>
                        <FormGroup check className="text-left">
                          <Label check>
                            <Input type="checkbox" />
                            <span className="form-check-sign" />I agree to the{" "}
                            <a
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              terms and conditions
                            </a>
                            .
                          </Label>
                        </FormGroup>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button className="btn-round" color="primary" size="lg" type="submit" >
                        등록하기 <i className="tim-icons icon-minimal-right"/>
                      </Button>
                      <div className="space-50"></div>
                    </CardFooter>
                  </Card>
                  </form>
                </Col>
              </Row>
              <div className="register-bg" />
              <div
                className="square square-2"
                id="square2"
              />
              <div
                className="square square-3"
                id="square3"
              />
              <div
                className="square square-4"
                id="square4"
              />
              <div
                className="square square-5"
                id="square5"
              />
              <div
                className="square square-6"
                id="square6"
              />
              <div
                className="square square-7"
                id="square7"
              />
            </Container>
            </div>
            </div>
          </div>
          <Footer/>
      </>
    );
  }
}

export default RegisterPage;