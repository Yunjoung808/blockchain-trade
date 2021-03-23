import Axios from 'axios';
import React ,{ Component }  from "react";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col
} from "reactstrap";
// core components

import Footer from "components/Footer/Footer.js";
import { Link } from "react-router-dom";
import Caver from "caver-js";
import Basics from './Basics';

const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);


class MainUser extends React.Component {
    state = {
        squares1to6: "",
        squares7and8: "",
        
      };
  componentDidMount() {
    document.body.classList.toggle("register-page");
    document.documentElement.addEventListener("mousemove", this.followCursor);
    fetch('/products')
    .then(res => res.json())
    .then(products => this.setState({ products }));
    this.callApi()
      .then(res => this.setState({products: res}))
      .catch(err => console.log(err));
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
    document.documentElement.removeEventListener(
      "mousemove",
      this.followCursor
    );
  }
  
  callApi = async()=>{
    const response = await fetch('http://localhost:5000/OldP/products/getOldP');
    const body = await response.json();
    return body;
  }

  //데이터 불러오기
  loadHandler = (event) =>{
  // preventDefault를 해줘야 확인 버튼을 눌렀을때
  // 화면이 새로고침되지 않는다.
  event.preventDefault();
  const body = {
    //로그인된 사람의 ID를 가져오기위해 
    description:this.state.description,
    price:this.state.price,
    images:this.state.file
    // tokens: Tokens[Token-1].value
  }

  //서버에서 가져오기
  Axios.get("http://localhost:5000/OldP/products/getOldP", body)
      .then(response => {
          if(response.data.success){
              alert('상품 불러오기 성공 했습니다.')
              //상품업로드 후 랜딩페이지로 돌아감
              this.props.history.pull('/')
          }else{
              alert('상품 불러오기에 실패 했습니다.')
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

  render() {
    var walletInstance = this.getWallet();
    if (walletInstance) { 
      return (
        <>
          <div className="wrapper">
            <div className="page-header">
            <div className="page-header-image" />
              <div className="content">

                <Container>
                  
                <Row>
                <Col className="item"><hr className="line-primary"></hr></Col>
                <div className="space-50"></div>
              </Row>

                  <Row className="row-grid justify-content-between align-items-center text-left">
                    <Col lg="6" md="6">
                      <h1 className="text-white">We keep your token <br />
                      <span className="text-white">secured</span>
                      </h1>
                      <p className="text-white mb-3">
                        A wonderful serenity has taken possession of my entire soul,
                        like these sweet mornings of spring which I enjoy with my
                        whole heart. I am alone, and feel...
                      </p>
                     

                      
                      <div className="btn-wrapper">
                        <div className="button-container">
                          <Button className="btn-icon btn-simple btn-round btn-neutral" color="default" href="#pablo"
                            onClick={e => e.preventDefault()}>
                          <i className="fab fa-twitter" />
                          </Button>
                          <Button className="btn-icon btn-simple btn-round btn-neutral" color="default" href="#pablo"
                            onClick={e => e.preventDefault()}>
                          <i className="fab fa-dribbble" />
                          </Button>
                          <Button
                            className="btn-icon btn-simple btn-round btn-neutral" color="default" href="#pablo"
                            onClick={e => e.preventDefault()}>
                          <i className="fab fa-facebook" />
                          </Button>
                        </div>
                      </div>
             
                    
                    </Col>
                  
                    <Col lg="4" md="5">
                    <img alt="..." className="img-fluid" src="img/bitcoin.png"/>
                    </Col>
                  </Row>
                  <Basics/>
                      <div
                      className="square square-3"
                      id="square3"
                      style={{ transform: this.state.squares1to6 }}
                    />
                    <div
                      className="square square-4"
                      id="square4"
                      style={{ transform: this.state.squares1to6 }}
                    />
                    <div
                      className="square square-6"
                      id="square6"
                      style={{ transform: this.state.squares1to6 }}
                    />
                  <div class="space-70"></div>
                  <div
                  className="square square-3"
                  id="square3"
                  style={{ transform: this.state.squares1to6 }}
                />
                <div
                  className="square square-4"
                  id="square4"
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

export default MainUser;