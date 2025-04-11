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
import { firebaseAuth, firebaseDatabase } from '../../firebase/firebase';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/UserReducer';
import { CurrentUser } from '../../constants/types';
import { get, ref, update } from 'firebase/database';

const LoginPage = () => {
    const auth = firebaseAuth;
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLoginOnClick = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            if (result) {
                //const credential = GoogleAuthProvider.credentialFromResult(result);
                //const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                const userRef = ref(
                    firebaseDatabase,
                    `users/${user.uid}/userData`
                );
                const snapshot = await get(userRef);
                let userData;
                if (snapshot.exists()) {
                    userData = snapshot.val();
                } else {
                    const newUserData: CurrentUser = {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        photoURL: user.photoURL,
                    };
                    update(userRef, newUserData);
                }

                const newUser: CurrentUser = {
                    uid: userData?.uid || user.uid,
                    displayName: userData?.displayName || user.displayName,
                    email: userData?.email || user.email,
                    emailVerified:
                        userData?.emailVerified || user.emailVerified,
                    photoURL: userData?.emailVerified || user.photoURL,
                };
                dispatch(updateUser(newUser));

                navigate('home');
            }
        } catch (error) {
            console.error('LoginPage', error);
            console.error(
                'The above error occurred while attempting to signInWithPopup'
            );
        }
    };

    return (
        <div data-testid="login-page-container">
            <PageContainer>
                <StyledHeader>Welcome to Adventurer&apos;s Lodge!</StyledHeader>
                <HeaderImage src="https://pngimg.com/uploads/dragon/dragon_PNG84477.png" />
                <div>
                    Currently only sign in with Google is supported, please use
                    that option to sign in
                </div>
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
                        <Button
                            className="m-1"
                            variant="primary"
                            type="submit"
                            data-testid="login-submit-button"
                        >
                            Submit
                        </Button>
                        <Button
                            onClick={handleLoginOnClick}
                            data-testid="google-login-button"
                        >
                            Sign in with Google
                        </Button>
                    </Form.Group>
                </StyledForm>
            </PageContainer>
        </div>
    );
};

export default LoginPage;
