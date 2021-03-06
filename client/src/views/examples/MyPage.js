import React , { Component } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  ListGroupItem,
  ListGroup,
  Container,
  Row,
  Badge,
  Col,
  UncontrolledTooltip,
  UncontrolledCarousel
} from "reactstrap";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footer/Footer.js";
import { Link } from "react-router-dom";
import Caver from "caver-js";


const axios = require('axios').default;
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
const yttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


class Mypage extends React.Component {
  state = {
    squares1to6: "",
    squares7and8: "",
  };

  componentDidMount() {
    document.body.classList.toggle("register-page");
    document.documentElement.addEventListener("mousemove", this.followCursor);
    var walletInstance = this.getWallet()
    var balance = parseInt(this.getBalanceOf(walletInstance.address));
    console.log("balance :",balance);
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
    document.documentElement.removeEventListener(
      "mousemove",
      this.followCursor
    );
  }

  followCursor = event => {
    let posX = event.clientX - window.innerWidth / 2;
    let posY = event.clientY - window.innerWidth / 6;
    this.setState({
      squares1to6:
        "perspective(500px) rotateY(" +
        posX * 0.05 +
        "deg) rotateX(" +
        posY * -0.05 +
        "deg)",
      squares7and8:
        "perspective(500px) rotateY(" +
        posX * 0.02 +
        "deg) rotateX(" +
        posY * -0.02 +
        "deg)"
    });
  };
  
  constructor(props) {
    super(props);
    this.displayMyTokensAndSale()
    this.state = {
      tabs: 1,
      file : [],
      image : require("assets/img/lora.jpg"),
      videoId: '',
      title: '',
      imgUrl: '',
      author: '',
      dateCreated: '',
      tokenUri:'',
      price:'',
      productKey:null,
      items :[],
      sell_items : [],
      all_items: [],
      DOM_items: []
    }
  }

