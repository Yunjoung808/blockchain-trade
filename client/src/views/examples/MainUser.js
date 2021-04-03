import React ,{ Component }  from "react";
import UserNavbar from 'components/Navbars/UserNavbar';
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge
} from "reactstrap";
import "assets/css/nucleo-icons.css";
import Footer from "components/Footer/Footer.js";
import { Link } from "react-router-dom";
import Caver from "caver-js";

const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);

class MainUser extends React.Component {
    state = {
        squares1to6: "",
        squares7and8: ""
      };

    constructor(props) {
      super(props)
      this.state = {
        mission:[]
      };
    }

  componentDidMount() {
    document.body.classList.toggle("register-page");
    this.callApi()
    .then(res => this.setState({mission: res}))
    .catch(err => console.log("err:", err))
  }

  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }
  
  //mission데이터 DB에서 불러오기
  callApi = async()=>{
    const response = await fetch('http://localhost:5000/api/mission/getMission');
    const body = await response.json();
    return body;
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
    let Items =  this.state.mission.map(item => {
      if (item._id ==='index') return( <></>)
      return(
        <Col className="mt-5 mt-sm-0" sm="3" xs="6">
          <div className="card-profile card">
            <div className="card-body">
                <hr className="line-primary"></hr>
                  <table className="tablesorter table">
                    <tbody>
                      <tr>
                        <td className="text-left" >
                          <i className="tim-icons icon-bag-16  text-primary" ></i> &nbsp;
                          <p className="category text-primary d-inline">Auth</p>
                        </td>
                        <td className="text-right">{item.title}</td>
                      </tr>
                      <tr>
                      <td className="text-left">
                        <i class="tim-icons icon-money-coins text-primary"/>&nbsp;&nbsp;
                        <p className="category text-primary d-inline">Price</p>
                      </td>
                      <td className="text-right">{item.token} Token</td>  
                    </tr>
                    <tr>
                      <td className="text-left">
                      </td>
                      <td className="text-right">
                        <Button className="btn-round btn-sm" color="primary" type="button" Link tag={Link} to="/register-page"
                                onClick={(e) => {e.preventDefault(); window.location.href='/register-page?index='+item.index;}}>
                             <i className="tim-icons icon-minimal-right"/>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </div>
      </Col>
    )});

    var walletInstance = this.getWallet();
    if (walletInstance) { 
      return (
        <>
          <div className="wrapper">
            <div className="page-header">
            <div className="page-header-image" />
              <div className="content">
              <UserNavbar />
              <img alt="..." className="path" src={require("assets/img/blob.png")} />
                <Container> 
                <Row>
                  <Col className="item"><hr className="line-primary"></hr></Col>
                  <div className="space-50"></div>
                </Row>
                <Card>
                  <CardBody>
                  <Row>
                    <Col className="align-self-center col-md-3">
                    <Badge color="primary">Wallet Address</Badge>
                    </Col>
                    <Col className="align-self-center col-md-8">
                    <p className="text-neutral"><b>
                    {walletInstance.address}</b></p>
                    </Col>
                  </Row>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <h4>기록이 없습니다.</h4>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                  </CardBody>
                </Card>
                <hr className="line-primary"></hr>
                  <Container>
                    <div id="images">
                      <div className="space-50"></div>
                      <Row>
                        <Col md="4">
                          <h1>Get Your Tokens!</h1>
                        </Col>
                      </Row>
                      <Row>
                        {Items}
                      </Row>
                    </div>
                  </Container>
                  <div className="space-70"></div>
                  <div
                  className="square square-3"
                  id="square3"
                />
                <div
                  className="square square-6"
                  id="square6"
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

