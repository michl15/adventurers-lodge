import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const LoginPage = ({app, analytics}) => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    const handleLoginOnClick = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)

            console.log(credential, token, user)
            navigate("home");

            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            console.log(errorCode, errorMessage, email, credential);
            // ...
    });
    }

    return (
        <div>
            <Button onClick={handleLoginOnClick}>Sign in with Google</Button>
        </div>
    )
}

export default LoginPage;