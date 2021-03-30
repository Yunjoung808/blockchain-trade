import React, { Component, PropTypes, useState } from "react";
import classnames from "classnames";
import PerfectScrollbar from "perfect-scrollbar";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col
} from "reactstrap";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footer/Footer.js";
import Caver from "caver-js";
import Axios from 'axios';

const config = {rpcURL: 'https://api.baobab.klaytn.net:8651'}
const caver = new Caver(config.rpcURL);


let ps = null;

class OrderCompletePageOld extends React.Component {
    

    constructor(props) {
        super(props)
        this.submitHandler(props.location.state.tokenIndex,props.location.state.sell_receipt)
        this.state = {
            // description:props.location.state.description,
            tokenIndex:props.location.state.tokenIndex,
            images:props.location.state.images,
            date:props.location.state.date,
            productKey:props.location.state.productKey,
            productName:props.location.state.productName,
            brand:props.location.state.brand,
            price:props.location.state.price,
            sell_receipt:props.location.state.sell_receipt
        }
    }
    
    submitHandler = (_tokenIndex, _sell_receipt) =>{
        const body = {
            tokenIndex:_tokenIndex,
            sell_receipt:_sell_receipt
            // price:this.state.price,
            // tokenIndex:this.state.tokenIndex,
            // description:this.state.description,
            // brand:this.state.brand,
            // images:this.state.file,
            // date:this.state.date,
            // productName:this.state.productName,
            // productKey:this.state.productKey,
            // price:this.state.amount,
            // tokens: Tokens[Token-1].value
        }
        Axios.post("http://localhost:5000/OldP/products/receipt", body)
            .then(response => {
                if(response.data.success || this.state._sell_receipt){
                    alert('구매 완료')
                    // this.props.history.push('/')
                }else{
                    alert('sell_receipt update 실패')
                }
            })
        }

    toggleTabs = (e, stateName, index) => {
        e.preventDefault();
        this.setState({
        [stateName]: index
        });
    };

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
                <IndexNavbar />
                <div className="space-70"></div>
                    <div className="wrapper">
                        <div className="section">
                            <Container>
                                <Row>
                                    <div className="ml-auto mr-auto col-md-10">
                                        <div className="card-invoice card">
                                            <div className="text-center card-header" data-color-icon="warning">
                                               
                                                
                                                <h4 className="mt-3 text-left text-success">#Transaction Hash</h4>
                                                <h4><small className="mr-2">{this.state.sell_receipt}</small></h4>
                                                <Row className="justify-content-md-between">
                                                </Row>
                                                <div className="card-body">
                                                    <Row>
                                                        <Col className="mt-5 col-12">
                                                            
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
                                                                            <td>{this.state.tokenIndex}</td>
                                                                            <td>{this.state.productKey}</td>
                                                                            <td>{this.state.brand}</td>
                                                                            <td>{this.state.productName}</td>
                                                                        </tr>
                                                                        <tr>
                                                                        </tr>
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <th className="text-right">Total</th>
                                                                            <th className="text-right" colSpan="3">{this.state.price} klay</th>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <hr className="line-info ml-auto"/>
                                                <div className="text-right card-footer">
                                                    <Col className="col-md-5">
                                                        <h4>Thank you!</h4>
                                                        <p className="description">
                                                            IF you encounter any issue related to the invoice you can contact us at:
                                                        </p>
                                                        <h5 className="d-block">
                                                            email:
                                                            <small className="text-muted">s_holmes25@naver.com</small>
                                                        </h5>
                                                    </Col>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                            </Container>
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

export default OrderCompletePageOld;