import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Alert, Button, Row } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import {
    HeaderImage,
    PageContainer,
    StyledForm,
    StyledHeader,
} from './LoginStyles';
import { firebaseAuth, firebaseDatabase } from '../../../firebase/firebase';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/UserReducer';
import { CurrentUser } from '../../../constants/types';
import { get, ref, update } from 'firebase/database';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

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

                navigate('/home');
            }
        } catch (error) {
            console.error('LoginPage', error);
            console.error(
                'The above error occurred while attempting to signInWithPopup'
            );
        }
    };

    const onBackClick = () => {
        navigate('/');
    };

    return (
        <div data-testid="login-page-container">
            <PageContainer>
                <StyledHeader>Sign In to Adventurer&apos;s Lodge</StyledHeader>
                <span>placeholder image</span>
                <HeaderImage src="https://www.awesomedice.com/cdn/shop/articles/The_Tavern_by_Johannes_Sundlov.jpg?v=1721745413" />
                <Alert variant="warning">
                    <ExclamationTriangleFill /> Currently only sign in with
                    Google is supported, please use that option to sign in
                </Alert>
                <StyledForm className="rounded p-4">
                    <Form.Group>
                        <Button
                            onClick={handleLoginOnClick}
                            data-testid="google-login-button"
                            size="lg"
                            variant="outline-primary"
                            style={{ borderRadius: '500px' }}
                        >
                            <span>
                                <img
                                    src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        marginRight: '10px',
                                        marginBottom: '3px',
                                    }}
                                    alt="placeholder for login"
                                />
                                Sign in with Google
                            </span>
                        </Button>
                    </Form.Group>
                    <Row>
                        <Button onClick={onBackClick} variant="link">
                            ← Back
                        </Button>
                    </Row>
                </StyledForm>
            </PageContainer>
        </div>
    );
};

export default LoginPage;
