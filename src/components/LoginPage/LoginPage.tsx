import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import {
    HeaderImage,
    PageContainer,
    StyledForm,
    StyledHeader,
} from './LoginStyles';
import { firebaseAuth } from '../../firebase/firebase';

const LoginPage = () => {
    const auth = firebaseAuth;
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    const handleLoginOnClick = async () => {
        const result = await signInWithPopup(auth, provider);
        if (result) {
            const credential =
                GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)

            console.log(credential, token, user);
            navigate('home');

        }
        /*         signInWithPopup(auth, provider)
                    .then((result) => {
                        // This gives you a Google Access Token. You can use it to access the Google API.
                        const credential =
                            GoogleAuthProvider.credentialFromResult(result);
                        const token = credential?.accessToken;
                        // The signed-in user info.
                        const user = result.user;
                        // IdP data available using getAdditionalUserInfo(result)
        
                        console.log(credential, token, user);
                        navigate('home');
        
                        // ...
                    })
                    .catch((error) => {
                        // Handle Errors here.
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        // The email of the user's account used.
                        const email = error.customData.email;
                        // The AuthCredential type that was used.
                        const credential =
                            GoogleAuthProvider.credentialFromError(error);
        
                        console.log(errorCode, errorMessage, email, credential);
                        // ...
                    }); */
    };

    return (
        <div data-testid="login-page-container">
            <PageContainer>
                <StyledHeader>Welcome to Adventurer&apos;s Lodge!</StyledHeader>
                <HeaderImage src="https://pngimg.com/uploads/dragon/dragon_PNG84477.png" />
                <StyledForm className="rounded p-4">
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="username"
                            placeholder="Enter Username"
                            data-testid="username-input"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            data-testid="password-input"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Button className="m-1" variant="primary" type="submit" data-testid="login-submit-button">
                            Submit
                        </Button>
                        <Button onClick={handleLoginOnClick} data-testid="google-login-button">
                            Sign in with Google
                        </Button>
                    </Form.Group>
                </StyledForm>
            </PageContainer>
        </div>
    );
};

export default LoginPage;
