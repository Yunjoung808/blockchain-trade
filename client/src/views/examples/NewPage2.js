import Axios from 'axios';
import React , { Component } from "react";
import classnames from "classnames";

// reactstrap components
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

// core components
import UserNavbar from "components/Navbars/UserNavbar.js";
import Footer from "components/Footer/Footer.js";
import { Link } from "react-router-dom";




class NewPage extends React.Component {
  state = {
    squares1to6: "",
    squares7and8: ""
  };
  componentDidMount() {
    document.body.classList.toggle("register-page");
    document.documentElement.addEventListener("mousemove", this.followCursor);
    fetch('/products')
    .then(res => res.json())
    .then(products => this.setState({ products }));
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

    this.state = {
      inputFocus: false,
      news:[],
      value:0,min:0,counter:0
    };
  }

  componentDidMount(){
    this.callApi()
      .then(res => this.setState({news: res}))
      .catch(err => console.log(err));
  }

  callApi = async()=>{
    //접속하고자 하는 api주소를 넣어줌
    const response = await fetch('http://localhost:5000/NewP/new/getNewP');
    const body = await response.json();
    return body;
  }

  //데이터 불러오기
  loadHandler = (event) =>{
  event.preventDefault();
  const body = {
    description:this.state.description,
    price:this.state.price,
    images:this.state.file
  }



  //서버에서 가져오기
  Axios.get("http://localhost:5000/NewP/new/getNewP", body)
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

  render() {
    return (
      <>
        <UserNavbar />
        <div className="wrapper">
          <div className="page-header">
            <div className="page-header-image" />
            <div className="content">
              <Container>


              <Row>
                <Col className="item"><hr className="line-primary"></hr></Col>
              </Row>

              <Row>
              <h2>NEW PRODUCT</h2>
             
              </Row>

       
        <div class="space-70"></div>


              <Row>
              <h2>NEW</h2>
              </Row>


               <Row>
                  {Items}
                </Row>

                <Row>
                    <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                    <div className="square square-7" id="square7" style={{ transform: this.state.squares7and8 }}/>
                    <div className="square square-8" id="square8" style={{ transform: this.state.squares7and8 }}/>
                    </Col>
                  </Row>

      
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
              </Container>
            </div>
            
          </div>
          <Footer />
        </div>
      </>
    );
  }
}

export default NewPage;
