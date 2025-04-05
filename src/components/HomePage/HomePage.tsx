import CharacterDisplay from './CharacterDisplay';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

const HomePage = () => {
    const user = useSelector((state: RootState) => state.user.user);

    return (
        <div data-testid="home-page-container">
            {user !== null && (
                <>
                    <h2 data-testid="characters-header">My Characters</h2>
                    <CharacterDisplay uid={user?.uid} />
                    <h3>My Campaigns</h3>
                    <div>Not yet implemented</div>
                </>
            )}
        </div>
    );
};

export default HomePage;
