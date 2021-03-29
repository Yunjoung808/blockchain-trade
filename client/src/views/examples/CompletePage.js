import React, { Component, PropTypes, useState } from "react";
import classnames from "classnames";
import PerfectScrollbar from "perfect-scrollbar";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col
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
            sell_receipt:props.location.state.sell_receipt
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
                                                <h4 className="mt-3 text-left ">#Transaction Hash</h4>
                                                <h4><small className="mr-2">{this.state.sell_receipt}</small></h4>
                                                <Row className="justify-content-md-between">
                                                </Row>
                                                <div className="card-body">
                                                    <Row>
                                                        <Col className="mt-5 col-12">
                                                            <div className="table-responsive">
                                                                <table className="text-right table">
                                                                    <thead className="bg-default">
                                                                        <tr>
                                                                            <th scope="col">Token Index</th>
                                                                            <th className="text-right" scope="col">Product Key</th>
                                                                            <th className="text-right" scope="col">Brand</th>
                                                                            <th className="text-right" scope="col">Product Name</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>tokenIndex</td>
                                                                            <td>productKey</td>
                                                                            <td>brand</td>
                                                                            <td>productName</td>
                                                                        </tr>
                                                                        <tr>
                                                                        </tr>
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th className="text-right">Total</th>
                                                                            <th className="text-right" colSpan="3"> klay</th>
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
                                                                IF you encounter any issue related to the invoice you can contact us at:
                                                            </p>
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