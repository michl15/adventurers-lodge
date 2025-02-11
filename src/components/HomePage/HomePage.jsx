import React, { useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import styled from 'styled-components'
import CharacterDisplay from "./CharacterDisplay";

const SignOutButton = styled(Button)`
    position: absolute;
    top: 10px;
    right: 10px;
`

const HomePage = () => {
    const [userId, setUserId] = useState('');

    const auth = getAuth();
    const navigate = useNavigate();
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          setUserId(uid);
          // ...
        } else {
          // User is signed out
          // ...
          navigate('/');
        }
      });

      const onSignOutClick = () => {
        signOut(auth).then(() => {
          // Sign-out successful.
          console.log('User signed out');
        }).catch((error) => {
          // An error happened.
          console.error('Error signing out:', error);
        });
      }

      const onCharacterCreationClick = () => {
        navigate('/character_creation');
      }

    return (
        <div>
          <SignOutButton onClick={onSignOutClick}>
            Sign out
          </SignOutButton>
          <CharacterDisplay uid={userId}/>
          <Button onClick={onCharacterCreationClick}>
            Create Character
          </Button>
            Homepage
        </div>
    )
}

export default HomePage;