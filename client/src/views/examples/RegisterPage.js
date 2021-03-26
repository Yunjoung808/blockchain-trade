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
  Col,
} from "reactstrap";
import UserNavbar from 'components/Navbars/UserNavbar';
import Footer from "components/Footer/Footer.js";
import { Link } from "react-router-dom";
import { post } from "axios";

import Caver from "caver-js";
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
const userContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

const Crypto = require('crypto-js');


class RegisterPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name:'',
      email:''
    }
  }

  componentDidMount() {
    document.body.classList.toggle("register-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }

  addInfo = () => {
    const url = 'http://localhost:5000/api/info';
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('email', this.state.email);

    return post(url, formData);
  }

  uploadInfo = (enc) => {
    console.log(enc);
    userContract.methods.setUserInfo(enc,200);
  }

  encrypt(data, key){
    return Crypto.AES.encrypt(data, key).toString();
  }
  
  decrypt(data, key){
    return Crypto.AES.decrypt(data, key).toString(Crypto.enc.Utf8);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    //데이터 암복호화
    let data = this.state.name +','+ this.state.email
    let key = "dmplus";

    let enc = this.encrypt(data, key);
    console.log("enc : ", enc);

    let dec = this.decrypt(enc, key);
    console.log("dec : ", dec);

    //데이터 서버로 보내기
    this.addInfo()
        .then((response)=>{
          console.log(response.data);
        })

    //enc 블록체인에 올리기 
    this.uploadInfo(enc);
   
    //토큰 지급 컨트랙트 발동
  
  }

  handleValueChange = (e) => {
    let nextStage = {};
    nextStage[e.target.name] = e.target.value;
    this.setState(nextStage);
  }

  getWallet = () => {
    if (caver.klay.accounts.wallet.length) {
      return caver.klay.accounts.wallet[0]
    } else {
      const walletFromSession = sessionStorage.getItem('walletInstance');
      caver.klay.accounts.wallet.add(JSON.parse(walletFromSession));
      return caver.klay.accounts.wallet[0];
    }
  }

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
                      {/* <Button className="btn-round" color="primary" size="lg" type="submit" Link tag={Link} to="/complete-page">
                        등록하기
                      </Button> */}
                      <Button className="btn-round" color="primary" size="lg" type="submit" >
                        등록하기
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