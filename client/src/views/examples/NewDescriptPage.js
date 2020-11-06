
import React , { Component } from "react";


import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';

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
  Col,
  UncontrolledTooltip,
  UncontrolledCarousel
} from "reactstrap";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footer/Footer.js";
import 'pure-react-carousel/dist/react-carousel.es.css';

import { Link } from "react-router-dom";
import Axios from "axios";

const products = [
  {
    'id' :'',
    'index' : '',
    'image' : '',
    'pname' : '',
    'description' : '',
    'price' : '',
    'date' : '',
  },


]



const carouselItems = [
  {
    src: require("assets/img/gucci2.jpg"), //DB 연결
    altText: "Slide 1",
    caption: "2020 HOT ITEM"  
  },
  {
    src: require("assets/img/gucci3.jpg"),  //DB 연결
    altText: "Slide 2",
    caption: "cryptoberry는 정품만 취급합니다"  
  },
  {
    src: require("assets/img/gucci.jpg"),   //DB 연결
    altText: "Slide 3",
    caption: "정품이 아닐시 1000% 보상"  
  }
];

let ps = null;

class NewDescriptPage extends React.Component {
  componentDidMount() {
    
    document.body.classList.toggle("Product-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("Product-page");
  }

  

  constructor(props){
  super(props);
  
    
  this.state={
    products:{
      id           :'',
      index        :'',
      image        :'',
      pname        :'',
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

  Axios.get("http://localhost:5000/OldP/products/getOldp?index="+params.get('index'))
    .then(response => {
        if(response.status==200){
          this.setState({
            products:response.data[0]
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

  selectChange(e){
    this.setState({
      selectedValue: e.target.value
    })
  }
  render() {
    return (

      <>
        <IndexNavbar />
        <img
          alt="..."
          className="path"
          src={require("assets/img/blob.png")}
        />
        <img
          alt="..."
          className="shapes circle"
          src={require("assets/img/cercuri.png")}
        />
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
            <Row className="row-grid justify-content align-items text-left">
              <Col lg="12" md="6">
                <h1 className="text-white">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  Our products 
                </h1><br/>
                <h3 className="text-white mb-3">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  크립토 베리 에서는 본사에서 직접 받아온 제품만 판매합니다.
                  </h3>
                  <div className="btn-wrapper">
                    </div>
                </Col>

              </Row>

              <div className="section">
                <Container>
                  <Row>

                  <Col className="col-md-12 col-lg-6">
                  <div className="carousel slide">
                  <Row className="justify-content-between align-items-center">
                    <UncontrolledCarousel items={[{
                                                  src: '/05cc0d04cc8cf5ceeb5d9885e72e0e30'+'.png', //DB 연결
                                                  altText: "Slide 1",
                                                  caption: "2020 HOT ITEM"  
                                                },
                                              {
                                                src: '/05cc0d04cc8cf5ceeb5d9885e72e0e30'+'.png', //DB 연결
                                                altText: "Slide 2",
                                                caption: "cryptoberry는 정품만 취급합니다"  
                                              },
                                            {
                                              src: '/05cc0d04cc8cf5ceeb5d9885e72e0e30'+'.png', //DB 연결
                                              altText: "Slide 3",
                                              caption: "정품이 아닐시 1000% 보상"  
                                            },]} 
                    />
                  </Row>
                  </div>
                  

                  </Col>

                  
                  
                  <Col className="mx-auto col-md-12 col-lg-6">
                    <h2 className="title">{this.state.products.pname}</h2>

                    <div className="stars stars-right">
                      <div className="stars text-warning">
                        <i className="fas fa-star">

                        </i>

                        <i className="fas fa-star ml-1">

                        </i>

                        <i className="fas fa-star ml-1">
                          
                        </i>

                        <i className="fas fa-star ml-1">
                          
                        </i>

                        <i className="far fa-star ml-1">
                          
                        </i>
                        <p className="d-inline ml-1">(76 customer reviews)</p>
                      </div>
                    </div>
                  <br/>
                  <h2 className="main-price">{this.state.products.price}</h2>
                  <h5 className="category">Description</h5>
                  <p className="description">{this.state.products.description}</p><br/>

                 

                  <div className="pick-size row">
                  {/* <Col className="col-md-4 col-lg-2">
                    <label>
                      &nbsp; &nbsp; 수량
                    </label>
                    <div className="input-group">
                      <div className="input-group-btn">
                        <button onClick={this.handleClickMinus} type="button" className="btn-round btn-simple btn btn-warning">
                          <i className="tim-icons icon-simple-delete">
                            
                          </i>
                        </button>
                      </div>

                      

                    </div> 

                   
                    <input id="myNumber" type="text" className="input-number form-control"  value={this.state.value} onChange={this.handleOnChange}/>
                    

                    <div className="input-group">
                    <div className="input-group-btn">
                      <button onClick={this.handleClickPlus} type="button" className="btn-round btn-simple btn btn-warning">
                        <i className="tim-icons icon-simple-add">
                          
                        </i>
                      </button>
                      
                      
                    </div>    

                    
                    </div>          
                  </Col> */}

                  {/* <Col className="col-sm-6 col-md-4 col-lg-4">
                  <label>Select color</label>
             
                
                    <select>
                      <option selected value="choice">==선택==</option>
                      <option value="Black">Black</option>
                      <option value="Brown">Brown</option>
                      <option value="Gray">Gray</option>
                      <option value="Navy">Navy</option>
                      <option value="gita">기타</option>
                    </select>

                      
    
                  </Col> */}

                  {/* <Col className="col-sm-6 col-md-4 col-lg-4">
                    <label>Select size</label>
                  <select>
                      <option selected value="choice">==선택==</option>
                      <option value="Extra Small">Extra Small</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Extra Large">Extra Large</option>
                      <option value="gita">기타</option>
                    </select>
                 

                  </Col> */}

                  

                  <Col>
                  
              <Button className="btn-simple btn btn-primary" style={{float: "right"}} Link tag={Link} to="/order-page">
                <i className="tim-icons icon-cart"></i>
	              구매하기
              </Button>

                  
                  </Col>

                  </div>
                  </Col>
                  
                  

                  </Row>
                 
                </Container>

                
              </div>
              
            </div>
            
            <div className="section">
             
                <div className="container">
                  <Row>
                    <Col className="ml-auto mr-auto text-center col-md-6">
                      <h2 className="title">Not convinced yet?</h2>
                      
                      <h4 className="description">정보가 더 필요한가요? 다른 사람이 우리 제품에 대해 말하는 것을 확인해보세요. 그들은 그들의 구매에 매우 만족합니다.</h4>
                    </Col>
                  </Row>
                
                  <Row>
                <Col className="col-md-3" >
                  <div className="card-testimonial card">
                  <div className="card-avatar">
                        <a href="#pablo">
                          <img alt="..." class="img img-raised" src={require("assets/img/girl11.jpg")}></img>"
                        </a>
                      </div>

                      <div className="icon icon-primary">
                      <i className="fa fa-quote-right"></i>
                      </div>

                      <div className="card-body">
                  <p className="card-description">크립토베리에서 10번 넘게 구매합니다. 히히</p><br/>
                  <p className="card-description">믿고 사셔도 좋아요 ㅎㅎ</p>
                </div>
                <div className="icon icon-primary">
                  <i className="fa fa-quote-right">
                    
                  </i>
                </div>
                <div className="card-footer">

                <button id="tooltip449471879" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                <Link to="profile-page">
                      <i className="tim-icons icon-single-02">

                      </i>
                      </Link>
                    </button>
                  <h4 className="card-title">효정님</h4>
                  <p classNamee="category">@hyojung</p>

                    </div>
                    </div>
                    
                  </Col>


                <Col className="col-md-3">
                  <div className="card-testimonial card">
                  <div className="card-avatar">
                        <a href="#pablo">
                          <img alt="..." class="img img-raised" src={require("assets/img/man1.jpg")}></img>"
                        </a>
                      </div>

                      <div className="icon icon-primary">
                      <i className="fa fa-quote-right"></i>
                      </div>

                      <div className="card-body">
                  <p className="card-description">명품샵 가기는 귀찮고 그렇다고</p><br/>
                  <p className="card-description">인터넷은 가짜 같은데, 여긴 그 생각을 깨줬습니당</p>
                </div>
                <div className="icon icon-primary">
                  <i className="fa fa-quote-right">
                    
                  </i>
                </div>
                <div className="card-footer">

                <button id="tooltip449471879" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                <Link to="profile-page">
                      <i className="tim-icons icon-single-02">

                      </i>
                      </Link>
                    </button>
                  <h4 className="card-title">Olivia Harper</h4>
                  <p classNamee="category">@oliviaharper</p>

                </div>
                  </div>

                </Col>
                

                <Col className="col-md-3">
                  <div className="card-testimonial card">
                  <div className="card-avatar">
                        <a href="#pablo">
                          <img alt="..." class="img img-raised" src={require("assets/img/girl2.jpg")}></img>"
                        </a>
                      </div>

                      <div className="icon icon-primary">
                      <i className="fa fa-quote-right"></i>
                      </div>

                      <div className="card-body">
                  <p className="card-description">물건이 정말 좋고 예쁩니다!!! &nbsp; 진짜 최고^^</p><br/>
                  <p className="card-description">cryptoberry very nice!!!</p>
                </div>
                <div className="icon icon-primary">
                  <i className="fa fa-quote-right">
               
                  </i>
                </div>
                <div className="card-footer">

                <button id="tooltip449471879" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                <Link to="profile-page">
                      <i className="tim-icons icon-single-02">

                      </i>
                      </Link>
                    </button>
                  <h4 className="card-title">James Logan</h4>
                  <p classNamee="category">@jameslogan</p>

                </div>
                  </div>
            
                </Col>

                <Col className="col-md-3">
                  <div className="card-testimonial card">
                  <div className="card-avatar">
                        <a href="#pablo">
                          <img alt="..." class="img img-raised" src={require("assets/img/man2.jpg")}></img>"
                        </a>
                      </div>

                      <div className="icon icon-primary">
                      <i className="fa fa-quote-right"></i>
                      </div>

                      <div className="card-body">
                  <p className="card-description">한국에 놀러왔더니 이런 사이트도 있고,</p><br/>
                  <p className="card-description">배송이 엄청 빨라서 좋네요</p>
                </div>
                <div className="icon icon-primary">
                  <i className="fa fa-quote-right">
                    
                  </i>
                </div>
                <div className="card-footer">

                <button id="tooltip449471879" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                <Link to="profile-page">
                  <i className="tim-icons icon-single-02">

                      </i>
                      </Link>
                    </button>
                  <h4 className="card-title">DELE ALLI</h4>
                  <p classNamee="category">@delealli</p>

                

                </div>
                  </div>

                </Col>
                
                </Row>
                
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
                  <button type="button" onClick={(e) => {
                                        e.preventDefault();
                                         window.location.href='/new-descript-page?id=${products[1]}';
          }}>
            <img
              alt="..."
              className="img-fluid rounded shadow-lg"
              src={require("assets/img/ballpen3.jpg")}
            />
          </button>
                  </a>
                </div>
                <div className="card-body">
                  <h6 className="category text-warning">Trending</h6>
                  <h4 className="card-title">
                    <a href="#pablo" className="text-white card-link">monblanc ballpen</a>
                  </h4>
                  <div className="card-description">
                    마이스터스튁 클래식 볼펜은 고급 블랙 레진 캡과 배럴로 대표되는 특별한 디자인 아이콘입니다.
                  </div>
                  <div className="card-footer">
                    <div className="price-container">
                      <span className="price">9 ETH</span>
                    </div>
                    <button id="tooltip449471879" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                      <i className="tim-icons icon-heart-2">

                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </Col>

            <Col className="col-md-6 col-lg-3">
              <div className="card-product card">
                <div className="card-image">
                <a href="#pablo">
                  <button type="button" onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href='/new-descript-page?id=${products[2]}';
          }}>
            <img
              alt="..."
              className="img-fluid rounded shadow-lg"
              src={require("assets/img/dior2.jpg")}
              
            />
          </button>
                  </a>
                </div>
                <div className="card-body">
                  <h6 className="category text-warning">Popular</h6>
                  <h4 className="card-title">
                    <a href="#pablo" className="text-white card-link">Dior Belt</a>
                  </h4>
                  <div className="card-description">
                  블랙 Christian Dior 앰보싱 나일론 Saddle 벨트입니다.
                원피스,코트 바지 위에 코디 하실 수 있습니다.
                  </div>
                  <div className="card-footer">
                    <div className="price-container">
                      <span className="price">17 ETH</span>
                    </div>
                    <button id="tooltip320714545" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                      <i className="tim-icons icon-heart-2">
                        
                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </Col>

            <Col className="col-md-6 col-lg-3">
              <div className="card-product card">
                <div className="card-image">
                <a href="#pablo">
                  <button type="button" onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href='/new-descript-page?id=${products[3]}';
          }}>
            <img
              alt="..."
              className="img-fluid rounded shadow-lg"
              src={require("assets/img/patek2.jpg")}
              
            />
          </button>
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
                      <span className="price">555 ETH</span>
                    </div>
                    <button id="tooltip300524105" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                      <i className="tim-icons icon-heart-2">
                        
                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </Col>

            <Col className="col-md-6 col-lg-3">
              <div className="card-product card">
                <div className="card-image">
                <a href="#pablo">
                  <button type="button" onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href='/new-descript-page?id=${products[4}';
          }}>
           
            <img
              alt="..."
              className="img-fluid rounded shadow-lg"
              src={require("assets/img/tagheuer2.jpg")}
              
            />
          </button>
                  </a>
                </div>
                <div className="card-body">
                  <h6 className="category text-warning">Trending</h6>
                  <h4 className="card-title">
                    <a href="#pablo" className="text-white card-link">TAGHeuer watch</a>
                  </h4>
                  <div className="card-description">
                  대한민국 국가대표 축구선수 손흥민이 착용하는 시계!!! 한정판매 중입니다 서두르세요!!
                  </div>
                  <div className="card-footer">
                    <div className="price-container">
                      <span className="price">78 ETH</span>
                    </div>
                    <button id="tooltip755498009" className="btn-simple btn-icon btn-round pull-right btn btn-warning">
                      <i className="tim-icons icon-heart-2">
                        
                      </i>
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
}

export default NewDescriptPage;
