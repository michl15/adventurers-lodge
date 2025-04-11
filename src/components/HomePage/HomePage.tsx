import CharacterDisplay from './CharacterDisplay';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Container, Row } from 'react-bootstrap';

const HomePage = () => {
    const user = useSelector((state: RootState) => state.user.user);

    return (
        <div data-testid="home-page-container">
            {user !== null && (
                <Container>
                    <Row>
                        <h2 data-testid="characters-header">My Characters</h2>
                    </Row>
                    <CharacterDisplay uid={user?.uid} />
                    <h2>My Campaigns</h2>
                    <div>Not yet implemented</div>
                </Container>
            )}
        </div>
    );
};

export default HomePage;
