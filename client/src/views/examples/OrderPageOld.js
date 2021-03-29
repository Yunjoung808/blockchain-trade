import React from "react";
import classnames from "classnames";
import PerfectScrollbar from "perfect-scrollbar";
import { Link } from "react-router-dom";
import Caver from "caver-js";
import {
    Button,
    Card,
    Container,
    Row,
    Col,
    ListGroupItem,
    ListGroup,
    UncontrolledCarousel
} from "reactstrap";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footer/Footer.js";

let ps = null;

const axios = require('axios').default;
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
var ipfsClient = require('ipfs-http-client');//ipfs 클라이언트를 import 한다
var ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
const yttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


class OrderPageOld extends React.Component {

  constructor(props) {
      super(props)
      this.displayAllSellTokens(props.location.state.tokenIndex)
      this.state = {
        items :[],
        item_index :'',
        sell_items : [],
        all_items: [],
        allSell_items: [],
        t_tokenIndex: props.location.state.tokenIndex,
        t_productName: props.location.state.productName,
        t_productKey: props.location.state.productKey,
        t_price: props.location.state.price,
        t_brand: props.location.state.brand,
        sell_receipt:'',
        metadata:'',
        tokenUri:''
      }
      // this.getTokenUri(this.state.t_tokenIndex).then( result=>{
      //   this.setState({metadata: result})
      // })

      // this.getMetadata(this.state.tokenUri).then( result => {
      //   this.setState({tokenUri: result})
      // })
  }

