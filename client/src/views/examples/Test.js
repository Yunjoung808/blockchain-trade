import React, { Component } from 'react';
import Caver from "caver-js";
import Mission from 'views/examples/Mission.js';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer'
import UserNavbar from 'components/Navbars/UserNavbar';
import Footer from "components/Footer/Footer.js";

const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);


import {
    Row,
    Col,
    Card,
    CardBody,
    Container
  } from "reactstrap";

class Test extends React.Component{

    state={
        mission:""
      };
   
    componentWillUnmount() {
    document.body.classList.toggle("index-page");
    }

  
    componentDidMount(){
        document.body.classList.toggle("index-page");
        this.callApi()
        .then(res => this.setState({mission: res}))
        .catch(err => console.log("err:", err))
    }
  
  callApi = async()=>{
    const response = await fetch('http://localhost:5000/api/hello');
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



  render(){
    var walletInstance = this.getWallet();
    if (walletInstance) { 
        const {mission}=this.props;
      return (
        <>
        <UserNavbar/>
          <div className="wrapper">
            <div className="page-header">
                <img
                alt="..."
                className="dots"
                src={require("assets/img/dots.png").default}
                />
                <img
                    alt="..."
                    className="path"
                    src={require("assets/img/path4.png").default}
                />
            <div className="page-header-image" />
              <div className="content">
                <Container>
                    <Row>
                        <Col className="ml-auto mr-auto" md="10" xl="6">
                            <Card>
                                <CardBody>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><h3>번호</h3></TableCell>
                                                <TableCell><h3>제목</h3></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {this.state.mission ? this.state.mission.map(c =>{return(<Mission key={c.id} index={c.index} title={c.title}/>);}) : ""}
                                        </TableBody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col className="ml-auto mr-auto" md="10" xl="6">
                            <Card>
                                <CardBody>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><h3>번호</h3></TableCell>
                                                <TableCell><h3>제목</h3></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {this.state.mission ? this.state.mission.map(c =>{return(<Mission key={c.id} index={c.index} title={c.title}/>);}) : ""}
                                        </TableBody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
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


export default Test;