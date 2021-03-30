
import React from 'react';
import { GoogleLogin } from 'react-google-login';
import Container from 'reactstrap/lib/Container';

const clientId = '813360299085-c5cvdrmbd10ek16g3ij92giun4ks84tl.apps.googleusercontent.com';

function Login2(){

    const onSuccess = (res) => {
        console.log('[Login Success] currentUser:', res.profileObj);
        document.location.href = "/main-company"
        
    };

    const onFailure = (res) => {
        console.log('[Login Failed] res:', res);
    };
    
    return(
        <div>
            <Container>
            <GoogleLogin
            clientId={clientId}
            buttonText="  Login with Google    "
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            style={{ marginTop: '100px'}}
            isSignedIn={true}
            />
            </Container>
        </div>
    );

}

export default Login2;