  displayAllSellTokens = async (tokenIndex) => {   
    var tokenIndex = tokenIndex
    var tokenUri = await this.getTokenUri(tokenIndex);
    var ytt =  await this.getYTT(tokenIndex);
    var metadata = await this.getMetadata(tokenUri);
    var price = await this.getTokenPrice(tokenIndex); 
    var owner = await this.getOwnerOf(tokenIndex);

    this.setState({
      tokenIndex : tokenIndex,
      tokenUrl : metadata.properties.image.description,
      productKey : metadata.properties.name.description,
      brand : metadata.properties.description.description,
      productName : ytt[0],
      date : ytt[1],
      price : caver.utils.fromPeb(price, 'KLAY')
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

  render() {

    var walletInstance = this.getWallet();

    if (walletInstance) {
        return (
            <>
            <IndexNavbar />
            <div className="wrapper">
              <div className="section">
                <Container>
                  <Row>
                    <Col className="col-lg-4">
                      <h2 className="title">Order summary</h2>
                      <div className="card">
                          <div className="card-body">
                          <>
                            <Card className="card-coin card-plain" >
                              <img alt="..." className="img-center img-fluid" src={this.state.tokenUrl}/>      
                              <Row>
                                <Col className="text-center" md="12" style={{width:"230px"}}>
                                <h4 className="text-uppercase">
                                </h4>
                                <hr className="line-primary" />
                                </Col>
                              </Row>
                              <Row>
                                <ListGroup>
                                  <ListGroupItem>index: {this.state.tokenIndex} </ListGroupItem>
                                  <ListGroupItem>제품고유번호: {this.state.productKey}</ListGroupItem>
                                  <ListGroupItem>브랜드: {this.state.brand}</ListGroupItem>
                                  <ListGroupItem>제품이름: {this.state.productName}</ListGroupItem>
                                  <ListGroupItem>제품제작일: {this.state.date}</ListGroupItem>
                                  <ListGroupItem>제품가격: {this.state.price} klay</ListGroupItem>
                                </ListGroup>
                              </Row>
                            </Card>
                            </>
                            <hr class="line-info mb-3"></hr>
                            <div className="align-items-center media">
                            </div>
                        </div>
                      </div>
                    </Col>
                    <Col className="col-lg-8">
                      <form className="js-validate">
                        <Container>
                          <h3 className="title">Billing address</h3>
                          <Row>
                            <Col className="col-md-6">
                              <label class="labels">
                                First Name
                                <span className="text-danger">*</span>
                              </label>
                              <input aria-label="길동" name="firstName" placeholder="길동" type="text" className="form-control"></input>
                            </Col>
                            <Col className="col-md-6">
                              <label class="labels">
                                Last Name
                                <span className="text-danger">*</span>
                              </label>
                              <input aria-label="홍" name="lastName" placeholder="홍" type="text" className="form-control"></input>
                            </Col>
                          </Row>
                          <br/>    
                          <Row>
                            <Col className="col-md-6">
                              <div className="js-form-message mb-6">
                                <label className="labes">
                                  Email address
                                  <span className="text-danger">*</span>
                                </label>
                                <input aria-label="abc@naver.com" name="emailAddress" placeholder="abc@naver.com" type="email" className="form-control"></input>
                              </div>
                            </Col>

                            <Col className="col-md-6">
                              <div className="js-form-message mb-6">
                                <label className="labes">
                                  Phone number
                                  <span className="text-danger">*</span>
                                  ( 숫자만 기입해주세요)
                                </label>
                                <input aria-label="01011112222" name="phonNumber" placeholder="01011112222" type="text" className="form-control"></input>
                              </div>
                            </Col>
                          </Row>
                          <br/>
                          <Row>
                            <Col className="col-md-8">
                              <div className="js-form-message mb-6">
                                <label className="labels">
                                  Address
                                  <span className="text-danger">*</span>
                                </label>
                                <input aria-label="서울시 구로구" name="Address" placeholder="서울시 구로구" type="text" className="form-control"></input>
                              </div>
                            </Col>
                            <Col className="col-md-4">
                            <div className="js-form-message mb-6">
                              <label className="labels">
                                Postcode
                                <span className="text-danger">*</span>
                              </label>
                              <input aria-label="12345" name="postcode" placeholder="12345" type="text" className="form-control"></input>
                            </div>
                            </Col>
                          </Row>

                          <h3 className="title">Payment</h3>
                          <div className="tab-content tab-space">
                            <div className="tab-pane active">
                              <Row>
                                <Col className="col-md-12">
                                  <div className="js-form-message">
                                    <label className="labels">
                                      My Wallet
                                    </label>
                                    <div>
                                    {walletInstance.address}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <br/>
                            </div>
                            <div className="tab-pane"></div>
                          </div>
                        </Container>
                      </form>
                    </Col>
                    </Row>
                      <button type="button" class="btn btn-info btn-sm" style={{float: "right"}} onClick={(e) => this.buyToken(this.state.t_tokenIndex)}>
                          Order now
                      </button>
                </Container>
                </div>
                <div class="space-70"></div>      
              <Footer />
            </div>
         </>
        )
    }

    return (
      <>
        <IndexNavbar />
        <div className="wrapper">
        <div className="section">
            <Container>
                <Row>
                    <p1>로그인 후 이용할 수 있습니다.</p1>
                    {/* -------------오른쪽---------- */}
                    <Col className="col-lg-8">
                        <form className="js-validate">
                            <Container>
                                <h3 className="title">Billing address</h3>
                                <Row>
                                    <Col className="col-md-6">
                                        <label class="labels">
                                            First Name
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input aria-label="길동" name="firstName" placeholder="길동" type="text" className="form-control"></input>
                                    </Col>
                                    <Col className="col-md-6">
                                    <label class="labels">
                                            Last Name
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input aria-label="홍" name="lastName" placeholder="홍" type="text" className="form-control"></input>
                                    </Col>
                                </Row>
                                    <br/>    
                                <Row>
                                    <Col className="col-md-6">
                                        <div className="js-form-message mb-6">
                                            <label className="labes">
                                                Email address
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input aria-label="abc@naver.com" name="emailAddress" placeholder="abc@naver.com" type="email" className="form-control"></input>
                                        </div>
                                    </Col>

                                    <Col className="col-md-6">
                                    <div className="js-form-message mb-6">
                                            <label className="labes">
                                                Phone number
                                                <span className="text-danger">*</span>
                                                ( 숫자만 기입해주세요)
                                            </label>
                                            <input aria-label="01011112222" name="phonNumber" placeholder="01011112222" type="text" className="form-control"></input>
                                        </div>
                                    </Col>

                                </Row>
                                <br/>
                                <Row>
                                    <Col className="col-md-8">
                                        <div className="js-form-message mb-6">
                                            <label className="labels">
                                                Address
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input aria-label="서울시 구로구" name="Address" placeholder="서울시 구로구" type="text" className="form-control"></input>
                                        </div>
                                    </Col>
                                    <Col className="col-md-4">
                                    <div className="js-form-message mb-6">
                                            <label className="labels">
                                                Postcode
                                                <span className="text-danger">*</span>
                                            </label>
                                            <input aria-label="12345" name="postcode" placeholder="12345" type="text" className="form-control"></input>
                                        </div>
                                    </Col>
                                </Row>

                                <h3 className="title">Payment</h3>
                                <div className="tab-content tab-space">
                                    <div className="tab-pane active">
                                        <Row>
                                            <Col className="col-md-12">
                                                <div className="js-form-message">
                                                <label className="labels">
                                                Wallet
                                                
                                            </label>
                                            <input aria-label="0x89d7g98s7d8g7d8s6g..." name="wallet" placeholder="0x89d7g98s7d8g7d8s6g..." type="text" className="form-control"></input>
                                                </div>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row>
                                            <Col className="col-md-12">
                                                <div className="js-form-message">
                                                <label className="labels">
                                                Password
                                                
                                            </label>
                                            <input aria-label="*****" name="password" placeholder="*****" type="text" className="form-control"></input>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="tab-pane"></div>
                                </div>
                            </Container>
                        </form>
                    </Col>
                </Row>
                <Link to="/order-complete-page-old">
                {/* <button type="button" class="btn btn-info btn-sm" style={{float: "right"}} tag={Link} to="/order-complete-page">
                    Order now
                </button> */}
                </Link>
            </Container>
        </div>
        <div class="space-70"></div>
        <Footer />
        </div>
      </>
    );
  }
}

export default OrderPageOld;