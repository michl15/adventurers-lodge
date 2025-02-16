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
/*
  TODO:
  - capability to create a new campaign
  - display campaigns that user is participating in
  - capability to click on a character card and open character details for that character
  - REFACTOR: separate auth checking into a resuable util function
  - REFACTOR: create app context to manage app-level state
*/

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
            <h1>Home</h1>
          <SignOutButton onClick={onSignOutClick}>
            Sign out
          </SignOutButton>
          <h2>My Characters</h2>
          <CharacterDisplay uid={userId} onCharacterCreationClick={onCharacterCreationClick}/>
          <h3>My Campaigns</h3>
        </div>
    )
}

export default HomePage;