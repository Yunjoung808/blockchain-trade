import React, { Component, PropTypes, useState } from "react";
import Axios from 'axios';
import classnames from "classnames";

import {
  Button,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  UncontrolledCarousel,
  UncontrolledAlert
} from "reactstrap";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footer/Footer.js";
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Link } from "react-router-dom";
import Caver from "caver-js";

const axios = require('axios').default;
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
var ipfsClient = require('ipfs-http-client');//ipfs 클라이언트를 import 한다
var ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
const yttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);


class OldDescriptPage extends React.Component {
  state = {products: []}
  componentDidMount() {
    document.body.classList.toggle("Product-page");
    fetch('/products')
      .then(res => res.json())
      .then(products => this.setState({ products }));
  }
  componentWillUnmount() {
    document.body.classList.toggle("Product-page");
  }

  constructor(props){
  super(props);
  var params = new URLSearchParams(props.location.search);
  
  this.state={
    productKey  : '',
    brand       : '',
    imgUrl      : '',
    productName : '',
    dateCreated : '',
    tokenUri    : '',
    price       : '',
    productKey  : null,
    items       : [],
    sell_items  : [],
    all_items   : [],
    ownerAddress:'',
    products:{
      id           :'',
      tokenIndex   :'',
      index        :'',
      image        :'',
      brand        :'',
      productName  :'',
      productKey   :'',
      tokenUri     :'',
      description  :'',
      price        :'',
      date         :''  
    },
    
    index:params.get('index')
  };

  Axios.get("http://localhost:5000/OldP/products/getOldp?index="+params.get('index'))
    .then(response => {
        if(response.status==200){

          this.getOwnerOf(response.data[0].tokenIndex);
          this.setState({
            products:response.data[0]
          })
        }else{
        }
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
  
  getOwnerOf = async (tokenIndex) => {
    yttContract.methods.ownerOf(tokenIndex).call().then( owner=>{
      this.setState({
        ownerAddress : owner
      })
    })
    
  }

  render() {
    
    var imageItems=[];
    if(!this.state.products.images|| this.state.products.images.length == 0){
      imageItems = []
    }
    else{
      this.state.products.images.forEach(element => {
        imageItems.push({
          src : element.binary,
          altText: element.metadata.name,
          caption: element.metadata.name
        })
      });
    }
    var _tokenIndex = (this.state.products.tokenIndex);
   
    var ownerAddress = 0//this.getOwnerOf(_tokenIndex);
    var walletInstance = this.getWallet();
    if (walletInstance) {
      return (
        <>
        <IndexNavbar />
            <img alt="..." className="path" src={require("assets/img/blob.png")}/>
            <img alt="..." className="shapes circle" src={require("assets/img/cercuri.png")}/>
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
                    <Col className="col-md-12 col-lg-6">
                      <div className="carousel slide">
                        <Row className="justify-content-between align-items-center">
                        <UncontrolledCarousel items={imageItems}/>
                        </Row>
                      </div>
                    </Col>
                          
                    <Col className="mx-auto col-md-12 col-lg-6">
                    <hr className="line-primary" />
                    <header>
                    <h3 className="text-uppercase" style={{align: "left"}}><b>{this.state.products.brand}</b></h3>
                    </header>
                
               
                     <h4 className="text-uppercase">{this.state.products.productName}</h4>
                
                    
                    <h5 className="main-price"> {this.state.products.price} KLAY</h5>
                    
                    <h4 className="category">Description</h4>
                    <h5 className="description">{this.state.products.description}</h5><br/>

                  
                    {/* ----------------------------------------------------------------------------- */}

                    <h4 className="text-uppercase"><span><b className="text-primary">Token Index : </b>
                    
                    </span>{this.state.products.tokenIndex}
                    </h4>
                    

                    <h4 className="text-uppercase"><span><b className="text-primary">Serial Number : </b>
                    
                    </span>{this.state.products.productKey}
                    </h4>


                    <h4 className="text-uppercase"><span><b className="text-primary">판매등록일 : </b>
                    
                    </span>{this.state.products.date} 
                    </h4>

                    <h4 className="text-uppercase"><span><b className="text-primary">현 소유자 : </b>
                    
                    </span> {this.state.ownerAddress} 
                    </h4>


          
           


                      <div className="pick-size row">
                        <Col className="col-md-4 col-lg-2">
                        </Col>

                        <Col>
                          <Link to={{pathname:"/order-page-old",
                                      state:{
                                        productKey:this.state.products.productKey,
                                        tokenIndex:this.state.products.tokenIndex,
                                        productName: this.state.products.productName,
                                        price:this.state.products.price,
                                        brand:this.state.products.brand,
                                      }
                                    }}>
                            <Button className="btn-simple btn btn-primary" style={{float: "right"}} >
                              <i className="tim-icons icon-cart"></i>
                                구매하기
                            </Button>
                          </Link>
                        </Col>
                      </div>
                    </Col>
                  </Row>
                </Container>
                </div>
              </div>               
            </div>

              <div className="section related-products">
                <div className="container">
                  <Col className="col-md-8">
                    <h2 className="title">You may also like</h2>
                    <h3 className="title">고객님을 위한 맞춘 추천 상품</h3>
                  </Col>
            
                <Row>
                  <Col className="col-md-6 col-lg-3">
                    <div className="card-product card">
                      <div className="card-image">
                        <a href="#pablo">
                        <Link to={`/new-descript-page?index=1`}><img alt="..." className="img-fluid rounded shadow-lg" src={require("assets/img/ju1.jpg")}/></Link>
                        </a>
                      </div>

                      <div className="card-body">
                      <h6 className="category text-warning">Trending</h6>
                      <h4 className="card-title"><a href="#pablo" className="text-white card-link">Gucci Wallet</a></h4>
                      
                      <div className="card-description">
                        대한민국 남성들이 뽑은 가장 선호하는 브랜드 1위 구찌 망설이지 마세요~~!!
                      </div>
                      <div className="card-footer">
                        <div className="price-container">
                          <span className="badge badge-warning">0.12 klay</span>
                        </div>
                        <button id="tooltip449471879" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                          <i className="tim-icons icon-heart-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col className="col-md-6 col-lg-3">
                  <div className="card-product card">
                    <div className="card-image">
                    <a href="#pablo">
                    <Link to={`/new-descript-page?index=2`}><img alt="..." className="img-fluid rounded shadow-lg" src={require("assets/img/ju22.jpg")}/></Link>
                    </a>
                  </div>

                  <div className="card-body">
                    <h6 className="category text-warning">Popular</h6>
                    <h4 className="card-title">
                      <a href="#pablo" className="text-white card-link">SAINT LAURENT Bag</a>
                    </h4>
                    <div className="card-description">
                      2020 여자 백 전체 판매량 1위 생로랑 백!!! 품절 임박하니 얼른 만나보세요
                    </div>
                    <div className="card-footer">
                      <div className="price-container">
                        <span className="badge badge-warning">0.13 Klay</span>
                      </div>
                      <button id="tooltip320714545" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                        <i className="tim-icons icon-heart-2"></i>
                      </button>
                    </div>
                  </div>
                  </div>
                </Col>

                <Col className="col-md-6 col-lg-3">
                  <div className="card-product card">
                    <div className="card-image">
                      <a href="#pablo">
                        <Link to={`/new-descript-page?index=3`}><img alt="..." className="img-fluid rounded shadow-lg" src={require("assets/img/ju3.jpg")}/></Link>
                      </a>
                    </div>
                    
                    <div className="card-body">
                      <h6 className="category text-warning">Trending</h6>
                      <h4 className="card-title">
                        <a href="#pablo" className="text-white card-link">patekphilippe watch</a>
                      </h4>
                      <div className="card-description">
                      세계 시계 브랜드 NO.1을 자부할 수 있는 시계업계 원탑 파텍틸립을 만나보세요.
                      </div>
                      <div className="card-footer">
                        <div className="price-container">
                          <span className="badge badge-warning">0.2 Klay</span>
                        </div>
                        <button id="tooltip300524105" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                          <i className="tim-icons icon-heart-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col className="col-md-6 col-lg-3">
                  <div className="card-product card">
                    <div className="card-image">
                      <a href="#pablo">
                        <Link to={`/new-descript-page?index=4`}><img alt="..." className="img-fluid rounded shadow-lg" src={require("assets/img/ju555.jpg")}/></Link>
                      </a>
                    </div>
                    <div className="card-body">
                      <h6 className="category text-warning">Trending</h6>
                      <h4 className="card-title">
                        <a href="#pablo" className="text-white card-link">CHANEL Scarf</a>
                      </h4>
                      <div className="card-description">
                      대한민국 모든 여성분들이 꿈꾸는 샤넬 스카프 크립토베리와 함께 하세요!!
                      </div>
                      <div className="card-footer">
                        <div className="price-container">
                          <span className="badge badge-warning">0.5 Klay</span>
                        </div>
                          <button id="tooltip755498009" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                            <i className="tim-icons icon-heart-2"></i>
                          </button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            </div>
          <Footer />
        </>
      );
    }
    return (
      <>
      <IndexNavbar />
      <div className="space-70"></div>
          <div className="wrapper">
              <div className="section">
                  <Container>
                      <h4>로그인 후 확인 가능합니다.</h4>
                  </Container>
              </div>
          </div>
          <Footer />
      </>
    );
  }
}

export default OldDescriptPage;