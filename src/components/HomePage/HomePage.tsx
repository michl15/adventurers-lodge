import { useEffect, useState } from 'react';
import CharacterDisplay from './CharacterDisplay';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../../firebase/firebase';
import { User as FirebaseUser } from 'firebase/auth';

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

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (u) => {
            setUser(u);
        });
    }, [])

    return (
        <div data-testid="home-page-container">
            {user !== null && (
                <>
                    <h2 data-testid="characters-header">My Characters</h2>
                    <CharacterDisplay
                        uid={user?.uid}
                    />
                    <h3>My Campaigns</h3>
                </>
            )}
        </div>
    );
};

export default HomePage;
