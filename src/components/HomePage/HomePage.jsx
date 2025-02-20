import React from "react";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import styled from 'styled-components'
import CharacterDisplay from "./CharacterDisplay";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";

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
    - go to character page using charId and dynamic routing
    - https://stackoverflow.com/questions/57058879/how-to-create-dynamic-routes-with-react-router-dom
  - REFACTOR: separate auth checking into a resuable util function (consider context below)
  - REFACTOR: create app context to manage app-level state
    - https://legacy.reactjs.org/docs/context.html
    - auth state
    - firebase db
*/

const HomePage = () => {
    const {user, firebaseSignOut} = useFirebaseAuth();
    const navigate = useNavigate();

    const signedIn = user !== null;

    const onSignOutClick = () => {
      firebaseSignOut(() => {
        console.log('signed out');
        navigate('/')
      });
    }

    const onCharacterCreationClick = () => {
      navigate('/character_creation');
    }

    return (
        <div>
          {signedIn &&
          <>
            <h1>Home</h1>
            <SignOutButton onClick={onSignOutClick}>
              Sign out
            </SignOutButton>
            <h2>My Characters</h2>
            <CharacterDisplay uid={user?.uid} onCharacterCreationClick={onCharacterCreationClick}/>
            <h3>My Campaigns</h3>
          </>}
        </div>
    )
}

export default HomePage;