  handleFileOnChange = (event) => {
    event.preventDefault();
    
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      this.state.file.push(file)
      this.setState({image : reader.result});
    }
    reader.readAsDataURL(file);
  }
  state = {};
  
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

  displayMyTokensAndSale = async () => {       
    var walletInstance = this.getWallet()
    var balance = parseInt(await this.getBalanceOf(walletInstance.address));
    console.log(balance);
    if (balance === 0) {
      alert("?????? ????????? ????????? ????????????.");
    } else {

      this.state.items = [];//?????????
      this.state.sell_items = [];//?????????
      for (var i = 0; i < balance; i++) {
      (async () => {//?????? ??????????????? ?????? ????????? ??????
          var tokenIndex = await this.getTokenOfOwnerByIndex(walletInstance.address, i);
          var tokenUri = await this.getTokenUri(tokenIndex);
          var ytt = await this.getYTT(tokenIndex);
          var metadata = await this.getMetadata(tokenUri);
          var price = await this.getTokenPrice(tokenIndex);
          console.log(tokenIndex, tokenUri, price)
          this.renderMyTokens(tokenIndex, ytt, metadata, isApproved, price);   
          if (parseInt(price) > 0) {
            this.renderSellTokens(tokenIndex, ytt, metadata, price);
          }
      })();      
      }
    }
  }

  renderMyTokens = (tokenIndex, ytt, metadata, isApproved, price) => {

    var _tokenIndex = tokenIndex;  
    var _url = metadata.properties.image.description;
    var _brand = metadata.properties.description.description;
    var _productKey = metadata.properties.name.description;
    var _productName = ytt[0];
    var _dateCreated = ytt[1];
    var _price = caver.utils.fromPeb(price, 'KLAY')
  
    var currentState = this.state;
    currentState.items.push({
      index : _tokenIndex,
      Url : _url,
      Id : _productKey,
      brand : _brand,
      productName : _productName,
      date : _dateCreated,
      amount : _price
    })
    this.setState(currentState);
    }
  
  renderSellTokens = (tokenIndex, ytt, metadata, price) => {   
    var _tokenIndex = tokenIndex;  
    var _url = metadata.properties.image.description;
    var _brand = metadata.properties.description.description;
    var _productKey = metadata.properties.name.description;
    var _productName= ytt[0];
    var _dateCreated = ytt[1];
    var _price = caver.utils.fromPeb(price, 'KLAY');

    // if (parseInt(price) > 0) {
      var sellState = this.state;
      sellState.sell_items.push({
        index : _tokenIndex,
        Url : _url,
        Id : _productKey,
        brand : _brand,
        productName: _productName,
        date : _dateCreated,
        amount : _price
      })
      this.setState(sellState);
    // } 
  }

  getBalanceOf = async (address) => {
    return await yttContract.methods.balanceOf(address).call();
  }

  getTokenOfOwnerByIndex = async (address, index) => {
    return await yttContract.methods.tokenOfOwnerByIndex(address, index).call();
  }

  getTokenUri = async (tokenIndex) => {
    return await yttContract.methods.tokenURI(tokenIndex).call();
  }

  getYTT = async (tokenIndex) => {
    return await yttContract.methods.getYTT(tokenIndex).call();
  }

  getMetadata = async (tokenUri) => {
    if(~tokenUri.indexOf("http")) {
      tokenUri = tokenUri;
    }
    else {
      tokenUri = "https://ipfs.infura.io/ipfs/" + tokenUri;
    }
  
    return new Promise(function (resolve,reject){
      axios({
        method: 'get',
        url: tokenUri,
      })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(error => reject(error));
      })
  }
  
  getTotalSupply = async () => {
    return await yttContract.methods.totalSupply().call();
  }
  
  getTokenByIndex = async (index) => {
    return await yttContract.methods.tokenByIndex(index).call();
  }

  isApprovedForAll = async (owner, operator) => {
    return await yttContract.methods.isApprovedForAll(owner, operator).call();
  }

  getTokenPrice = async (tokenIndex) => {
    return await tsContract.methods.tokenPrice(tokenIndex).call();
  }

  getOwnerOf = async (tokenIndex) => {
    return await yttContract.methods.ownerOf(tokenIndex).call();
  }

  cancelApproval = async () => {//approve ????????? ????????? false(???????????? ??????)??? ?????????
    
    const walletInstance = this.getWallet();
    
  
    if (receipt.transactionHash) {
      await this.onCancelApprovalSuccess(walletInstance);//?????????????????? ????????? ?????? ???????????? ??? ?????? ???????????? ??????
      location.reload();
    }
  }
