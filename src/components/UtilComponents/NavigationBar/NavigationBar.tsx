import { signOut } from 'firebase/auth';
import {
    Container,
    Dropdown,
    DropdownButton,
    Nav,
    Navbar,
    NavbarBrand,
    NavDropdown,
} from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router';
import { firebaseAuth } from '../../../firebase/firebase';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../../redux/UserReducer';
import { PersonCircle } from 'react-bootstrap-icons';
import { RootState } from '../../../redux';

const NavigationBar = () => {
    const [showNavBar, setShowNavBar] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    const onSignOut = () => {
        signOut(firebaseAuth).then(() => {
            navigate('/');
        });
        dispatch(removeUser());
    };

    const onAccountClick = () => {
        navigate(`/profile/${user?.uid}`);
    };

    const onSettingsClick = () => {
        navigate(`/account`);
    };

    useEffect(() => {
        setShowNavBar(
            location.pathname !== '/auth_error' &&
                location.pathname !== '/login'
        );
    }, [location.pathname]);

    return (
        showNavBar && (
            <Navbar
                bg="info"
                variant="dark"
                sticky="top"
                data-testid="navigation-bar"
                style={{ padding: '15px 0px' }}
            >
                <Container fluid>
                    <Nav>
                        <NavbarBrand as={Link} to="/">
                            Adventurer&apos;s Lodge
                        </NavbarBrand>
                        {user && (
                            <Nav.Link as={Link} to="/home">
                                Home
                            </Nav.Link>
                        )}
                        <Nav.Link as={Link} to="/browse">
                            Browse
                        </Nav.Link>
                        {user && (
                            <NavDropdown title="Create">
                                <NavDropdown.Item
                                    as={Link}
                                    to="/character_creation"
                                >
                                    Create a Character
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    as={Link}
                                    to="/campaign_creation"
                                >
                                    Create a Campaign (TODO)
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                    {user && (
                        <DropdownButton
                            className="justify-content-end"
                            variant="outline-light"
                            data-testid="navbar-dropdown-btn"
                            title={
                                <>
                                    <PersonCircle
                                        style={{ margin: '0px 5px 3px 0px' }}
                                    />
                                    {user?.displayName
                                        ? user.displayName
                                        : 'Profile'}
                                </>
                            }
                            align="end"
                        >
                            <Dropdown.Item
                                onClick={onAccountClick}
                                data-testid="profile-btn"
                            >
                                View Profile
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={onSettingsClick}
                                data-testid="account-btn"
                            >
                                Account Settings
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={onSignOut}
                                data-testid="signout-btn"
                            >
                                Sign Out
                            </Dropdown.Item>
                        </DropdownButton>
                    )}
                </Container>
            </Navbar>
        )
    );
};

export default NavigationBar;
