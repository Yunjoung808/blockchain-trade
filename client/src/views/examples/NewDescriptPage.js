import React from "react";
import {
  Button,
  Card,
  ListGroupItem,
  ListGroup,
  Container,
  Row,
  Col,
  UncontrolledCarousel
} from "reactstrap";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footer/Footer.js";
import 'pure-react-carousel/dist/react-carousel.es.css';
import { Link } from "react-router-dom";
import Axios from "axios";
import Caver from "caver-js";

const axios = require('axios').default;
const crypto = require('crypto');
const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);
var ipfsClient = require('ipfs-http-client');//ipfs 클라이언트를 import 한다
var ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
const yttContract = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const tsContract = new caver.klay.Contract(DEPLOYED_ABI_TOKENSALES, DEPLOYED_ADDRESS_TOKENSALES);


class NewDescriptPage extends React.Component {
  componentDidMount() {
    document.body.classList.toggle("Product-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("Product-page");
  }

  constructor(props){
    super(props);

    var params = new URLSearchParams(props.location.search);
    // this.displayMyTokensAndSale()
    this.displayAllSellTokens()
    this.state={
      productKey: '',
      brand: '',
      imgUrl: '',
      productName: '',
      dateCreated: '',
      tokenUri:'',
      price:'',
      productKey:null,
      items :[],
      sell_items : [],
      all_items: [],
      allSell_items: [],
      news:{
        id           :'',
        index        :'',
        brand        :'',
        productName  :'',
        image :'',
        tokenUri    :'',
        description  :'',
        price        :'',
        date         :''  
      },
      value:0,min:0,counter:0,
      index:params.get('index')
    };
    
    this.handleClickPlus=this.handleClickPlus.bind(this);
    this.handleClickMinus=this.handleClickMinus.bind(this);
    this.handleOnChange=this.handleOnChange.bind(this);

    this.displayMyTokensAndSale = this.displayMyTokensAndSale.bind(this)

    Axios.get("http://localhost:5000/NewP/new/getNewP?index="+params.get('index'))
      .then(response => {
          if(response.status==200){
            this.setState({
              news:response.data[0]
            })
              
          }else{
              
          }
    })
  }

  handleClickPlus(){
    this.setState({
      value:this.state.value+1
    });
  }

  handleClickMinus(){
    if(this.state.value <=0) return;
    this.setState({
      value:this.state.value-1
    });
  }

  handleOnChange(e) {
    
    // e.target.value 숫자만 있는지 확인
    this.setState({
      value: e.target.value
    });
  }

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

  getERC721MetadataSchema = (productKey, brand, imgUrl) => {
    return {
      "title": "Asset Metadata",
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": productKey
        },
        "description": {
          "type": "string",
          "description": brand
        },
        "image": {
          "type": "string",
          "description": imgUrl
        }
      }
    }
  }

  handleCreateToken = async () => {
    var now = new Date();
    var productKey = this.state.productKey;//유닉크해야한다.
    var brand = this.state.news.brand;
    var productName = this.state.news.productName;
    var dateCreated = now.toLocaleDateString();
    var tokenUri = this.state.news.tokenUri;  
    if (!productKey || !brand || !productName || !dateCreated ) {
      alert("조건이 맞지 않습니다")
      return;
    }
    try {
      const metaData = this.getERC721MetadataSchema(productKey, brand, tokenUri);
      var res = await ipfs.add(Buffer.from(JSON.stringify(metaData)));
      await this.mintYTT(productKey, productName, dateCreated, res[0].hash);
    } catch (err) {
      console.error(err);
    }
  }

  mintYTT = async (productKey, productName, dateCreated, hash) => {
    const sender = this.getWallet();// 함수를 호출하는 계정
    var feePayer;
    var component = this
    try { 
      feePayer = caver.klay.accounts.wallet.add('0x4e2fc35f9a305401b0f7dedf2dcaa97f3cb0bb9dcae12378d9f31d7644fc34a7')
    }
    catch(e){
      feePayer = caver.klay.accounts.wallet.getAccount('0xee345743f1c137207c9d8212502e3e975157a22b');
    }    
    const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
      type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',//컨트랙 대납 타입
      from: sender.address,//sender계정이 호출한다
      to: DEPLOYED_ADDRESS,//전역상수/배포된 contract의 주소
      data: yttContract.methods.mintYTT(productKey, productName, dateCreated, "https://ipfs.infura.io/ipfs/" + hash).encodeABI(),
      gas: '500000',
      value: caver.utils.toPeb('0', 'KLAY'),
    }, sender.privateKey)//트렌젝션에 sender가 서명을 한다
    caver.klay.sendTransaction({
      senderRawTransaction: senderRawTransaction,//위의 서명이 끝난 transaction을 넘긴다
      feePayer: feePayer.address,//feepayer의 공개주소를 넘긴다
    })
    .then(function (receipt) {
      if (receipt.transactionHash) {//제대로 영수증을 받았다면
        console.log("https://ipfs.infura.io/ipfs/" + hash);//console.log로 보여준다
        alert(receipt.transactionHash);
        component.approve();
      }
    });
  }

  approve = () => {//판매승인
    const walletInstance = this.getWallet();//계정정보 불러온다
    yttContract.methods.setApprovalForAll(DEPLOYED_ADDRESS_TOKENSALES, true).send({
      from: walletInstance.address,//현재 로그인된 계정의 주소
      gas: '250000'
    }).then(function (receipt) {
      if (receipt.transactionHash) {
        alert("토큰등록 승인완료"+ receipt.transactionHash)
      }
    });
  }

  generateProductKey = () => {
    const productKey = crypto.createHmac('sha256', this.state.brand).update(new Date()+this.state.productName).digest('hex');
    this.setState({ productKey: productKey.substr(0,15)})
    console.log(productKey);
    console.log("key 생성완료");
  }
  
  displayMyTokensAndSale = async () => {       
    var walletInstance = this.getWallet()
    var balance = parseInt(await this.getBalanceOf(walletInstance.address));
    console.log(balance);
    if (balance === 0) {
      alert("현재 보유한 토큰이 없습니다.");
    } else {
      var isApproved = await this.isApprovedForAll(walletInstance.address, DEPLOYED_ADDRESS_TOKENSALES);
      this.state.items = [];//초기화
      this.state.sell_items = [];//초기화
      for (var i = 0; i < balance; i++) {
      (async () => {//빨리 렌더링하기 위해 쓰이는 방법
          var tokenIndex = await this.getTokenOfOwnerByIndex(walletInstance.address, i);
          var tokenUri = await this.getTokenUri(tokenIndex);
          var ytt = await this.getYTT(tokenIndex);
          var metadata = await this.getMetadata(tokenUri);
          var price = await this.getTokenPrice(tokenIndex);
          console.log(tokenIndex, tokenUri, price)
          // this.renderMyTokens(tokenIndex, ytt, metadata, isApproved, price);   
          if (parseInt(price) > 0) {
            this.renderSellTokens(tokenIndex, ytt, metadata, price);
          }

          if (parseInt(price) == 0) {
            this.renderMyTokens(tokenIndex, ytt, metadata, isApproved, price);  
          }
      })();      
      }
    }
  }

  displayAllSellTokens = async () => {   
    var totalSupply = parseInt(await this.getTotalSupply());
    if (totalSupply === 0) {
        console.log("발행된 토큰이 없습니다");
    } else {
      for (var i = 0; i < totalSupply; i++) {
        (async () => {
          var tokenIndex = await this.getTokenByIndex(i);
          var tokenUri = await this.getTokenUri(tokenIndex);
          var ytt =  await this.getYTT(tokenIndex);
          var metadata = await this.getMetadata(tokenUri);
          var price = await this.getTokenPrice(tokenIndex); 
        //   this.renderAllTokens(tokenIndex, ytt, metadata, price,owner);//
          if (parseInt(price) > 0) 
            this.renderAllSellTokens(tokenIndex, ytt, metadata, price);
        })();
      }
    }
  }

  renderAllSellTokens = (tokenIndex, ytt, metadata, price) => {   
      var _tokenIndex = tokenIndex;  
      var _url = metadata.properties.image.description;
      var _brand = metadata.properties.description.description;
      var _productKey = metadata.properties.name.description;
      var _productName = ytt[0];
      var _dateCreated = ytt[1];
      var _price = caver.utils.fromPeb(price, 'KLAY');
    
      if (parseInt(price) > 0) {
        var allSellState = this.state;
        allSellState.allSell_items.push({
          index : _tokenIndex,
          Url : _url,
          Id : _productKey,
          brand : _brand,
          productName : _productName,
          date : _dateCreated,
          amount : _price
        })
        this.setState(allSellState);
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

  sellToken = async(index) => {    
    var tokenIndex=index
    // var itemIndex = this.state.items.findIndex(element => element.index == tokenIndex)
    var amount = this.state.news.price;
    console.log(tokenIndex, amount, typeof(tokenIndex))
    if (amount==null) 
      return;//수가0이하면 함수 종료
    
    var feePayer;
    var component = this
    try {
      var sender = this.getWallet();
      console.log(sender.address);
      
      try { 
        feePayer = caver.klay.accounts.wallet.add('0x4e2fc35f9a305401b0f7dedf2dcaa97f3cb0bb9dcae12378d9f31d7644fc34a7')
      }
      catch(e){
        feePayer = caver.klay.accounts.wallet.getAccount('0xee345743f1c137207c9d8212502e3e975157a22b');
      }
      console.log(feePayer.address);
      var { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
        from: sender.address,
        to:   DEPLOYED_ADDRESS_TOKENSALES,
        data: tsContract.methods.setForSale(tokenIndex, caver.utils.toPeb(amount, 'KLAY')).encodeABI(),
        gas:  '500000',
        value: caver.utils.toPeb('0', 'KLAY'),
      }, sender.privateKey)

      caver.klay.sendTransaction({
        senderRawTransaction: senderRawTransaction,
        feePayer: feePayer.address,
      })
      .then(function(receipt){
        if (receipt.transactionHash) {         
          alert("토큰 등록 완료" + receipt.transactionHash);
          component.displayMyTokensAndSale();
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  getTotalSupply = async () => {
    return await yttContract.methods.totalSupply().call();
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

    var imageItems=[];
    if(!this.state.news.images|| this.state.news.images.length == 0){
      imageItems = []
    }
    else{
      this.state.news.images.forEach(element => {
        imageItems.push({
          src : element.binary,
          altText: element.metadata.name,
          caption: element.metadata.name
        })
      });
    }

    var walletInstance

    try{
      walletInstance= this.getWallet();
      
    }catch(e){
      walletInstance={
        address:'0'
      }
    }

    var DOM_items = [];
    var sell_items = [];
    var allSell_items = [];

    for(const item of this.state.allSell_items){
        if (item.brand == this.state.news.brand && item.productName == this.state.news.productName && item.amount == this.state.news.price){
            
          allSell_items.push(
          <>
          <Card className="card-coin card-plain" >
            <Row>
              <ListGroup>
                <ListGroupItem>index: {item.index} </ListGroupItem>
                <ListGroupItem>제품고유번호: {item.Id}</ListGroupItem>
                <ListGroupItem>브랜드: {item.brand}</ListGroupItem>
                <ListGroupItem>제품이름: {item.productName}</ListGroupItem>
                <ListGroupItem>제품제작일: {item.date}</ListGroupItem>
                <ListGroupItem>제품가격: {item.amount} klay</ListGroupItem>
              </ListGroup>
            </Row>
          </Card>
          </>
        )
      }
    }

    for(const item of this.state.items){
      if( item.brand == this.state.news.brand && item.productName == this.state.news.productName){
        DOM_items.push(
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
                <ListGroupItem>제품고유번호: {item.Id}</ListGroupItem>
                <ListGroupItem>브렌드: {item.brand}</ListGroupItem>
                <ListGroupItem>제품이름: {item.productName}</ListGroupItem>
                <ListGroupItem>제품제작일: {item.date}</ListGroupItem>
                <Button value={item.index} onClick={(e) => this.sellToken(item.index)}>제품인증서 활성화</Button>
              </ListGroup>
            </Row>
          </Card>
          </>
        )
      }
    }

    for(const item of this.state.sell_items){
      if( item.brand == this.state.news.brand && item.productName == this.state.news.productName){
      sell_items.push(
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
              <ListGroupItem>제품고유번호: {item.Id}</ListGroupItem>
              <ListGroupItem>브렌드: {item.brand}</ListGroupItem>
              <ListGroupItem>제품이름: {item.productName}</ListGroupItem>
              <ListGroupItem>제품제작일: {item.date}</ListGroupItem>
              <ListGroupItem>제품판매가격: {item.amount}</ListGroupItem>
            </ListGroup>
          </Row>
        </Card>
        </>
      )
    }
  }

    if (walletInstance.address ==='0xda88c1bd96a03b391d1983c2330ff961c9a8c255'){ 
            
      return (
        <>
        <IndexNavbar />
        <img alt="..." className="path" src={require("assets/img/blob.png")} />
        <img alt="..." className="shapes circle" src={require("assets/img/cercuri.png")} />
        <div className="wrapper">
          <div className="page-header" style={{display : 'inline'}}>
            <Row className="row-grid justify-content align-items text-left">
              <Col lg="12" md="6">
                <h1 className="text-white"></h1><br/>
                <h3 className="text-white mb-3"></h3><br/>
                <h3 className="text-white mb-3"></h3><br/>
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
                  <header>
                 <h3 className="text-uppercase" style={{align: "left"}}><b>{this.state.news.brand}</b></h3>
                </header>
                
               
                <h4 className="text-uppercase">{this.state.news.productName}</h4>
                
                    
                    <h5 className="main-price"> {this.state.news.price} KLAY</h5>
                    <h4 className="category">Description</h4>
                    <h5 className="description">{this.state.news.description}</h5><br/>
                    
            

                    <form name = "product_token">
                      <Button className="btn-simple btn btn-neutral"  onClick={this.generateProductKey}> 제품 일련번호 </Button>
                      <input placeholder="Serial Number" value={this.state.productKey} label="Product key" readOnly/><br/>  
                      <Button className="btn-simple btn btn-info" style={{float: "right"}} onClick={this.displayMyTokensAndSale}>토큰확인</Button>
                      <Button className="btn-simple btn btn-success" style={{float: "right"}} onClick={this.handleCreateToken}>토큰생성</Button>
                    </form>

                  
                   </Col>
                  </Row>
                  <br/>
                  <br/>
                  <br/>

                  <hr className="line-primary"></hr>
                  <Row>
                <header>
                <h3 className="text-uppercase" style={{align: "left"}}><b>판매 가능한 토큰</b></h3>
                </header>
                </Row>

                      {DOM_items}
                  <br/>
                  <br/>
                  <hr className="line-primary"></hr>
                  <Row>
                  <header>
                <h3 className="text-uppercase" style={{align: "left"}}><b>판매중인 토큰</b></h3>
                </header>
                      
                  </Row>
                  {sell_items}
                 </Container>


               </div>
             </div>
           </div>
           <Footer />
       </>
     );
    }
    
    return (  
      <>
        <IndexNavbar />
        <img alt="..." className="path" src={require("assets/img/blob.png")} />
        <img alt="..." className="shapes circle" src={require("assets/img/cercuri.png")} />
        
        <div className="wrapper">
          <div className="page-header" style={{display : 'inline'}}>

            <Row className="row-grid justify-content align-items text-left">
              <Col lg="12" md="6">
                <h1 className="text-white"></h1><br/>
                {/* <h3 className="text-white mb-3"></h3><br/>
                <h3 className="text-white mb-3"></h3><br/> */}
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
                <h3 className="text-uppercase" style={{align: "left"}}><b>{this.state.news.brand}</b></h3>
                </header>
                  
                    <h5>{this.state.news.productName}</h5>
                    <div className="stars stars-right">
                      <div className="stars text-warning">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star ml-1"></i>
                        <i className="fas fa-star ml-1"></i>
                        <i className="fas fa-star ml-1"></i>
                        <i className="far fa-star ml-1"></i>
                        <p className="d-inline ml-1">(8080 customer reviews)</p>
                      </div>
                    </div> <br/>
                    <h2 className="main-price">{this.state.news.price} KLAY</h2>
                    <h5 className="category">Description</h5>
                    <p className="description">{this.state.news.description}</p><br/>
                    <h5 className="category text-primary">제품 수량: {allSell_items.length}</h5>
                    
                    <div className="pick-size row">
                      <Col>
                     <Link to={{
                       pathname:"/order-page",
                       state:{
                        brand:this.state.news.brand,
                        productName: this.state.news.productName,
                        price:this.state.news.price
                       }
                     }}>
                        <Button
                        className="btn-simple btn btn-primary" style={{float: "right"}} >
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

          <Footer />
      </>
    );
  }
}

export default NewDescriptPage;