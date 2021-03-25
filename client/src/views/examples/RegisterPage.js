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
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Link } from "react-router-dom";
import Axios from "axios";
import {post} from "axios";
import Caver from "caver-js";
import GoogleLogin from "components/GoogleLogin/GoogleLogin";



const axios = require('axios').default;
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);



class RegisterPage extends React.Component {

  state = {
    squares1to6: "",
    squares7and8: ""
  };
  componentDidMount() {
    document.body.classList.toggle("register-page");

  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
   
  }

  addInfo = () => {
    const url = 'api/info';
    const formData = new FormData();
    formData.append('name', this.state.name);
    formData.append('email', this.state.email);

    return post(url, formData);
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    this.addInfo()
        .then((response)=>{
          console.log(response.data);
        })
  }

  handleValueChange = (e) => {
    let nextStage = {};
    nextStage[e.target.name] = e.target.value;
    this.setState(nextStage);
  }

  // constructor(props){
  //   super(props);
  //   var params = new URLSearchParams(props.location.search);
  //   this.state={
  //     productKey: '',
  //     brand: '',
  //     imgUrl: '',
  //     productName: '',
  //     dateCreated: '',
  //     tokenUri:'',
  //     price:'',
  //     productKey:null,
  //     items :[],
  //     sell_items : [],
  //     all_items: [],
  //     allSell_items: [],
  //     news:{
  //       id           :'',
  //       index        :'',
  //       brand        :'',
  //       productName  :'',
  //       image :'',
  //       tokenUri    :'',
  //       description  :'',
  //       price        :'',
  //       date         :''  
  //     },
  //     value:0,min:0,counter:0,
  //     index:params.get('index')
  //   };

  constructor(props){
    super(props);
    this.state = {
      name:'',
      email:''
    }
  }
    

  //   Axios.get("http://localhost:5000/NewP/new/getNewP?index="+params.get('index'))
  //     .then(response => {
  //         if(response.status==200){
  //           this.setState({
  //             news:response.data[0]
  //           })
              
  //         }else{
  //             console.log(err);
  //         }
  //   })
  // }



  handleItemChange = (e, _tokenIndex) => {
    var tokenIndex=_tokenIndex
    var itemIndex = this.state.items.findIndex(element => element.Id == tokenIndex)
    console.log(itemIndex);
    this.state.items[itemIndex].amount =  e.target.value;
    this.setState({
      items :  this.state.items
    })
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
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            {/* <InputGroupText>
                              <i className="tim-icons icon-lock-circle" />
                            </InputGroupText> */}
                          </InputGroupAddon>
                          {/* <Input
                            placeholder="Password"
                            type="text"
                          /> */}
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
                      <Button className="btn-round" color="primary" size="lg" type="submit" Link tag={Link} to="/complete-page">
                        등록하기
                      </Button>
                      {/* <Button className="btn-round" color="primary" size="lg" type="submit" >
                        등록하기
                      </Button> */}
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
          <Footer />
      </>
    );
  }
}

export default RegisterPage;