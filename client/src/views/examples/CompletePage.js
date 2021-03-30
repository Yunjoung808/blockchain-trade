import React, { Component, PropTypes, useState } from "react";
import classnames from "classnames";
import PerfectScrollbar from "perfect-scrollbar";
import { Link } from "react-router-dom";
import "assets/css/nucleo-icons.css";

import {
  Container,
  Row,
  Col,
  Button
} from "reactstrap";
import UserNavbar from "components/Navbars/UserNavbar.js";
import Footer from "components/Footer/Footer.js";
import Caver from "caver-js";
import Axios from 'axios';


const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);



let ps = null;

class CompletePage extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            sell_receipt:props.location.state.sell_receipt,
            block_number:props.location.state.block_number
        }
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

    //클레이튼 스코프 바로가기
    onClick = (e) => {
        e.preventDefault(); 
        var scope1 = 'https://baobab.scope.klaytn.com/tx/';
        var scope2 = this.state.sell_receipt;
        var scope3 = '?tabId=eventLog';
        window.location.href=scope1+scope2+scope3;
    }

    render() {
        var walletInstance = this.getWallet();

        if (walletInstance) {
            return (
            <>
            <UserNavbar />
            <img alt="..." className="path" src={require("assets/img/blob.png")} />
                <div className="space-70"></div>
                    <div className="wrapper">
                        <div className="section">
                            <Container>
                                <Row>
                                <div className="space-50"></div>
                                    <div className="ml-auto mr-auto col-md-10">
                                        <div className="card-invoice card">
                                        <div className="progress">
                                            <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                                            aria-valuemax="100" style={{width: "200%"}}>
                                            </div>
                                        </div>
                                            <div className="text-center card-header" data-color-icon="warning">
                                                <br/>
                                                <h3 className="mt-3 text-left text-primary"><i className="tim-icons icon-app">  </i> Transaction Hash</h3>
                                                <h4 className="text-bold">{this.state.sell_receipt}</h4>
                                                <br/>
                                                <Button onClick={this.onClick}>Go To Klaytn Scope  <i className="tim-icons icon-minimal-right"/></Button>
                                                <Row className="justify-content-md-between">
                                                </Row>
                                                <div className="card-body">
                                                    <Row>
                                                        <Col className="mt-5 col-12">
                                                            <div className="table-responsive">
                                                                <table className="text-right table">
                                                                    <thead className="bg-default">
                                                                        <tr>
                                                                            <th scope="col">#Block Number</th>
                                                                            <th scope="col">Date</th>
                                                                            <th scope="col">Auth Type</th>
                                                                            <th className="text-right" scope="col">Token</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>q
                                                                        <tr>
                                                                            <td>{this.state.block_number}</td>
                                                                            <td>2021년 3월 30일</td>
                                                                            <td>Email</td>
                                                                            <td>20</td>
                                                                        </tr>
                                                                        <tr>
                                                                        </tr>
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th className="text-right ">Total</th>
                                                                            <th className="text-right text-primary" colSpan="3">20 Token</th>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <hr className="line-primary ml-auto text-right"/>
                                                <div className="text-right card-footer">
                                                    <Row>
                                                        <Col className="col-md-6">
                                                        </Col>
                                                        <Col className="col-md-6 text-right">
                                                            <h4>Thank you!</h4>
                                                            <p className="description">
                                                                IF you encounter any issue related to the invoice 
                                                            </p>
                                                            <p className="description">you can contact us at</p>
                                                            <h5 className="d-block">
                                                                email : s_holmes25@naver.com
                                                            </h5>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="space-70"></div>
                            </Container>
                        </div>
                    </div>
                <Footer />
            </>
            );
        }
    }
}

export default CompletePage;