//??? ?????? ??? ????????? ?????? ?????? ??? ?????? ???????????? ?????? ??????
  onCancelApprovalSuccess = async (walletInstance) => {
    var balance = parseInt(await this.getBalanceOf(walletInstance.address));
    //?????? ????????????
    if (balance > 0) {
      var tokensOnSale = [];
      for (var i = 0; i < balance; i++) {
        var tokenIndex = await this.getTokenOfOwnerByIndex(walletInstance.address, i);
        var price = await this.getTokenPrice(tokenIndex);
        if (parseInt(price) > 0)
          tokensOnSale.push(tokenIndex);//price ?????? ????????? ????????? ?????????
      }

      if (tokensOnSale.length > 0) {
        const receipt = await tsContract.methods.removeTokenOnSale(tokensOnSale).send({
          //???????????? ???????????? ?????????
          from: walletInstance.address,
          gas: '250000'
        });//transaction object??? ?????????

        if (receipt.transactionHash)//trasactionHash??? ??? return ????????????
          alert(receipt.transactionHash);
      }
    }
  }

  render() {
    var walletInstance = this.getWallet();
    var DOM_items = [];
    var sell_items = [];
    //????????? ??????(???????????? ??????)
    for(const item of this.state.items){
      DOM_items.push(
        <>
        <Card className="card-coin card-plain" >
         <img alt="..." className="img-center img-fluid" src={item.Url}/>      
          <Row>
            <Col className="text-center" md="12" style={{width:"230px"}}>
            <h4 className="text-uppercase">

            </h4>
            <hr className="line-primary" />
            </Col>
          </Row>
          <Row>
            <ListGroup>
              <ListGroupItem>index: {item.index}</ListGroupItem>
              <ListGroupItem>??????????????????: {item.Id}</ListGroupItem>
              <ListGroupItem>?????????: {item.brand}</ListGroupItem>
              <ListGroupItem>????????????: {item.productName}</ListGroupItem>
              <ListGroupItem>???????????????: {item.date}</ListGroupItem>
             
            </ListGroup>
          </Row>
        </Card>
        </>
      )
    }
    //?????? ??? ?????? ??????//
    for(const item of this.state.sell_items){
      sell_items.push(
        <>
        <Card className="card-coin card-plain" >
         <img alt="..." className="img-center img-fluid" src={item.Url}/>      
          <Row>
            <Col className="text-center" md="12" style={{width:"230px"}}>
            <h4 className="text-uppercase">
              <Link to="product-page">
               
              </Link>
            </h4>
            <hr className="line-primary" />
            </Col>
          </Row>
          <Row>
            <ListGroup>
              <ListGroupItem>index: {item.index}</ListGroupItem>
              <ListGroupItem>??????????????????: {item.Id}</ListGroupItem>
              <ListGroupItem>?????????: {item.brand}</ListGroupItem>
              <ListGroupItem>????????????: {item.productName}</ListGroupItem>
              <ListGroupItem>???????????????: {item.date}</ListGroupItem>
              <ListGroupItem>??????????????????: {item.amount}</ListGroupItem>
            </ListGroup>
          </Row>
        </Card>
        </>
      )
    }

    if (walletInstance) {
      return (
        <>
        <IndexNavbar />

        <div className="wrapper">
            <div className="section">
                <div className="container">
                    <Row>
                    <Col className="col-md-3">
                    <div className="space-70"></div>
                 
                      <div className="section">
                      <section>
                          <br/>
                          <ul role="tablist" class="flex-column nav-tabs-info nav">
                            <li className="nav-item">
                              <a href="#pablo" className="active nav-link">
                                <i className="tim-icons icon-single-02">
                                </i>
                              &nbsp;  General 
                              </a>
                            </li>
                            <hr className="line-info" />
                            <li className="nav-item">
                              <a href="#pablo" className="nav-link">
                                <i className="tim-icons icon-credit-card">

                                </i>
                              &nbsp;  Billing 
                              </a>
                            </li>
                            <hr className="line-info"/>
                            <li className="nav-item">
                            <a href="#pablo" className="nav-link">
                            <i className="tim-icons icon-lock-circle"></i>
                            &nbsp;  Security 
                            </a>
                            </li>
                          </ul>
                          </section>
                          <br/><br/><br/>
           
                      </div>
                    </Col>
                    
                    <Col className="m1-auto col-md-8">
                      <div className="section">
                        <div className="tab-content">
                          <div className="tab-pane active">
                            <div>

                              <header>
                                <h2 className="text-uppercase"><b>Get your tokens!</b></h2>
                              </header>
                              <br/>
                          <Card>
                            <CardBody>
                              <Row>
                                <Col className="align-self-center col-md-3">
                                <Badge color="primary">User Address</Badge>
                                </Col>
                                <Col className="align-self-center col-md-8">
                                <p className="text-neutral"><b>
                                {walletInstance.address}</b></p>
                                </Col>
                              </Row>
                              <br/>
                              <hr className="line-primary"></hr>
                              {/* <header>
                                <h3 className="text-uppercase"><b>My Token</b></h3>
                              </header> */}
                              <Col className="align-self-center row-md-3">
                                <Card className="card-coin card-plain" style={{ display: 'flex', overFlow: 'auto', width: '660px',paddingLeft:'30px', paddingRight:'30px'}}>
                                  <br/> 
                                  <Row>                            
                                    <Col>
                                      {DOM_items}
                                    </Col>
                                  </Row>
                                </Card>
                              </Col>
                              <br/>
                              <br/>
                              <br/>
                              </CardBody>
                              </Card>  
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                
            </div>
          </div>
        <Footer />
        </>
      );
    }
  }
}

export default Mypage;