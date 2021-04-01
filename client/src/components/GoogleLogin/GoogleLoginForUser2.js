import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import styled from 'styled-components';

class Login345 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            walletAddress: ''
        }
    }

    componentDidMount() {
        this.getWallet();
    }


    // Google Login
    responseGoogle = (res) => {
        const body = {
            googleId: res.profileObj.googleId,
            imageUrl: res.profileObj.imageUrl,
            email: res.profileObj.email,
            name: res.profileObj.name,
            familyName: res.profileObj.familyName,
            givenName: res.profileObj.givenName,
            walletAddress: walletInstance
          }
        Axios.post("http://localhost:5000/api/user/register", body)
    }

    // Login Fail
    responseFail = (err) => {
        console.error(err);
    }

    getWallet = () => {
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
        return (
            <Container>
                <GoogleLogin
                    clientId={process.env.REACT_APP_Google}
                    buttonText="Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseFail}
                />
            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
    flex-flow: column wrap;
`


export default Login345;