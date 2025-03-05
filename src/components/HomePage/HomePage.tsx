import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import styled from 'styled-components'
import CharacterDisplay from "./CharacterDisplay";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../../firebase/firebase";
import { User as FirebaseUser } from "firebase/auth";


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
    const [user, setUser] = useState<FirebaseUser | null>(null);
    onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
    })
    const navigate = useNavigate();

    const signedIn = user !== null;

    const onSignOutClick = () => {
      signOut(firebaseAuth).then(() => {
        navigate('/');
      })
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